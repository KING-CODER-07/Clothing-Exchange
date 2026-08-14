import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Heart, Award, Droplet, Wind, Sparkles, MapPin, Fingerprint, Recycle } from 'lucide-react';

export default function AboutUs() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    out: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl -z-10 rounded-full w-64 h-64 mx-auto"></div>
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-sm uppercase tracking-widest mb-6 shadow-sm">
          <Leaf className="w-5 h-5 animate-pulse" /> The India Circular Manifesto
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 tracking-tighter mb-6 pb-2">
          SwapStyle India
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          We are ending fast fashion waste across the subcontinent by making peer-to-peer premium ethnic and western clothing swaps seamless, AI-powered, and infinitely rewarding.
        </p>
      </motion.div>

      {/* Live Impact Numbers Banner */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl shadow-blue-500/10 text-center transform transition-all hover:-translate-y-2 hover:shadow-blue-500/20 group">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <Droplet className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">2,700 L</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Avg. Water Saved Per Swap
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl shadow-emerald-500/10 text-center transform transition-all hover:-translate-y-2 hover:shadow-emerald-500/20 group">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <Wind className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">5.5 Kg</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            CO₂ Prevented Per Swap
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl shadow-purple-500/10 text-center transform transition-all hover:-translate-y-2 hover:shadow-purple-500/20 group">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">28+ Cities</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            India Verified KYC Network
          </p>
        </div>
      </motion.div>

      {/* The Story & Mission Container */}
      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/50 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/40 to-indigo-200/40 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Recycle className="text-emerald-500 w-8 h-8" /> The Problem We Saw
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
              The fast fashion industry is the second largest polluter in the world, with immense impact on India's vital rivers and ecosystems. Yet, millions of perfectly good designer Lehengas, Banarasi sarees, and premium Western wear sit unworn in closets across Mumbai, Delhi, and Bangalore after just one wear.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We realized the solution wasn't buying more "sustainable" clothes—it was sharing and rotating the beautiful garments we already possess. 
            </p>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl transform rotate-6 opacity-20 blur-sm"></div>
             <div className="bg-slate-900 p-8 rounded-3xl relative z-10 border border-slate-700 shadow-2xl">
               <Fingerprint className="w-12 h-12 text-emerald-400 mb-6" />
               <h3 className="text-2xl font-bold text-white mb-4">"Building the trust layer for circular fashion."</h3>
               <p className="text-slate-400 leading-relaxed">
                 By introducing strict India KYC verification, AI styling advisors, virtual try-on drape simulators, and fair value matching, we've eliminated the friction and anxiety of peer-to-peer swapping.
               </p>
             </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            The Pillars of SwapStyle
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-[2rem] border border-emerald-100 transition-all hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-black text-2xl text-emerald-900 mb-3">Hyper-Sustainable</h3>
              <p className="text-base text-emerald-800/80 leading-relaxed font-medium">
                Every swap directly reduces carbon footprint, tracks water savings in real-time on your India Eco-Passport, and prevents textile landfill waste.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-[2rem] border border-purple-100 transition-all hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-black text-2xl text-purple-900 mb-3">Verified Community</h3>
              <p className="text-base text-purple-800/80 leading-relaxed font-medium">
                100% Aadhaar/KYC verified Indian network. We use geocoding for local city matching to ensure safe, secure, and reliable exchanges.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-[2rem] border border-blue-100 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-black text-2xl text-blue-900 mb-3">AI Intelligence</h3>
              <p className="text-base text-blue-800/80 leading-relaxed font-medium">
                Our proprietary AI Stylist recognizes Indian weaves (Banarasi, Chanderi) and provides 96% fit confidence before you swap.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-rose-50 p-8 rounded-[2rem] border border-orange-100 transition-all hover:shadow-xl hover:shadow-orange-500/10">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-black text-2xl text-orange-900 mb-3">Democratic Luxury</h3>
              <p className="text-base text-orange-800/80 leading-relaxed font-medium">
                Experience high-end designers (Raw Mango, Sabyasachi) and authentic heritage handlooms without the exclusionary price tags.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
