import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { shippingAddress } = req.body;
    if (
      !shippingAddress ||
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.phone?.trim() ||
      !shippingAddress.addressLine1?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.state?.trim() ||
      !shippingAddress.pincode?.trim()
    ) {
      return res.status(400).json({ message: 'All shipping details are required.' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer || !Array.isArray(customer.cart) || customer.cart.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of customer.cart) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ message: 'One or more items in cart no longer exist.' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
        });
      }

      calculatedTotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // 1. Create Razorpay Order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(calculatedTotal * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const order = new Order({
      user: customerId,
      items: orderItems,
      shippingAddress,
      totalAmount: calculatedTotal,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    });

    await order.save();

    return res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
    });
  } catch (err) {
    console.error('Error in createPaymentOrder:', err);
    return res.status(500).json({ message: 'Failed to create payment order', error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== customerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    // Verify cryptographic signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Deduct stock for purchased items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Update order status and payment IDs
    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    await Customer.findByIdAndUpdate(customerId, { $set: { cart: [] } });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (err) {
    console.error('Error in verifyPayment:', err);
    return res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error('Error in getMyOrders:', err);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== customerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('Error in getOrderById:', err);
    return res.status(500).json({ message: 'Failed to fetch order details' });
  }
};