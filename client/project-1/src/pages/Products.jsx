import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios/axios.js';
import NavBar from '../components/NavBar.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Category states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Fetch filtered products from backend whenever search or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Construct query parameters object
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category && category !== 'All Categories') params.category = category;

        // Axios builds URL automatically: GET /products?search=phone&category=Electronics
        const response = await axiosInstance.get('/products', { params });

        const productList = Array.isArray(response.data)
          ? response.data
          : response.data.products || response.data.data || [];

        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input slightly to avoid excessive API requests on every keystroke
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category]);

  const handleViewDetails = (product) => {
    console.log('Viewing details for:', product);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <NavBar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10">
        
        {/* Header Title */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Catalog
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
            Explore Products
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Browse our collection of available items.
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500/80 rounded-xl text-sm text-zinc-200 outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="" className="bg-zinc-900 text-zinc-300">All Categories</option>
              <option value="Electronics" className="bg-zinc-900 text-zinc-300">Electronics</option>
              <option value="Fashion" className="bg-zinc-900 text-zinc-300">Fashion</option>
              <option value="Books" className="bg-zinc-900 text-zinc-300">Books</option>
              <option value="Home" className="bg-zinc-900 text-zinc-300">Home</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-zinc-400 font-sans gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl text-center my-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <p className="text-zinc-400 text-sm">No products found matching your criteria.</p>
          </div>
        )}

        {/* Dynamic Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
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