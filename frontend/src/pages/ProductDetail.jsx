import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { HiShoppingCart, HiHeart, HiArrowLeft, HiMinus, HiPlus, HiCheck } from 'react-icons/hi';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data);
        if (isAuthenticated) {
          try {
            const wishRes = await wishlistAPI.check(id);
            setInWishlist(wishRes.data.inWishlist);
          } catch {}
        }
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product.id, quantity);
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      if (inWishlist) {
        await wishlistAPI.remove(product.id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add(product.id);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading) return <Loader />;
  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-dark-200">Product Not Found</h2>
      <Link to="/products" className="text-primary-400 hover:underline mt-4 inline-block">Back to Products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <Link to="/products" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 text-sm mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Image */}
        <div className="glass rounded-2xl overflow-hidden">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">{product.category}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-dark-300 leading-relaxed mb-6">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black gradient-text">${product.price?.toFixed(2)}</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-8">
            {product.stock > 0 ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-sm text-green-400">In Stock ({product.stock} available)</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-sm text-red-400">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-dark-300">Quantity:</span>
              <div className="flex items-center glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-dark-400 hover:text-white hover:bg-dark-700/50 transition-all"
                >
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 text-white font-medium min-w-[48px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-dark-400 hover:text-white hover:bg-dark-700/50 transition-all"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold
                         hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
            >
              <HiShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                inWishlist
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'border-dark-600 text-dark-400 hover:border-red-500/50 hover:text-red-400'
              }`}
            >
              <HiHeart className="w-6 h-6" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { icon: '🚚', text: 'Free Delivery' },
              { icon: '↩️', text: '30-Day Returns' },
              { icon: '🛡️', text: '2-Year Warranty' },
              { icon: '📞', text: '24/7 Support' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 glass rounded-lg px-3 py-2">
                <span>{f.icon}</span>
                <span className="text-xs text-dark-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
