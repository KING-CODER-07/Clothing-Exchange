import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, MapPin, ArrowRightLeft, ShieldCheck, 
  CheckCircle, Sliders, ThumbsUp, Heart, RefreshCw, Shirt, 
  Droplet, Leaf, Compass, ChevronRight, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function SwapMatchmaker() {
  const [myItems, setMyItems] = useState([]);
  const [selectedMyItem, setSelectedMyItem] = useState(null);
  const [allMarketItems, setAllMarketItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposingSwap, setProposingSwap] = useState(null);
  const [swapNote, setSwapNote] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(60);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [myRes, marketRes] = await Promise.all([
        axios.get('http://localhost:5000/api/items/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/items')
      ]);

      const activeMyItems = (myRes.data || []).filter(i => i.status === 'Available');
      setMyItems(activeMyItems);

      if (activeMyItems.length > 0) {
        setSelectedMyItem(activeMyItems[0]);
      }

      // Filter out user's own items from marketplace
      const token = localStorage.getItem('token');
      let userId = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch (e) {
          // ignore
        }
      }

      const availableMarket = (marketRes.data || []).filter(
        item => item.status === 'Available' && item.ownerId?._id !== userId
      );
      setAllMarketItems(availableMarket);
    } catch (err) {
      console.error('Failed to load matchmaking data', err);
      toast.error('Could not load wardrobe items for matchmaking');
    } finally {
      setLoading(false);
    }
  };

  // Compatibility Algorithm Engine
  const calculateCompatibility = (myItem, candidate) => {
    if (!myItem || !candidate) return { score: 0, breakdown: {} };

    let score = 0;
    const breakdown = {
      valueParity: 0,
      sizeFit: 0,
      locationSynergy: 0,
      categorySynergy: 0
    };

    // 1. Value Tier Parity (35 pts)
    const tierRanks = { 'Standard': 1, 'Medium': 2, 'High': 3, 'Premium': 4 };
    const myRank = tierRanks[myItem.suggestedValue] || 2;
    const candRank = tierRanks[candidate.suggestedValue] || 2;
    const rankDiff = Math.abs(myRank - candRank);

    if (rankDiff === 0) {
      breakdown.valueParity = 35;
    } else if (rankDiff === 1) {
      breakdown.valueParity = 25;
    } else {
      breakdown.valueParity = 10;
    }
    score += breakdown.valueParity;

    // 2. Size & Fit Alignment (25 pts)
    if (myItem.size && candidate.size && myItem.size.toLowerCase() === candidate.size.toLowerCase()) {
      breakdown.sizeFit = 25;
    } else {
      breakdown.sizeFit = 12; // flexible wear
    }
    score += breakdown.sizeFit;

    // 3. Location & City Proximity (20 pts)
    if (myItem.location && candidate.location && 
        myItem.location.toLowerCase().trim() === candidate.location.toLowerCase().trim()) {
      breakdown.locationSynergy = 20;
    } else {
      breakdown.locationSynergy = 10;
    }
    score += breakdown.locationSynergy;

    // 4. Condition & Category Synergy (20 pts)
    const goodConditions = ['New with tags', 'Like New', 'Gently Used'];
    if (goodConditions.includes(candidate.condition)) {
      breakdown.categorySynergy = 20;
    } else {
      breakdown.categorySynergy = 12;
    }
    score += breakdown.categorySynergy;

    return { score: Math.min(score, 100), breakdown };
  };

  useEffect(() => {
    if (!selectedMyItem || allMarketItems.length === 0) {
      setMatches([]);
      return;
    }

    const scored = allMarketItems.map(item => {
      const { score, breakdown } = calculateCompatibility(selectedMyItem, item);
      return {
        ...item,
        compatibilityScore: score,
        compatibilityBreakdown: breakdown
      };
    });

    // Filter by min score & category
    let filtered = scored.filter(m => m.compatibilityScore >= minMatchScore);
    if (filterCategory !== 'All') {
      filtered = filtered.filter(m => m.category === filterCategory);
    }

    // Sort descending by score
    filtered.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    setMatches(filtered);
  }, [selectedMyItem, allMarketItems, minMatchScore, filterCategory]);

  const handleSendSwapProposal = async (candidateItem) => {
    try {
      await axios.post('http://localhost:5000/api/swaps', {
        requestedItemId: candidateItem._id,
        offeredItemId: selectedMyItem._id,
        message: swapNote || `Hi! The AI Matchmaker found a ${candidateItem.compatibilityScore}% match between our garments. Let's swap!`
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success(`Smart Swap proposal sent for "${candidateItem.title}"! 🎉`);
      setProposingSwap(null);
      setSwapNote('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send swap proposal';
      toast.error(msg);
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-400 text-white shadow-emerald-500/30';
    if (score >= 75) return 'from-blue-500 to-indigo-500 text-white shadow-blue-500/30';
    return 'from-amber-500 to-orange-500 text-white shadow-amber-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-12 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 animate-spin" /> AI Wardrobe Matchmaker
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            Find Your Garment's <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-indigo-300">
              Perfect Trade Partner.
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
            Select an item from your closet to instantly run multi-point compatibility matching across size, value tier, condition, and local proximity.
          </p>
        </div>
      </motion.div>

      {/* Main Grid: My Closet Selector vs Matched Results */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: User's Closet (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 sticky top-28">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-emerald-600" /> My Closet
              </h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {myItems.length} Available
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" />
                <p className="text-sm font-semibold">Analyzing your wardrobe...</p>
              </div>
            ) : myItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Shirt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-700 font-bold mb-1">No Available Listings</p>
                <p className="text-xs text-slate-500 mb-4">Upload an item to start matchmaking.</p>
                <Link 
                  to="/add-listing" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md hover:bg-emerald-400 transition-all"
                >
                  + Add Listing
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {myItems.map(item => {
                  const isSelected = selectedMyItem?._id === item._id;
                  return (
                    <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMyItem(item)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3.5 border ${
                        isSelected 
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-md shadow-emerald-500/10' 
                          : 'bg-white border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-14 h-14 rounded-xl object-cover shadow-xs" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-semibold text-emerald-600">{item.suggestedValue} Tier</span>
                          <span>•</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Selected Item Summary Card */}
            {selectedMyItem && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Offering</div>
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedMyItem.location || 'Pan-India'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md font-bold text-slate-700 border border-slate-200">{selectedMyItem.category}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Matched Community Items (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-slate-700" /> Filters:
              </span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                <option value="All">All Categories</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Min Match:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="40" 
                  max="90" 
                  step="5"
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-24 accent-emerald-500 cursor-pointer" 
                />
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  {minMatchScore}%+
                </span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-3 text-emerald-500" />
              <p className="text-base font-bold text-slate-700">Evaluating compatibility matrix...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
              <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No High-Synergy Matches Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Try lowering your minimum match threshold or choosing a different item from your closet to expand your potential swap matches.
              </p>
              <button
                onClick={() => { setMinMatchScore(40); setFilterCategory('All'); }}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
              >
                Reset Matching Thresholds
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence>
                {matches.map((candidate, idx) => (
                  <motion.div
                    key={candidate._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all flex flex-col group"
                  >
                    {/* Item Image with Match Score Ribbon */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                      <img 
                        src={candidate.imageUrl} 
                        alt={candidate.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Compatibility Badge */}
                      <div className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-linear-to-r ${getScoreBadgeColor(candidate.compatibilityScore)} font-black text-xs shadow-lg flex items-center gap-1.5`}>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        {candidate.compatibilityScore}% Match
                      </div>

                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {candidate.location || 'Pan-India'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {candidate.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-3">
                          {candidate.brand || 'Handcrafted / Boutique'} • {candidate.category}
                        </p>

                        {/* Compatibility Breakdown Bars */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>Value Parity</span>
                            <span className="text-emerald-600">{candidate.compatibilityBreakdown.valueParity}/35 pts</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${(candidate.compatibilityBreakdown.valueParity / 35) * 100}%` }}
                            />
                          </div>

                          <div className="flex justify-between font-bold text-slate-700 pt-1">
                            <span>Size & Synergy</span>
                            <span className="text-indigo-600">{candidate.compatibilityBreakdown.sizeFit + candidate.compatibilityBreakdown.categorySynergy}/45 pts</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${((candidate.compatibilityBreakdown.sizeFit + candidate.compatibilityBreakdown.categorySynergy) / 45) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => setProposingSwap(candidate)}
                          className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                          <ArrowRightLeft className="w-4 h-4" /> Quick Swap Proposal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Propose Swap Modal */}
      <AnimatePresence>
        {proposingSwap && selectedMyItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                  <Sparkles className="w-5 h-5" /> Smart Swap Proposal
                </div>
                <button 
                  onClick={() => setProposingSwap(null)}
                  className="text-slate-400 hover:text-slate-600 font-black text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Garment Pair Comparison */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl mb-6 items-center">
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">You Offer</span>
                  <img src={selectedMyItem.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover mx-auto mb-2 shadow-xs" />
                  <p className="font-bold text-slate-800 text-xs truncate">{selectedMyItem.title}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">{selectedMyItem.suggestedValue} Tier</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">You Receive</span>
                  <img src={proposingSwap.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover mx-auto mb-2 shadow-xs" />
                  <p className="font-bold text-slate-800 text-xs truncate">{proposingSwap.title}</p>
                  <span className="text-[10px] text-indigo-600 font-bold">{proposingSwap.suggestedValue} Tier</span>
                </div>
              </div>

              {/* Message Note */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-extrabold text-slate-700">Add a Trade Note (Optional)</label>
                <textarea
                  rows="3"
                  value={swapNote}
                  onChange={(e) => setSwapNote(e.target.value)}
                  placeholder={`Hi! The AI Matchmaker calculated a ${proposingSwap.compatibilityScore}% compatibility between our pieces. Would love to trade!`}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProposingSwap(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSwapProposal(proposingSwap)}
                  className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/30 transition-all"
                >
                  Send Smart Proposal 🚀
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
