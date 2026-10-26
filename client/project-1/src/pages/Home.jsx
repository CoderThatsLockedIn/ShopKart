import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import NavBar from '../components/NavBar.jsx';

export default function Home() {
  const { customer, loader } = useAuth();

  if (loader) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading customer profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500/10 blur-[140px] rounded-full pointer-events-none" />




      <NavBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex items-center justify-center relative z-10">
        <div className="w-full bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl shadow-black/50">
          
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Protected Profile
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
              Welcome, {customer?.fullName || 'Customer'}!
            </h1>
          </div>

          <div className="space-y-4">
            {/* Customer Name */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Customer Name
                </p>
                <p className="text-base font-medium text-zinc-100 mt-0.5">
                  {customer?.fullName || 'N/A'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                👤
              </div>
            </div>

            {/* Email Address */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email Address
                </p>
                <p className="text-base font-medium text-zinc-100 mt-0.5">
                  {customer?.email || 'N/A'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                ✉️
              </div>
            </div>

            {/* Phone Number */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Phone Number
                </p>
                <p className="text-base font-medium text-zinc-100 mt-0.5">
                  {customer?.phone || 'N/A'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                📞
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-600 relative z-10 border-t border-zinc-900">
        © {new Date().getFullYear()} ShopKart. All rights reserved.
      </footer>
    </div>
  );
}