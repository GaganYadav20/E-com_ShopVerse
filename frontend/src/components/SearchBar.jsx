import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

export default function SearchBar({ onSearch, placeholder = 'Search products...' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-dark-100 placeholder-dark-500
                   focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
      />
      <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
      <button type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg gradient-primary text-white text-xs font-medium
                   hover:shadow-lg hover:shadow-primary-500/30 transition-all">
        Search
      </button>
    </form>
  );
}
