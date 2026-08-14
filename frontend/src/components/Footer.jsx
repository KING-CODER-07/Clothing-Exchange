import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Camera, MessageCircle, Users, ArrowRight, ShieldCheck, Mail, Sparkles, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    toast.success('Welcome to the inner circle of SwapStyle!');
    setEmail('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <footer className="relative mt-32 w-full overflow-hidden bg-[#0A0F16] pt-24 pb-12 rounded-t-[3rem] shadow-[0_-20px_80px_-15px_rgba(16,185,129,0.15)] border-t border-emerald-900/30">
      {/* Absolute Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-6 md:px-12 relative z-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-12 mb-20">
          
          {/* Brand Identity & Mission */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-5 flex flex-col">
            <Link to="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 transform group-hover:-rotate-6">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-white tracking-tight">
                  Swap<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Style</span>
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md font-light">
              Elevating Indian fashion through circular luxury. Swap, share, and discover high-end ethnic and contemporary pieces while building a sustainable wardrobe for the future.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Camera className="w-5 h-5" />, label: "Instagram" },
                { icon: <MessageCircle className="w-5 h-5" />, label: "Twitter" },
                { icon: <Globe className="w-5 h-5" />, label: "Facebook" }
              ].map((social, idx) => (
                <motion.a 
                  key={idx}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#" 
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 backdrop-blur-sm"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Platform Directory */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
            <h3 className="text-white font-bold text-lg mb-8 tracking-wider uppercase text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Explore
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Marketplace', path: '/marketplace' },
                { name: 'India Heritage Weaves', path: '/weaves' },
                { name: 'Eco Leaderboard', path: '/leaderboard' },
                { name: 'Add a Listing', path: '/add-listing' },
                { name: 'Swap Requests', path: '/swap-requests' }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path} 
                    className="text-slate-400 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-3 group text-sm font-medium"
                  >
                    <span className="w-2 h-px bg-slate-700 group-hover:w-4 group-hover:bg-emerald-400 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company & Trust */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-4">
            <h3 className="text-white font-bold text-lg mb-8 tracking-wider uppercase text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Company
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact Support', path: '/contact' },
                { name: 'FAQ & Help', path: '/faq' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
              ].map((link, i) => (
                <Link 
                  key={i}
                  to={link.path} 
                  className="text-slate-400 hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Newsletter Mini */}
            <div className="mt-10 p-5 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-md">
              <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> Newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 aspect-square rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} SwapStyle India. Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for the planet.
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 tracking-widest uppercase">
            <span>Sustainable</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            <span>Premium</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            <span>Community</span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
