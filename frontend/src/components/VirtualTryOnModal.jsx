import React, { useState } from 'react';
import { Wand2, X, Check, ShieldCheck, Sparkles, User, RefreshCw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualTryOnModal({ isOpen, onClose, item, onProceedSwap }) {
  const [selectedAvatar, setSelectedAvatar] = useState('Priya');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !item) return null;

  const avatars = [
    { name: 'Priya', desc: 'Traditional Silhouette (Medium)', fit: '96%', shoulder: 'Perfect Alignment', drape: 'Flattering Flow', hem: 'Ankle Length' },
    { name: 'Aarav', desc: 'Urban Slim Fit (Large)', fit: '94%', shoulder: 'Structured Fit', drape: 'Modern Tapered', hem: 'Optimal Length' },
    { name: 'Ananya', desc: 'Casual Petite (Small)', fit: '92%', shoulder: 'Relaxed Drop Seam', drape: 'Cozy Oversized', hem: 'Slightly Generous' },
    { name: 'Rohan', desc: 'Athletic Build (X-Large)', fit: '91%', shoulder: 'Snug Chest Width', drape: 'Tailored Silhouette', hem: 'Standard Hemline' },
  ];

  const handleSimulate = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const chosen = avatars.find(a => a.name === selectedAvatar) || avatars[0];
      setResult(chosen);
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Eye className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">AI Virtual Try-On Studio</h2>
                <p className="text-purple-200 text-xs font-medium">3D Fit Simulation & Drape Analytics for "{item.title}"</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {!result ? (
              <>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-purple-200 bg-white" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500">Size: {item.size} • Category: {item.category} • Tier: {item.suggestedValue}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-500" /> Choose Your Indian Archetype Avatar
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {avatars.map((av) => (
                      <div
                        key={av.name}
                        onClick={() => setSelectedAvatar(av.name)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          selectedAvatar === av.name
                            ? 'border-purple-600 bg-purple-50 shadow-md'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{av.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{av.desc}</p>
                        </div>
                        {selectedAvatar === av.name && (
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSimulate}
                  disabled={analyzing}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Wand2 className="w-5 h-5 animate-spin" />
                      <span>Simulating Drape & Body Heatmap...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Simulate Virtual Try-On & Fit Score</span>
                    </>
                  )}
                </motion.button>
              </>
            ) : (
              /* Results View */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Fit Score Banner */}
                <div className="p-6 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-600">
                      AI Fit Confidence Score
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">
                      {result.fit} <span className="text-sm font-semibold text-emerald-600">Excellent Match!</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Simulated for avatar **{result.name}** ({result.desc})
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-purple-600/10 border-2 border-purple-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                {/* Heatmap & Drape Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-400 block font-bold uppercase">Shoulder Seam</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-1 block">{result.shoulder}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-400 block font-bold uppercase">Body Drape</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-1 block">{result.drape}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-400 block font-bold uppercase">Hemline & Length</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-1 block">{result.hem}</span>
                  </div>
                </div>

                {/* AI Stylist Note */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-sm text-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Size Verification Guaranteed</strong>
                    <p className="text-xs mt-0.5 leading-relaxed">
                      This item's measurements align harmoniously with your Indian avatar profile. Swapping this item saves approximately 2,700 Liters of water!
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onProceedSwap) onProceedSwap();
                    }}
                    className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Proceed to Request Swap</span>
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
                  >
                    Change Avatar
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
