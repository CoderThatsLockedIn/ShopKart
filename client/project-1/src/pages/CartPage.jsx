import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import NavBar from '../components/NavBar.jsx'; // Adjust path if needed

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    refreshCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Derived values for Order Summary
  const totalItemTypes = cartItems.length;
  const totalQuantityCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  // -------------------------------------------------------------
  // 1. LOADING STATE
  // -------------------------------------------------------------
  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-12 text-center space-y-4 max-w-md w-full shadow-2xl shadow-black/40">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-zinc-300 font-medium text-sm tracking-wide">
              Loading your cart...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ERROR STATE
  // -------------------------------------------------------------
  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-12 text-center space-y-4 max-w-md w-full shadow-2xl shadow-black/40">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-white">Unable to load your cart.</h2>
            <p className="text-rose-400 text-xs font-medium">{error}</p>
            <button
              type="button"
              onClick={refreshCart}
              className="mt-2 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/80 hover:border-zinc-600 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. EMPTY STATE
  // -------------------------------------------------------------
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-12 text-center space-y-4 max-w-md w-full shadow-2xl shadow-black/40">
            <div className="text-5xl">🛒</div>
            <h2 className="text-xl font-bold text-white">Your cart is empty 🛒</h2>
            <p className="text-zinc-400 text-sm">
              Looks like you haven't added anything yet.
            </p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="mt-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-indigo-600/25 active:scale-[0.98] cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. ACTIVE CART CONTENT
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <NavBar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              My Cart ({totalQuantityCount})
            </h1>
            <button
              onClick={() => navigate('/products')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              ← Continue Shopping
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product || {};
                const productId = product._id;
                const itemTotal = (product.price || 0) * item.quantity;
                const isAtMaxStock = item.quantity >= product.stock;

                return (
                  <div
                    key={productId || Math.random()}
                    className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-xl shadow-black/40 hover:border-zinc-700/80 transition-all"
                  >
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <div className="w-20 h-20 bg-zinc-950/80 rounded-2xl overflow-hidden border border-zinc-800 flex-shrink-0 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-zinc-600 font-semibold uppercase">
                            NO IMAGE
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-white text-base line-clamp-1">
                          {product.name || 'Product'}
                        </h3>
                        <p className="text-sm font-semibold text-indigo-400">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Stock: {product.stock ?? 'N/A'} units
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                      <p className="text-base font-extrabold text-white">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(productId, item.quantity, -1)
                            }
                            disabled={item.quantity <= 1 || loading}
                            className="px-3 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-zinc-200">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(productId, item.quantity, 1)
                            }
                            disabled={isAtMaxStock || loading}
                            className="px-3 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(productId)}
                          disabled={loading}
                          className="p-2 text-zinc-400 hover:text-rose-400 transition-colors text-xs font-semibold cursor-pointer"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 space-y-6 shadow-xl sticky top-24">
                <h2 className="text-lg font-bold text-white border-b border-zinc-800/80 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Items</span>
                    <span className="font-semibold text-zinc-200">{totalItemTypes}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Quantity</span>
                    <span className="font-semibold text-zinc-200">{totalQuantityCount}</span>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3 flex justify-between text-base font-bold text-white">
                    <span>Subtotal</span>
                    <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0 || loading}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}