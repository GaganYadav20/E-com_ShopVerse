import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { HiAdjustments, HiX } from 'react-icons/hi';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // Filters from URL
  const page = parseInt(searchParams.get('page') || '0');
  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('keyword') || '';
  const sortBy = searchParams.get('sortBy') || 'id';
  const direction = searchParams.get('direction') || 'desc';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, size: 12, sortBy, direction };
        if (category) params.category = category;
        if (keyword) params.keyword = keyword;

        const res = await productAPI.filter(params);
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, category, keyword, sortBy, direction]);

  useEffect(() => {
    productAPI.getCategories().then(res => setCategories(res.data || [])).catch(() => {});
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '0');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = category || keyword;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
        <p className="text-dark-400">Discover our complete collection</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <SearchBar
          onSearch={(q) => updateFilter('keyword', q)}
          placeholder="Search products..."
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-dark-200 text-sm
                       focus:outline-none focus:border-primary-500/50 transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${direction}`}
            onChange={(e) => {
              const [s, d] = e.target.value.split('-');
              const params = new URLSearchParams(searchParams);
              params.set('sortBy', s);
              params.set('direction', d);
              params.set('page', '0');
              setSearchParams(params);
            }}
            className="px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-dark-200 text-sm
                       focus:outline-none focus:border-primary-500/50 transition-all cursor-pointer"
          >
            <option value="id-desc">Newest First</option>
            <option value="id-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all">
              <HiX className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-dark-400">Filters:</span>
          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-sm">
              {category}
              <button onClick={() => updateFilter('category', '')} className="hover:text-white"><HiX className="w-3 h-3" /></button>
            </span>
          )}
          {keyword && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-sm">
              "{keyword}"
              <button onClick={() => updateFilter('keyword', '')} className="hover:text-white"><HiX className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(12)].map((_, i) => (
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
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-dark-200 mb-2">No products found</h3>
          <p className="text-dark-400 mb-6">Try adjusting your search or filters</p>
          <button onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => updateFilter('page', Math.max(0, page - 1).toString())}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg glass text-sm text-dark-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => updateFilter('page', i.toString())}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                i === page
                  ? 'gradient-primary text-white shadow-lg shadow-primary-500/30'
                  : 'glass text-dark-400 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => updateFilter('page', Math.min(totalPages - 1, page + 1).toString())}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-lg glass text-sm text-dark-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
