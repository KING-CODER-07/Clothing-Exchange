import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Shirt, PlusCircle, RefreshCw, Trophy, BookOpen, DownloadCloud, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationsDropdown from './NotificationsDropdown';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isInstallable, handleInstallClick } = usePWAInstall();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md group-hover:bg-emerald-500 transition-colors"
            >
              <Shirt className="h-6 w-6" />
            </motion.div>
            <span className="font-black text-2xl tracking-tight text-slate-900">
              Swap<span className="text-emerald-500">Style</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {isInstallable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                className="hidden md:flex items-center gap-1.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-sm"
              >
                <DownloadCloud className="w-4 h-4" /> Install App
              </motion.button>
            )}
            <Link to="/marketplace" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors">
              Marketplace
            </Link>
            <Link to="/leaderboard" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors flex items-center gap-1">
              <Trophy className="w-4 h-4" /> Leaderboard
            </Link>
            <Link to="/lookbook" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Lookbook
            </Link>
            <Link to="/impact" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Impact
            </Link>
            <Link to="/weaves" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-500" /> 🇮🇳 Weaves
            </Link>
            
            {user ? (
              <>
                <NotificationsDropdown />
                <Link to="/add-listing" className="flex items-center gap-1 text-slate-600 font-bold hover:text-emerald-500 transition-colors whitespace-nowrap">
                  <PlusCircle className="h-4 w-4" /> Add Item
                </Link>
                <Link to="/swap-requests" className="flex items-center gap-1 text-slate-600 font-bold hover:text-emerald-500 transition-colors">
                  <RefreshCw className="h-4 w-4" /> Requests
                </Link>
                <Link to="/dashboard" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
                    Admin
                  </Link>
                )}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout} 
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-bold hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 font-bold hover:text-emerald-500 transition-colors">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="bg-emerald-500 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-400 shadow-sm shadow-emerald-500/30 transition-colors whitespace-nowrap">
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
