import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axios/axios.js';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cart');

      const items = response.data?.cart || response.data?.customer?.cart || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.post('/cart', { productId, quantity });

      if (response.data?.cart) {
        setCartItems(response.data.cart);
      } else {
        await refreshCart();
      }

      return { success: true, message: response.data?.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item to cart.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId) return;
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.patch(`/cart/${productId}`, { quantity });

      if (response.data?.cart) {
        setCartItems(response.data.cart);
      } else {
        await refreshCart();
      }
    } catch (err) {
      console.error('Update quantity error:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.delete(`/cart/${productId}`);

      if (response.data?.cart) {
        setCartItems(response.data.cart);
      } else {
        await refreshCart();
      }

      return { success: true };
    } catch (err) {
      console.error('Remove from cart error:', err);
      setError(err.response?.data?.message || 'Failed to remove item from cart.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Resets cart state immediately and re-syncs context
  const clearCart = async () => {
    setCartItems([]);
    await refreshCart();
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const value = {
    cartItems,
    loading,
    error,
    clearError,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};