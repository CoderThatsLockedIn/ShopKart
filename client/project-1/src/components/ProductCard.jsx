import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axios.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, initialInWishlist = false }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(initialInWishlist);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false); 
  const [errorMsg, setErrorMsg] = useState('');

  const {
    _id,
    id,
    name = 'Mechanical Keyboard',
    price = 2999,
    category = 'Electronics',
    image,
    stock = 10,
  } = product || {};

  const productId = _id || id;
  const isInStock = stock > 0;

  const isInCart = cartItems.some(
    (item) => item.product?._id?.toString() === productId?.toString()
  );

  const handleViewDetails = () => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  // Task 5: Handle Wishlist Toggle
  const handleWishlistToggle = async () => {
    if (wishlistLoading || !productId) return;

    setWishlistLoading(true);
    setErrorMsg('');

    try {
      if (!isWishlisted) {
        await axiosInstance.post(`/wishlist/${productId}`);
        setIsWishlisted(true);
      } else {
        await axiosInstance.delete(`/wishlist/${productId}`);
        setIsWishlisted(false);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

 
  const handleAddToCart = async () => {
    if (cartLoading || !productId || !isInStock) return;

    setCartLoading(true);
    setErrorMsg('');

    const res = await addToCart(productId);
    if (!res.success) {
      setErrorMsg(res.message || 'Failed to add item to cart.');
    }

    setCartLoading(false);
  };

  return (
    <div className="group bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40 hover:shadow-indigo-500/10">
      
      {/* Product Image Area */}
      <div className="relative w-full h-48 bg-zinc-950/80 overflow-hidden flex items-center justify-center border-b border-zinc-800/60">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-600">
            <svg className="w-10 h-10 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2V6a2 2 0 002-2z" />
            </svg>
            <span className="text-xs uppercase tracking-wider font-semibold">PRODUCT IMAGE</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {name}
          </h3>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {category}
          </p>
          <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 pt-1">
            ₹{typeof price === 'number' ? price.toLocaleString('en-IN') : price}
          </p>
          <p className={`text-xs font-medium pt-0.5 ${isInStock ? 'text-zinc-400' : 'text-rose-400'}`}>
            {isInStock ? `${stock} units left` : 'Out of stock'}
          </p>
        </div>

        {/* Actions Area */}
        <div className="space-y-2">
          {/* Task 7: Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartLoading || !isInStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
              !isInStock
                ? 'bg-zinc-800/40 text-zinc-500 border-zinc-800 cursor-not-allowed'
                : cartLoading
                ? 'bg-indigo-600/50 text-indigo-200 border-indigo-500/30 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 hover:border-indigo-400 active:scale-[0.98]'
            }`}
          >
            {cartLoading
              ? '⏳ Adding...'
              : !isInStock
              ? 'Out of Stock'
              : isInCart
              ? '🛒 Add Another'
              : '🛒 Add to Cart'}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
              isWishlisted
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-zinc-800/80 text-zinc-300 hover:text-white border-zinc-700/80 hover:bg-zinc-800'
            } ${wishlistLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {wishlistLoading ? (
              <>⏳ Saving...</>
            ) : isWishlisted ? (
              <>♥ Added to Wishlist</>
            ) : (
              <>♡ Add to Wishlist</>
            )}
          </button>

          {/* View Details Button */}
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full py-2.5 px-4 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 hover:text-white border border-zinc-700/80 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group/btn shadow-md shadow-black/20"
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

          {/* Error Message Display */}
          {errorMsg && (
            <p className="text-[11px] text-rose-400 text-center font-medium pt-1">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}