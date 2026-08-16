import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { Repeat, Recycle, Heart, Star, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [trendingItems, setTrendingItems] = useState([]);
  const [currentSwapIndex, setCurrentSwapIndex] = useState(0);

  const liveSwaps = [
    { user: 'Priya (Mumbai)', action: 'swapped Banarasi Silk Saree', eco: '4,800 L water saved 💧' },
    { user: 'Ananya (Bengaluru)', action: 'traded Chanderi Kurta Set', eco: '14.2 kg CO₂e offset 🌿' },
    { user: 'Rahul (Delhi)', action: 'swapped Khadi Denim Jacket', eco: 'Western Ghats Guardian Badge 🏆' },
    { user: 'Siddharth (Pune)', action: 'exchanged Ikat Silk Dupatta', eco: '3,900 L water saved 💧' },
    { user: 'Meera (Jaipur)', action: 'swapped Kalamkari Cotton Kurti', eco: 'Zero Landfill Impact 🌱' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSwapIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await apiClient.get('/items');
        const available = res.data.filter(i => i.status === 'Available');
        setTrendingItems(available.slice(0, 4));
      } catch (err) {
        console.error('Failed to load trending items');
      }
    };
    fetchTrending();
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <motion.div 
      initial="initial" 
      animate="in" 
      exit="out" 
      variants={pageVariants} 
      transition={pageTransition}
      className="flex flex-col items-center"
    >
      {/* Hero Section */}
      <section className="relative w-full rounded-[2rem] overflow-hidden my-8 shadow-2xl h-[70vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/images/fashion_hero_banner_1779264206748.png" 
            alt="Premium Fashion Swap" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-lg"
          >
            Swap Your Style, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Save the Planet.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium"
          >
            The sustainable marketplace where you can exchange your pre-loved high fashion directly with others. No money involved, just fair trades.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/marketplace" className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-full text-base shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] transition-all hover:-translate-y-1">
              Browse Marketplace
            </Link>
            <Link to="/register" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full text-base shadow-sm border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-1">
              Join India Community
            </Link>
          </motion.div>
        </div>
      </section>

      {/* India Circular Impact Ribbon */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-6xl mx-auto -mt-10 mb-16 relative z-20 bg-white/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-500/10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-slate-200 last:border-0">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">54,200 L</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">Water Conserved 🇮🇳</div>
          </div>
          <div className="border-r border-slate-200 last:border-0">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">188.4 kg</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">CO₂e Prevented 🌿</div>
          </div>
          <div className="border-r border-slate-200 last:border-0">
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">12 Cities</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">Pan-India Network 📍</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-500">100%</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">Circular Handloom ✨</div>
          </div>
        </div>
      </motion.section>

      {/* Live Pan-India Community Circular Activity Ticker */}
      <div className="w-full max-w-5xl mx-auto -mt-6 mb-16 px-4">
        <motion.div
          key={currentSwapIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-2xl border border-emerald-500/30 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Live Swap India
            </span>
            <span className="text-sm font-bold text-slate-900">
              <span className="text-emerald-600">{liveSwaps[currentSwapIndex].user}</span>{' '}
              {liveSwaps[currentSwapIndex].action}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-teal-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-slate-200">
            <span>{liveSwaps[currentSwapIndex].eco}</span>
          </div>
        </motion.div>
      </div>

      {/* Featured Community Section */}
      <section className="w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
              <img src="/images/fashion_community_1_1779264883216.png" alt="Community Swap" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-50 z-0"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Fashion shouldn't cost the Earth.</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Join thousands of fashion-forward individuals who are updating their wardrobes without spending a dime or harming the environment. Our community values style, quality, and sustainability.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><Star className="w-6 h-6"/></div>
                <h4 className="text-xl font-bold text-slate-900">Premium Curation</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><ShieldCheck className="w-6 h-6"/></div>
                <h4 className="text-xl font-bold text-slate-900">Secure Exchanges</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600"><Zap className="w-6 h-6"/></div>
                <h4 className="text-xl font-bold text-slate-900">Instant Matching</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detail Showcase Section */}
      <section className="w-full py-20 bg-slate-900 text-white rounded-[3rem] my-10 px-8 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black mb-6 tracking-tight">The Art of the Swap</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Every item has a story. By swapping, you extend the lifecycle of beautifully crafted garments. Our platform ensures that high-quality pieces find new homes where they will be cherished.
            </p>
            <Link to="/marketplace" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-full text-lg hover:bg-slate-100 transition-all hover:scale-105">
              Start Swapping Now
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img src="/images/fashion_community_2_1779264901571.png" alt="Detail Swap" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tight text-slate-900">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            whileHover={{ y: -15, scale: 1.02 }} 
            className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-slate-100 text-center transition-all"
          >
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-10 transform rotate-3 shadow-inner">
              <Recycle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">1. List Your Items</h3>
            <p className="text-slate-600 text-lg leading-relaxed">Upload stunning photos of clothes you no longer wear. Clear out your closet sustainably.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ y: -15, scale: 1.02 }} 
            className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-slate-100 text-center transition-all"
          >
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 transform -rotate-3 shadow-inner">
              <Heart className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">2. Find What You Love</h3>
            <p className="text-slate-600 text-lg leading-relaxed">Browse the marketplace and discover unique, premium pieces from other community members.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ y: -15, scale: 1.02 }} 
            className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-slate-100 text-center transition-all"
          >
            <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-10 transform rotate-3 shadow-inner">
              <Repeat className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">3. Request a Swap</h3>
            <p className="text-slate-600 text-lg leading-relaxed">Propose an exchange. If they accept, chat to arrange the swap securely. No cash needed!</p>
          </motion.div>
        </div>
      </section>

      {/* Trending Items Section */}
      <section className="w-full py-24 mb-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">Trending Now</h2>
            <p className="text-xl text-slate-500">Fresh premium drops waiting to be swapped.</p>
          </div>
          <Link to="/marketplace" className="hidden md:flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
            View All <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        {trendingItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingItems.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group"
              >
                <Link to={`/items/${item._id}`}>
                  <div className="h-64 overflow-hidden relative bg-slate-50">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                      {item.suggestedValue} Tier
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{item.brand || 'Unbranded'}</p>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-emerald-600">{item.condition}</span>
                      <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{item.size}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 bg-slate-50 p-10 rounded-3xl">No items trending at the moment.</p>
        )}
        <div className="mt-8 text-center md:hidden">
          <Link to="/marketplace" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
            View All <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
