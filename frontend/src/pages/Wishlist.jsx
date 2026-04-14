import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { HiHeart, HiShoppingCart, HiTrash } from 'react-icons/hi';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await wishlistAPI.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setItems(items.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const handleMoveToCart = async (product) => {
    await addToCart(product.id);
    await handleRemove(product.id);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <HiHeart className="w-8 h-8 text-red-400" /> My Wishlist
        {items.length > 0 && <span className="text-dark-400 text-lg font-normal">({items.length} items)</span>}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-6">💝</div>
          <h2 className="text-2xl font-bold text-white mb-3">Your Wishlist is Empty</h2>
          <p className="text-dark-400 mb-8">Save items you love for later.</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold
                       hover:shadow-xl hover:shadow-primary-500/30 transition-all">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <div key={product.id} className="glass rounded-2xl overflow-hidden hover-lift transition-all duration-300 group">
              <Link to={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-dark-800">
                  <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
              </Link>
              <div className="p-4">
                <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">{product.category}</span>
                <h3 className="text-sm font-semibold text-dark-100 line-clamp-2 mt-1 mb-2">{product.name}</h3>
                <p className="text-lg font-bold gradient-text mb-3">${product.price?.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleMoveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-600/20 text-primary-400
                               hover:bg-primary-600 hover:text-white text-xs font-medium transition-all">
                    <HiShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                  <button onClick={() => handleRemove(product.id)}
                    className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
