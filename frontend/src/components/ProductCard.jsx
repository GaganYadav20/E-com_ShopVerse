import { Link } from 'react-router-dom';
import { HiShoppingCart, HiHeart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="glass rounded-2xl overflow-hidden hover-lift transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-dark-800">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Stock badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 text-white text-[11px] font-bold rounded-lg">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
              <span className="px-4 py-2 bg-red-500/90 text-white text-sm font-bold rounded-lg">Out of Stock</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">{product.category}</span>
          </div>
          <h3 className="text-sm font-semibold text-dark-100 line-clamp-2 mb-2 group-hover:text-primary-300 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold gradient-text">₹{product.price?.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 rounded-lg bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              title="Add to Cart"
            >
              <HiShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
