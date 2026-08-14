import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Sparkles, ShieldCheck } from 'lucide-react';

export default function ListingCard({ item }) {
  const itemId = item._id || item.id;
  const imageUrl = item.imageUrl || item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80';

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image Header */}
      <div className="relative h-60 bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title || 'India Fashion Garment'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
          {item.category || 'Garment'}
        </div>
        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-md">
          {item.status || 'Available'}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-emerald-500 transition-colors">
            {item.title || 'Fashion Garment'}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {item.brand || 'Indian Heritage / Contemporary'} • {item.size || 'Free Size'}
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2">
            {item.description || 'Pre-loved garment ready for sustainable exchange.'}
          </p>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1 text-emerald-600">
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.location || 'All India'}</span>
            </div>
            <span className="text-purple-600 font-extrabold">
              {item.suggestedValue || item.estimatedValue || 'Tier 2 (Mid-Range)'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Link
            to={`/items/${itemId}`}
            className="w-full py-3 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-2xl text-center text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Details & AI Try-On</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
