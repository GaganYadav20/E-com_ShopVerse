import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiCheck } from 'react-icons/hi';

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!cart.items || cart.items.length === 0) {
    if (!orderPlaced) {
      navigate('/cart');
      return null;
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }
    setLoading(true);
    try {
      const { data } = await orderAPI.place(address);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      await fetchCart();
      // Show success state briefly then redirect
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <HiCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Order Placed!</h2>
        <p className="text-dark-400 mb-2">Your order has been placed successfully.</p>
        <p className="text-dark-500 text-sm">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-primary-400" />
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-address" className="block text-sm font-medium text-dark-300 mb-1.5">
                    Full Address
                  </label>
                  <textarea
                    id="checkout-address"
                    rows={4}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full shipping address including street, city, state, and zip code..."
                    className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white placeholder-dark-500
                               focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-semibold
                           hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-60 transition-all duration-300"
              >
                {loading ? <div className="spinner w-5 h-5 border-2" /> : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {cart.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.productImage || 'https://via.placeholder.com/60'} alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-200 truncate">{item.productName}</p>
                    <p className="text-xs text-dark-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-dark-200">${item.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-dark-700/50 my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Subtotal</span>
                <span className="text-dark-200">${cart.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <hr className="border-dark-700/50" />
              <div className="flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold gradient-text">${cart.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
