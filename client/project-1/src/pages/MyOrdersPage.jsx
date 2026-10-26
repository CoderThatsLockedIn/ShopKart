import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axios/axios.js';
import NavBar from '../components/NavBar.jsx';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/orders');
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-4xl w-full mx-auto my-8 p-4">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

        {loading ? (
          <div className="text-center text-zinc-400 py-12">Loading orders...</div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
            <p className="text-zinc-400 text-lg">You have not placed any orders yet.</p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex flex-wrap justify-between items-center border-b border-zinc-800 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                      Order ID
                    </span>
                    <span className="text-sm font-mono text-zinc-200">#{order._id}</span>
                    <span className="text-xs text-zinc-500 block">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Status: {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-zinc-300">
                      <span>
                        {item.name} <span className="text-zinc-500 font-mono">× {item.quantity}</span>
                      </span>
                      <span className="font-mono">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                  <span className="text-sm font-semibold text-zinc-400">Total Amount</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;