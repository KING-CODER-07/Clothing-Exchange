import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { motion } from 'framer-motion';
import { Search, MapPin, Tag, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function Listings() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const indianCities = [
    'All India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  const categories = [
    'All Categories',
    'Traditional & Ethnic Wear',
    'Western Wear & Dresses',
    'Jackets & Outerwear',
    'Kurta & Sherwani Sets',
    'Footwear & Sneakers',
    'Accessories & Bags'
  ];

  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/items');
      let filtered = res.data.filter((i) => i.status === 'Available');
      if (category && category !== 'All Categories') {
        filtered = filtered.filter((i) => i.category === category);
      }
      if (location && location !== 'All India') {
        filtered = filtered.filter((i) =>
          i.location && i.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      setItems(filtered);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [category, location]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 font-extrabold text-xs uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4" /> India Sustainable Fashion Search
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
          Available Garment Listings
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Explore swap-ready clothes by category, value tier, and India KYC city.
        </p>

        {/* Glassmorphic Filter Bar */}
        <div className="mt-8 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Tag className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none"
            >
              {indianCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadListings}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filter India Swaps</span>
          </button>
        </div>
      </div>

      {/* Item Cards Grid */}
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
          <RefreshCw className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No listings found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Try resetting filters or explore all cities across India.
          </p>
          <button
            onClick={() => {
              setCategory('');
              setLocation('');
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-md">
                  {item.size || 'M'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {item.brand || 'Unbranded'} • {item.suggestedValue}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <Link
                  to={`/items/${item._id}`}
                  className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl text-center text-xs transition-colors block"
                >
                  View Details & AI Try-On
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
