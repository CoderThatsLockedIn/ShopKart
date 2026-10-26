import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import axiosInstance from '../axios/axios.js';
import NavBar from '../components/NavBar.jsx';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { id } = useParams();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order && !!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && id) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/orders/${id}`);
          setOrder(res.data.order || res.data);
        } catch (err) {
          console.error('Failed to fetch order details:', err);
          setError('Unable to load order details or access denied.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [id, order]);

  const orderId = order?._id || id || 'N/A';
  const totalAmount = order?.totalAmount || 0;
  const status = order?.status || 'PLACED';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-2xl w-full mx-auto my-12 p-8 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl text-center">
        {loading ? (
          <div className="text-zinc-400 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3"></div>
            Loading order details...
          </div>
        ) : error ? (
          <div className="text-red-400 font-medium my-4">{error}</div>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-extrabold text-white mb-2">
              Order Details
            </h1>
            <p className="text-zinc-400 mb-8 text-sm">
              Your order has been saved successfully.
            </p>

            <div className="bg-zinc-950/60 rounded-xl p-6 mb-8 text-left space-y-3 border border-zinc-800">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400 font-medium text-sm">Order ID</span>
                <span className="font-mono text-xs font-semibold text-zinc-200 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700/60">
                  {orderId}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400 font-medium text-sm">Total</span>
                <span className="text-lg font-bold text-white font-mono">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-medium text-sm">Status</span>
                <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto bg-zinc-800 text-zinc-300 font-semibold px-6 py-2.5 rounded-xl hover:bg-zinc-700 border border-zinc-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OrderSuccessPage;