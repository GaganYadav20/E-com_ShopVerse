import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-dark-900/80 border-t border-dark-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center font-bold text-white text-lg">S</div>
              <span className="text-xl font-bold gradient-text">ShopVerse</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              Your premium destination for quality products. Fast delivery, secure checkout, and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/products">Products</FooterLink>
              <FooterLink to="/cart">Cart</FooterLink>
              <FooterLink to="/orders">Orders</FooterLink>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              <FooterLink to="/products?category=Electronics">Electronics</FooterLink>
              <FooterLink to="/products?category=Fashion">Fashion</FooterLink>
              <FooterLink to="/products?category=Home & Living">Home & Living</FooterLink>
              <FooterLink to="/products?category=Books">Books</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <HiMail className="w-4 h-4 text-primary-400" /> support@shopverse.com
              </li>
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <HiPhone className="w-4 h-4 text-primary-400" /> +91 123-4567-890
              </li>
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <HiLocationMarker className="w-4 h-4 text-primary-400" /> Pune, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800/50 mt-10 pt-6 text-center">
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{children}</Link>
    </li>
  );
}
