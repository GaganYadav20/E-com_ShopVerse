import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalPrice: 0 });
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data);
      setCartCount(data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data);
      setCartCount(data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.update(itemId, quantity);
      setCart(data);
      setCartCount(data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartAPI.remove(itemId);
      setCart(data);
      setCartCount(data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], totalPrice: 0 });
      setCartCount(0);
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
