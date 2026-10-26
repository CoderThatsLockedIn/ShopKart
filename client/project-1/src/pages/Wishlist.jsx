import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axios.js';
import NavBar from '../components/NavBar.jsx'; // 1. Import your Navbar component

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get('/wishlist');
      setWishlist(response.data?.wishlist || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      setWishlist((prev) =>
        prev.filter((product) => (product._id || product.id) !== productId)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove product');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col">
      {/* 2. Render NavBar at top of page */}
      <NavBar />

      <main className="flex-1 flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm font-medium">
            Loading your wishlist...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <p className="text-rose-400 font-semibold text-base">Unable to load wishlist.</p>
            <button
              type="button"
              onClick={fetchWishlist}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition duration-200 cursor-pointer shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-4">
            <h2 className="text-2xl font-bold tracking-tight">Your wishlist is empty ❤️</h2>
            <p className="text-xs font-medium text-zinc-400 mb-4">Start saving products you love.</p>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition duration-200 shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Wishlist Items Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="max-w-7xl mx-auto w-full px-6 py-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">My Wishlist</h1>
                <p className="text-xs text-zinc-400 mt-1">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => {
                const productId = product._id || product.id;

                return (
                  <div
                    key={productId}
                    className="group bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40 hover:shadow-indigo-500/10"
                  >
                    <div className="relative w-full h-48 bg-zinc-950/80 overflow-hidden flex items-center justify-center border-b border-zinc-800/60">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-600">
                          <svg className="w-10 h-10 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs uppercase tracking-wider font-semibold">PRODUCT IMAGE</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          {product.category}
                        </p>
                        <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 pt-1">
                          ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${productId}`)}
                          className="w-full py-2.5 px-4 bg-zinc-800/80 hover:bg-indigo-600 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-indigo-500/50 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group/btn shadow-md shadow-black/20"
                        >
                          <span>View Details</span>
                          <svg
                            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(productId)}
                          className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold tracking-wide transition duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                        >
                          Remove from Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}