import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiTrash, HiMinus, HiPlus, HiArrowLeft, HiShoppingCart } from 'react-icons/hi';

export default function Cart() {
  const { cart, updateItem, removeItem, cartCount } = useCart();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-3">Your Cart is Empty</h2>
        <p className="text-dark-400 mb-8">Looks like you haven't added any items yet.</p>
        <Link to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold
                     hover:shadow-xl hover:shadow-primary-500/30 transition-all">
          <HiShoppingCart className="w-5 h-5" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 text-sm mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart <span className="text-dark-400 text-lg font-normal">({cartCount} items)</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 animate-slide-up">
              {/* Image */}
              <Link to={`/products/${item.productId}`} className="shrink-0">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={item.productName}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`}
                  className="text-sm sm:text-base font-semibold text-dark-100 hover:text-primary-300 transition-colors line-clamp-2">
                  {item.productName}
                </Link>
                <p className="text-primary-400 font-bold mt-1">${item.productPrice?.toFixed(2)}</p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center glass rounded-lg overflow-hidden">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 transition-all">
                      <HiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium text-white">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 transition-all">
                      <HiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="hidden sm:flex flex-col items-end justify-center">
                <span className="text-xs text-dark-500 mb-1">Subtotal</span>
                <span className="text-lg font-bold text-white">₹{item.subtotal?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Subtotal ({cartCount} items)</span>
                <span className="text-dark-200">₹{cart.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <hr className="border-dark-700/50" />
              <div className="flex justify-between">
                <span className="text-base font-semibold text-white">Total</span>
                <span className="text-xl font-bold gradient-text">₹{cart.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-semibold
                         hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300">
              Proceed to Checkout
            </Link>

            <p className="text-xs text-dark-500 text-center mt-4">🔒 Secure SSL Encrypted Checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
