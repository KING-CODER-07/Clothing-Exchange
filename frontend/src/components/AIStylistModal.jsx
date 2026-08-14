import React, { useState } from 'react';
import axios from 'axios';
import { 
  Sparkles, X, Check, ArrowRight, Wand2, Palette, Calendar, 
  Smile, Leaf, Droplets, Award, Share2, Recycle, TreeDeciduous 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AIStylistModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('stylist'); // 'stylist' | 'calculator'
  
  // Tab 1: AI Stylist States
  const [occasion, setOccasion] = useState('Casual Hangout');
  const [vibe, setVibe] = useState('Minimalist');
  const [colorPalette, setColorPalette] = useState('Earthy Tones & Terracotta');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Tab 2: Circular Eco-Calculator States
  const [itemsSwapped, setItemsSwapped] = useState(5);
  const [fabricType, setFabricType] = useState('Handloom Khadi Cotton');
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResult, setCalcResult] = useState(null);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const occasions = [
    'Casual Hangout',
    'Indian Festive / Wedding',
    'Office Formal',
    'Weekend Date Night',
    'Sustainable Streetwear',
    'Sangeet / Haldi Ceremony'
  ];

  const vibes = [
    'Minimalist',
    'Bohemian Handloom',
    'Luxury Royal Chic',
    'Retro Indigo Vintage',
    'Make-in-India Artisan'
  ];

  const palettes = [
    'Earthy Tones & Terracotta',
    'Pastel & Chanderi Sheens',
    'Deep Jewel Tones (Emerald/Rani)',
    'Monochrome Indigo/Khadi'
  ];

  const fabrics = [
    'Handloom Khadi Cotton',
    'Banarasi Pure Silk',
    'Chanderi Silk-Cotton',
    'Pure Indian Linen',
    'Contemporary Denim / Mixed'
  ];

  const handleGenerateStylist = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/stylist', {
        occasion,
        vibe,
        colorPalette
      });
      setResult(res.data.data);
    } catch (err) {
      toast.error('Stylist generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateImpact = async () => {
    setCalcLoading(true);
    setCalcResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/sustainability-score', {
        itemsSwapped: Number(itemsSwapped),
        fabricType
      });
      setCalcResult(res.data.data);
    } catch (err) {
      toast.error('Failed to calculate impact.');
    } finally {
      setCalcLoading(false);
    }
  };

  const handleCopyImpact = () => {
    if (!calcResult) return;
    const shareText = `🇮🇳 My SwapStyle India Circular Impact:\n` +
      `🏆 Badge: ${calcResult.badgeTitle}\n` +
      `💧 Water Conserved: ${calcResult.totalWaterSavedLiters} Liters (${calcResult.drinkingWaterDays} days of drinking water!)\n` +
      `☁️ CO₂e Prevented: ${calcResult.totalCo2SavedKg} kg\n` +
      `🌲 Trees Equivalent: ${calcResult.equivalentTreesPlanted} Western Ghats trees\n` +
      `Join the circular fashion revolution at SwapStyle India! 🌿`;
    navigator.clipboard.writeText(shareText);
    toast.success('Indian Circular Impact Score copied to clipboard!');
  };

  const handleBrowseCategory = (category) => {
    onClose();
    navigate(`/marketplace?category=${encodeURIComponent(category)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 p-6 text-white flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  SwapStyle AI Studio 🇮🇳
                </h2>
                <p className="text-emerald-100 text-xs font-medium">
                  Indian Outfit Stylist & Circular Eco-Impact Calculator
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 text-white shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('stylist')}
              className={`flex items-center gap-2 py-3 px-5 font-extrabold text-sm border-b-2 transition-all ${
                activeTab === 'stylist'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ AI Outfit Stylist</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 py-3 px-5 font-extrabold text-sm border-b-2 transition-all ${
                activeTab === 'calculator'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>🌱 India Eco-Calculator</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {activeTab === 'stylist' ? (
              /* TAB 1: AI STYLIST */
              !result ? (
                <>
                  {/* Occasion Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-500" /> Select Indian Occasion
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {occasions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setOccasion(item)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            occasion === item
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibe Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-emerald-500" /> Your Indian Style Vibe
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {vibes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setVibe(item)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            vibe === item
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Palette Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-emerald-500" /> Preferred Color Palette
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {palettes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setColorPalette(item)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            colorPalette === item
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateStylist}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Wand2 className="w-5 h-5 animate-spin" />
                        <span>Styling Your Outfit...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate AI Styling Advice</span>
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
                  {/* Outfit Formula Card */}
                  <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-indigo-500/10 rounded-2xl border border-emerald-500/20">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                      Recommended Indian Outfit Formula
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-1">
                      {result.outfitFormula}
                    </p>
                  </div>

                  {/* AI Styling Advice */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Stylist Advice ({result.occasion})
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {result.advice}
                    </p>
                  </div>

                  {/* Styling Tips Checklist */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Pro Styling & Textile Tips
                    </h4>
                    <ul className="space-y-2">
                      {result.stylingTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => handleBrowseCategory(result.recommendedCategory)}
                      className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <span>Browse {result.recommendedCategory} in Marketplace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
                    >
                      Try Another Style
                    </button>
                  </div>
                </motion.div>
              )
            ) : (
              /* TAB 2: CIRCULAR ECO-CALCULATOR */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    India Circular Fashion Impact Calculator
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Calculate your environmental contribution to India's water conservation & carbon reduction by swapping instead of buying new.
                  </p>
                </div>

                {/* Number of Items Slider/Input */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">
                      Number of Items Swapped:
                    </label>
                    <span className="text-lg font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-xl">
                      {itemsSwapped} Garments
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={itemsSwapped}
                    onChange={(e) => setItemsSwapped(e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>1 Item</span>
                    <span>15 Items</span>
                    <span>30 Items</span>
                  </div>
                </div>

                {/* Fabric Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Primary Garment Material
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {fabrics.map((fab) => (
                      <button
                        key={fab}
                        type="button"
                        onClick={() => setFabricType(fab)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold text-left transition-all ${
                          fabricType === fab
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate CTA */}
                <button
                  type="button"
                  onClick={handleCalculateImpact}
                  disabled={calcLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  {calcLoading ? (
                    <>
                      <Recycle className="w-5 h-5 animate-spin" />
                      <span>Calculating Indian Footprint...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      <span>Calculate My Green Footprint</span>
                    </>
                  )}
                </button>

                {/* Display Calc Results */}
                {calcResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white border border-emerald-500/30 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-emerald-400" />
                        <div>
                          <span className="text-xs uppercase tracking-wider text-emerald-400 font-black">
                            Awarded Circular Title
                          </span>
                          <h4 className="text-lg font-black text-white">{calcResult.badgeTitle}</h4>
                        </div>
                      </div>
                      <button
                        onClick={handleCopyImpact}
                        className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                        title="Copy Shareable Text"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {calcResult.impactMessage}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-lg font-black text-white">{calcResult.totalWaterSavedLiters} L</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Water Saved</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <Leaf className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <div className="text-lg font-black text-white">{calcResult.totalCo2SavedKg} kg</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">CO₂e Prevented</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <TreeDeciduous className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <div className="text-lg font-black text-white">{calcResult.equivalentTreesPlanted}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Trees Equiv.</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <Recycle className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                        <div className="text-lg font-black text-white">{calcResult.landfillDivertedKg} kg</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Landfill Diverted</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
