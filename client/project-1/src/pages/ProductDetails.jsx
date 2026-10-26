import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../axios/axios.js';
import NavBar from '../components/NavBar.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/products/${id}`);

        // Handle both direct object response and wrapped payload formats
        const productData = response.data.product || response.data.data || response.data;
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const isInStock = product?.stock > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 relative z-10 flex flex-col justify-center">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-zinc-400 gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading product details...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl text-center my-8">
            {error}
          </div>
        )}

        {/* Product Details Layout */}
        {!loading && !error && product && (
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/50 grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* 1. Large Product Image */}
            <div className="w-full h-80 md:h-[420px] bg-zinc-950/80 rounded-2xl overflow-hidden border border-zinc-800/60 flex items-center justify-center relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                  <svg className="w-16 h-16 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider font-semibold">NO IMAGE AVAILABLE</span>
                </div>
              )}

              {/* Stock Status Tag */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-2 ${
                  isInStock
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {isInStock ? `${product.stock} units left` : 'Out of Stock'}
              </div>
            </div>

            {/* 2. Product Meta Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 bg-zinc-800/80 border border-zinc-700/60 rounded-full text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  {product.category || 'General'}
                </span>

                {/* Name */}
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                </p>

                {/* Description */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {product.description || 'No detailed description available for this product.'}
                  </p>
                </div>
              </div>

              {/* 3. Add to Cart Button (UI Only) */}
              <button
                type="button"
                disabled={!isInStock}
                onClick={() => alert('Add to Cart feature coming soon!')}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:border-zinc-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-2xl transition duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-600 relative z-10 border-t border-zinc-900">
        © {new Date().getFullYear()} ShopKart. All rights reserved.
      </footer>
    </div>
  );
}