import React, { useState } from 'react';
import axiosInstance from '../axios/axios.js'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
export default function SignUp() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false);
  const { setCustomer } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('')
    setLoader(true);
    try {
      await axiosInstance.post('/customer/register', form);
      const profileRes = await axiosInstance.get('/customer/me')
      const customerData = profileRes.data.customer || profileRes.data.data || profileRes.data;
      setCustomer(customerData)
      navigate('/home');
    }
    catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      setErr(error.response?.data?.message || 'Registration failed')
    }
    finally {
      setLoader(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Glow Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl shadow-black/50 relative z-10">

        {/* Logo Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            {/* Replace this SVG with your actual logo image/component */}
            <svg
              className="w-6 h-6 text-white"
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
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5">
            Enter your details below to get started
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Alex Mercer"
              className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 text-sm transition duration-200"
              required
              onChange={handleChange}
              value={form.fullName}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="email"
              className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 text-sm transition duration-200"
              required
              onChange={handleChange}
              value={form.email}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 text-sm transition duration-200"
              required
              onChange={handleChange}
              value={form.phone}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 text-sm transition duration-200"
              required
              onChange={handleChange}
              value={form.password}
            />
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            {loader ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link to='/login' className="text-zinc-200 font-medium hover:text-white hover:underline transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}