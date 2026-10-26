import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Subtle Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
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
        </div>

        {/* Navigation Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to = '/login'
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to = '/register'
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 text-center py-20 relative z-10 my-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-300 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Now Live & Ready
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Build faster with our modern <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            all-in-one platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience a sleek, optimized workflow designed to streamline your development process. Get started in minutes with complete flexibility.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] text-center"
          >
            Get Started Free
          </a>
          <a
            href="#"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900/70 hover:bg-zinc-800/80 text-zinc-200 border border-zinc-800 rounded-xl font-semibold transition duration-200 backdrop-blur-md text-center"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 text-center text-xs text-zinc-600 relative z-10 border-t border-zinc-900">
        © {new Date().getFullYear()} ShopKart. All rights reserved.
      </footer>
    </div>
  );
}