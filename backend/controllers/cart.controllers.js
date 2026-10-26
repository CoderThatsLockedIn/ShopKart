import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const addToCart = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(401).json({ message: 'Customer not found' });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid or missing product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!Array.isArray(customer.cart)) {
      customer.cart = [];
    }

    // Check if item already exists in cart safely
    const productIndex = customer.cart.findIndex((item) => {
      const pId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return pId === productId;
    });

    if (productIndex === -1) {
      if (product.stock >= quantity) {
        // Push object containing required _id to satisfy schema validation
        customer.cart.push({
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          },
          quantity: Number(quantity),
        });
      } else {
        return res.status(400).json({ message: 'Out of stock!' });
      }
    } else {
      const existingQuantity = customer.cart[productIndex].quantity;
      if (existingQuantity + quantity <= product.stock) {
        customer.cart[productIndex].quantity += Number(quantity);
      } else {
        return res.status(400).json({
          message: `Cannot add more. Only ${product.stock} units available.`,
        });
      }
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: customer.cart,
    });
  } catch (err) {
    console.error('Error in addToCart:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Standard findById without .populate() since cart stores embedded product objects
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(401).json({ message: 'Customer not found' });
    }

    // Filter out invalid items if any
    const validCart = (customer.cart || []).filter(
      (item) => item.product && (item.product._id || item.product)
    );

    return res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (err) {
    console.error('Error in getCart:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const cartItem = customer.cart.find((item) => {
      const pId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      const subId = item._id ? item._id.toString() : null;
      return pId === productId || subId === productId;
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = Math.max(1, Number(quantity));
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Quantity updated',
      cart: customer.cart,
    });
  } catch (err) {
    console.error('Update quantity error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    const { productId } = req.params;

    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const initialLength = customer.cart.length;

    customer.cart = customer.cart.filter((item) => {
      const pId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      const subId = item._id ? item._id.toString() : null;
      return pId !== productId && subId !== productId;
    });

    if (customer.cart.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: customer.cart,
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};