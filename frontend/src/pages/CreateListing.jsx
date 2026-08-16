import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Image as ImageIcon, MapPin, Tag, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'react-hot-toast';

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Traditional & Ethnic Wear',
    brand: '',
    size: 'M',
    condition: 'Excellent',
    location: 'Mumbai',
    description: '',
    imageUrl: '',
    suggestedValue: 'Tier 2 (Mid-Range: ₹2000 - ₹5000)'
  });
  const [loading, setLoading] = useState(false);

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Varanasi'
  ];

  const categories = [
    'Traditional & Ethnic Wear',
    'Western Wear & Dresses',
    'Jackets & Outerwear',
    'Kurta & Sherwani Sets',
    'Footwear & Sneakers',
    'Accessories & Bags'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/items', formData);
      toast.success('🎉 Item listed! Ready for circular swaps across India.');
      navigate('/marketplace');
    } catch (err) {
      toast.error('Failed to create listing. Please log in first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-extrabold text-xs uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4" /> AI-Enhanced Wardrobe Upload
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
          List Your Garment for Swap
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Share your high-quality ethnic or contemporary wear with India's circular fashion community.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Item Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. FabIndia Handloom Silk Kurta"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  India City (Location)
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium"
                >
                  {indianCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Brand / Origin
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Biba / Zara"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Size
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none text-sm font-medium"
                >
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none text-sm font-medium"
                >
                  {['New With Tags', 'Excellent', 'Good', 'Gently Used'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Image URL (High Resolution)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Description & Style Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe fabric, occasion fit (e.g. Wedding, Diwali), and care details."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none resize-none text-sm font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl text-base transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{loading ? 'Publishing Item...' : 'Publish to India Marketplace'}</span>
            </button>
          </form>
        </motion.div>

        {/* Live Preview Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-700 sticky top-8"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Live Swap Card Preview
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> India KYC Ready
            </span>
          </div>

          <div className="h-64 rounded-2xl bg-slate-800 overflow-hidden mb-6 border border-slate-700 relative">
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                <ImageIcon className="w-12 h-12 mb-2 stroke-1" />
                <span className="text-xs font-semibold">Enter an Image URL to see instant drape preview</span>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-black mb-1">
            {formData.title || 'Your Garment Title Here'}
          </h3>
          <p className="text-slate-400 text-xs font-semibold mb-4">
            {formData.brand || 'Unbranded'} • {formData.category}
          </p>

          <p className="text-slate-300 text-sm line-clamp-3 mb-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            {formData.description || 'Your description will appear here...'}
          </p>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-700/80 pt-4">
            <div className="flex items-center gap-1 text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>{formData.location}</span>
            </div>
            <span>Size {formData.size}</span>
            <span>{formData.condition}</span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Eligible for AI Virtual Try-On</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
