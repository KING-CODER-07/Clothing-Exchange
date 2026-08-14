import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Search, Compass, Shirt } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative Floating Elements */}
      <motion.div 
        animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 text-emerald-500/20 blur-[2px]"
      >
        <Shirt className="w-32 h-32" />
      </motion.div>
      <motion.div 
        animate={{ y: [20, -20, 20], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 text-purple-500/20 blur-[2px]"
      >
        <ShoppingBag className="w-24 h-24" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 p-10 md:p-16 rounded-[3rem] shadow-2xl border border-white/50 max-w-2xl w-full backdrop-blur-2xl relative z-10 text-center"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
          <Compass className="w-12 h-12 text-white -rotate-12 animate-pulse" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-purple-600 tracking-tighter mb-4 mt-8">
          404
        </h1>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          Lost in the Wardrobe?
        </h2>
        
        <p className="text-slate-600 text-base md:text-lg mb-10 leading-relaxed max-w-lg mx-auto">
          It looks like the outfit you're searching for is out of season, or the page has been moved. Let's navigate back to India's most sustainable circular fashion network!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/marketplace"
            className="group relative py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 border border-emerald-200 flex flex-col items-center justify-center gap-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ShoppingBag className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
            <span className="relative z-10 text-sm group-hover:text-white transition-colors">Browse Wardrobes</span>
          </Link>

          <Link
            to="/"
            className="group relative py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl border border-slate-200 flex flex-col items-center justify-center gap-2"
          >
             <Home className="w-6 h-6 relative z-10 group-hover:text-slate-900 transition-colors" />
            <span className="relative z-10 text-sm group-hover:text-slate-900 transition-colors">Return Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
