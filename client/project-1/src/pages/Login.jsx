import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axiosInstance from '../axios/axios.js'
import {useAuth} from '../context/AuthContext.jsx'
export default function Login() {
  const [form, setForm] = useState({email: "", password: ""});
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const {setCustomer} = useAuth()
  const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]:e.target.value}))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('')
    setLoader(true);
    try {
      await axiosInstance.post('/customer/login', form);
      const response = await axiosInstance.get('/customer/me')
      const loggedInCustomer = response.data.customer || response.data.data || response.data;
      setCustomer(loggedInCustomer);
      navigate('/home');
    }
    catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || 'Invalid email or password')
    }
    finally {
      setLoader(false)
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
            Welcome back
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id = "email"
              type="email"
              name = "email"
              placeholder="alex@example.com"
              className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 text-sm transition duration-200"
              required
              onChange = {handleChange}
              value = {form.email}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition">
                Forgot password?
              </a>
            </div>
            <input
              id = "password"
              name = "password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-600 text-sm transition duration-200"
              required
              value = {form.password}
              onChange = {handleChange}
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2.5 block text-xs text-zinc-400 select-none cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          Don't have an account?{' '}
          <Link to = '/register' className="text-zinc-200 font-medium hover:text-white hover:underline transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}