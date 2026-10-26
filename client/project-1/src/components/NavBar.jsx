import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate, NavLink } from 'react-router-dom';

export default function NavBar() {
  const { logout } = useAuth();
  const { totalCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <NavLink to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-lg text-white">ShopKart</span>
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              Wishlist
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              <span>Cart</span>
              <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {totalCartCount}
              </span>
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              My Orders
            </NavLink>
          </nav>
        </div>

        {/* Right Action: Logout */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-zinc-800/80 text-zinc-200 hover:text-red-400 border border-zinc-700/80 hover:border-red-500/30 rounded-xl text-xs font-semibold transition duration-200 active:scale-[0.98] cursor-pointer flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}