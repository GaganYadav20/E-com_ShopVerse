import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { HiShoppingCart, HiUser, HiMenu, HiX, HiHeart, HiClipboardList, HiLogout, HiViewGrid } from 'react-icons/hi';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center font-bold text-white text-lg
                            group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
              S
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">ShopVerse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            {isAdmin && <NavLink to="/admin">Dashboard</NavLink>}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-800/50 transition-all" title="Wishlist">
                  <HiHeart className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="relative p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-800/50 transition-all" title="Cart">
                  <HiShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-[11px] font-bold flex items-center justify-center animate-scale-in">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-800/50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-dark-200">{user?.name}</span>
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-12 w-56 glass rounded-xl shadow-2xl py-2 animate-slide-down border border-dark-700/50">
                        <div className="px-4 py-3 border-b border-dark-700/50">
                          <p className="text-sm font-semibold text-dark-100">{user?.name}</p>
                          <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                          <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300">
                            {user?.role}
                          </span>
                        </div>
                        <Link to="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors">
                          <HiClipboardList className="w-4 h-4" /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors">
                          <HiHeart className="w-4 h-4" /> Wishlist
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors">
                            <HiViewGrid className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <hr className="border-dark-700/50 my-1" />
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-800/50 transition-colors w-full">
                          <HiLogout className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg gradient-primary text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-dark-400 hover:text-white">
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-dark-800/50 animate-slide-down">
            <div className="flex flex-col gap-1">
              <MobileLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
              <MobileLink to="/products" onClick={() => setMobileOpen(false)}>Products</MobileLink>
              {isAuthenticated && <MobileLink to="/orders" onClick={() => setMobileOpen(false)}>Orders</MobileLink>}
              {isAdmin && <MobileLink to="/admin" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="px-3 py-2 rounded-lg text-sm font-medium text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all">
      {children}
    </Link>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick}
      className="px-4 py-3 rounded-lg text-sm font-medium text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all">
      {children}
    </Link>
  );
}
