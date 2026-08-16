import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Shield, Leaf, Award, MapPin, Sparkles, TrendingUp, Crown } from 'lucide-react';
import apiClient from '../utils/apiClient';
import Spinner from '../components/Spinner';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All India');

  const cities = ['All India', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune'];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiClient.get('/users/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Eco Warrior':
        return <Leaf className="w-4 h-4 text-emerald-500" />;
      case 'Top Rated':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'First Swap':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'Sustainability Guru':
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Medal className="w-4 h-4 text-slate-500" />;
    }
  };

  const filteredLeaders =
    selectedCity === 'All India'
      ? leaders
      : leaders.filter((u) => u.location && u.location.toLowerCase().includes(selectedCity.toLowerCase()));

  const topThree = filteredLeaders.slice(0, 3);
  const restLeaders = filteredLeaders.slice(3);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-sm uppercase tracking-widest mb-6 shadow-sm">
            <Trophy className="w-5 h-5 animate-pulse" /> National Champions
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 tracking-tighter mb-4 pb-2">
            Eco-Swap Leaderboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Celebrating the elite swappers leading India's circular fashion revolution. Earn Eco-Points, secure badges, and rise to the top.
          </p>

          {/* Premium City Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-2xl text-sm font-extrabold transition-all relative overflow-hidden group ${
                  selectedCity === city
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg'
                }`}
              >
                {selectedCity === city && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20"></div>}
                <span className="relative z-10">{city}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 mb-20 px-4 mt-20">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full md:w-1/3 flex flex-col items-center order-2 md:order-1"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 p-1 shadow-2xl shadow-slate-400/30 relative z-10">
                     <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl font-black text-slate-700 uppercase">
                        {topThree[1].name.charAt(0)}
                     </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-300 rounded-full border-4 border-white flex items-center justify-center font-black text-xs text-slate-700 z-20">
                    2
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl w-full p-6 pt-10 rounded-t-[3rem] border-x border-t border-slate-200 flex flex-col items-center h-48 justify-end relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-1 relative z-10">{topThree[1].name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm font-bold mb-4 relative z-10">
                    <MapPin className="w-3 h-3 text-emerald-500" /> {topThree[1].location || 'India'}
                  </div>
                  <div className="bg-slate-900 text-emerald-400 font-black px-5 py-2 rounded-2xl border border-slate-700 shadow-inner relative z-10">
                    {topThree[1].ecoPoints} PTS
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2 z-10 relative -mt-10"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <Crown className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce" />
                  </div>
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 p-1.5 shadow-2xl shadow-amber-500/50 relative z-10">
                     <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl font-black text-amber-600 uppercase">
                        {topThree[0].name.charAt(0)}
                     </div>
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-white flex items-center justify-center font-black text-sm text-white z-20 shadow-lg">
                    1
                  </div>
                </div>
                <div className="bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-xl w-full p-8 pt-12 rounded-t-[3rem] border border-amber-200 flex flex-col items-center h-64 justify-end relative overflow-hidden shadow-[0_-10px_40px_-15px_rgba(251,191,36,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1 relative z-10">{topThree[0].name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm font-bold mb-6 relative z-10">
                    <MapPin className="w-4 h-4 text-emerald-500" /> {topThree[0].location || 'India'}
                  </div>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-amber-500/30 flex items-center gap-2 relative z-10">
                    <Sparkles className="w-5 h-5 text-white" />
                    {topThree[0].ecoPoints} PTS
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full md:w-1/3 flex flex-col items-center order-3 md:order-3"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 p-1 shadow-2xl shadow-amber-900/30 relative z-10">
                     <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl font-black text-amber-800 uppercase">
                        {topThree[2].name.charAt(0)}
                     </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-800 rounded-full border-4 border-white flex items-center justify-center font-black text-xs text-white z-20">
                    3
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl w-full p-6 pt-10 rounded-t-[3rem] border-x border-t border-slate-200 flex flex-col items-center h-40 justify-end relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-1 relative z-10">{topThree[2].name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm font-bold mb-4 relative z-10">
                    <MapPin className="w-3 h-3 text-emerald-500" /> {topThree[2].location || 'India'}
                  </div>
                  <div className="bg-slate-900 text-emerald-400 font-black px-5 py-2 rounded-2xl border border-slate-700 shadow-inner relative z-10">
                    {topThree[2].ecoPoints} PTS
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Rest of the Leaderboard */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50/50 p-6 md:px-10 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
            <div className="col-span-7 md:col-span-5">India Swapper</div>
            <div className="col-span-3 md:col-span-3 text-center">Eco-Points</div>
            <div className="col-span-12 md:col-span-3 hidden md:block text-right">KYC & Badges</div>
          </div>

          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {restLeaders.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 items-center p-6 md:px-10 hover:bg-emerald-50/50 transition-colors group cursor-pointer"
                >
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    <div className="w-10 h-10 text-slate-400 font-black text-lg flex items-center justify-center group-hover:text-emerald-500 transition-colors">
                      {index + 4}
                    </div>
                  </div>

                  <div className="col-span-7 md:col-span-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-black text-lg uppercase shadow-inner group-hover:from-emerald-400 group-hover:to-teal-500 group-hover:text-white transition-all">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500 mr-0.5" />
                        <span>{user.location || 'India'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-3 flex justify-center">
                    <div className="bg-emerald-50 text-emerald-700 font-black px-5 py-2 rounded-xl text-sm border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                      {user.ecoPoints} <span className="opacity-70 text-xs ml-0.5">pts</span>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-3 hidden md:flex justify-end gap-2">
                    {user.badges && user.badges.length > 0 ? (
                      user.badges.slice(0, 3).map((badge, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-emerald-200 transition-colors"
                          title={badge}
                        >
                          {getBadgeIcon(badge)}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <TrendingUp className="w-3 h-3 text-emerald-500" /> New
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredLeaders.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No Swappers Found</h3>
                <p className="text-slate-500 font-medium">Be the first to list an item in {selectedCity} and top the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
