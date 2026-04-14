import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { HiArrowRight, HiShieldCheck, HiLightningBolt, HiCube, HiSupport } from 'react-icons/hi';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(0, 8, 'id', 'desc'),
          productAPI.getCategories(),
        ]);
        setFeaturedProducts(productsRes.data.content || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = {
    'Electronics': '🔌',
    'Fashion': '👗',
    'Home & Living': '🏠',
    'Sports & Outdoors': '⚽',
    'Food & Beverages': '🍵',
    'Books': '📚',
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-dark-950 to-dark-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-primary-300 text-sm font-medium">New Collection Available</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Discover
              <span className="gradient-text"> Premium</span>
              <br />Products
            </h1>
            <p className="text-lg text-dark-300 max-w-xl mb-8 leading-relaxed">
              Explore our curated collection of high-quality products. From cutting-edge electronics to stylish fashion — everything you need, delivered fast.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold
                           hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300">
                Shop Now
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products?category=Electronics"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-dark-600 text-dark-200
                           hover:border-primary-500/50 hover:text-white transition-all duration-300">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: HiLightningBolt, title: 'Fast Delivery', desc: 'Free shipping on orders $50+' },
            { icon: HiShieldCheck, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
            { icon: HiCube, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: HiSupport, title: '24/7 Support', desc: 'Dedicated help center' },
          ].map((f, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="p-2 rounded-lg bg-primary-500/10">
                <f.icon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-dark-100">{f.title}</h3>
                <p className="text-xs text-dark-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Shop by Category</h2>
              <p className="text-dark-400 mt-1">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
                className="glass rounded-xl p-5 text-center hover-lift group cursor-pointer">
                <div className="text-3xl mb-2">{categoryIcons[cat] || '📦'}</div>
                <h3 className="text-sm font-semibold text-dark-200 group-hover:text-primary-300 transition-colors">{cat}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Products</h2>
            <p className="text-dark-400 mt-1">Our latest and most popular items</p>
          </div>
          <Link to="/products" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-dark-800" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-dark-700 rounded w-1/3" />
                  <div className="h-4 bg-dark-700 rounded w-2/3" />
                  <div className="h-5 bg-dark-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 sm:p-14">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
            <p className="text-indigo-200 mb-8">Join thousands of happy customers and discover amazing deals every day.</p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold
                         hover:bg-indigo-50 shadow-xl transition-all duration-300">
              Create Account <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
