import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Shirt, PlusCircle, RefreshCw, Trophy, BookOpen, DownloadCloud, Sparkles, TrendingUp, Zap } from 'lucide-react';
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

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors">
              Marketplace
            </Link>
            <Link to="/weaves" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Weaves 🇮🇳
            </Link>
            <Link to="/matchmaker" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              Smart Match
            </Link>
            <Link to="/leaderboard" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Leaderboard
            </Link>
            {user && (
              <>
                <Link to="/lookbook" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors">
                  Lookbook
                </Link>
                <Link to="/impact" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Eco-Impact
                </Link>
                <Link to="/swap-requests" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors">
                  Swaps
                </Link>
                <Link to="/dashboard" className="font-bold text-slate-600 hover:text-emerald-500 transition-colors">
                  Closet
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-all shadow-xs"
                title="Install Progressive Web App"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                Install App
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationsDropdown />
                <Link to="/add-listing" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20">
                  <PlusCircle className="h-5 w-5" />
                  <span>List Item</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-bold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="font-bold text-slate-700 hover:text-emerald-500 px-3 py-2 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
