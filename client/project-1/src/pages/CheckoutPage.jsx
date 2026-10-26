import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import axiosInstance from '../axios/axios.js';
import NavBar from '../components/NavBar.jsx';

const CheckoutPage = () => {
  const { cartItems = [], clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const getProductDetails = (item) => {
    const prod = item.product || item.productId || item;
    return {
      name: prod?.name || item?.name || 'Product',
      price: Number(prod?.price || item?.price || 0),
      quantity: Number(item?.quantity || 1),
    };
  };

  const calculatedTotal = cartItems.reduce((acc, item) => {
    const { price, quantity } = getProductDetails(item);
    return acc + price * quantity;
  }, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.addressLine1.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      return 'Please fill in all shipping details.';
    }
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      return 'Phone number must be a valid 10-digit number.';
    }
    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      return 'Pincode must contain 6 digits.';
    }
    return null;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!window.Razorpay) {
      setError('Razorpay SDK failed to load. Please check your internet connection or script tag.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 1. Create order on backend (returns Razorpay order details)
      const { data } = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.addressLine1.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      });

      // 2. Configure Razorpay Checkout options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopKart',
        description: 'Engineering Lab 06 Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            setSubmitting(true);
            // 3. Send signature verification payload back to backend
            const verifyRes = await axiosInstance.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            });

            if (verifyRes.data.success) {
              if (clearCart) {
                await clearCart();
              }
              navigate('/orders');
            }
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            setError(verifyErr.response?.data?.message || 'Payment verification failed.');
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: {
          color: '#059669',
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-2xl w-full mx-auto my-8 p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">
            Checkout
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-zinc-200 mb-4">Shipping Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Phone (10 digits)
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="House No, Street, Landmark"
                    className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Pincode (6 digits)
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="560001"
                    className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-200 mb-4">Order Summary</h2>

              <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800 space-y-3 mb-6">
                {cartItems.map((item, index) => {
                  const { name, price, quantity } = getProductDetails(item);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm py-1 border-b border-zinc-800/60 last:border-0"
                    >
                      <span className="text-zinc-200">
                        {name} <span className="text-zinc-400 font-mono">× {quantity}</span>
                      </span>
                      <span className="text-zinc-200 font-mono">
                        ₹{(price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}

                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-base font-bold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-emerald-400 text-lg">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Processing Payment...' : 'Proceed to Pay'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;