import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Leaf, MapPin, Award, ArrowRight, ShieldCheck, 
  Heart, Search, BookOpen, Droplets, Recycle, Globe, Filter 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function WeavesEncyclopedia() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const weavesData = [
    {
      id: 'banarasi',
      name: 'Banarasi Brocade & Pure Silk',
      origin: 'Varanasi, Uttar Pradesh',
      region: 'North India',
      category: 'Silk & Luxury',
      ecoScore: 98,
      durabilityDecades: '3–5 Decades (Heirloom Grade)',
      biodegradable: '100% Natural Silk & Gold/Silver Zari',
      waterSavedLiters: 4800,
      description:
        'Renowned across the globe for gold and silver zari brocades and opulent embroidery. Pure Banarasi sarees represent the zenith of Indian handloom heritage, traditionally passed down through generations as heirloom circular fashion.',
      careTip: 'Dry clean only; store in breathable muslin cloth with dried neem leaves.',
      stylingAdvice: 'Pair with oxidized temple jewelry or contrasting Chanderi blouses for regal weddings.',
      imageBg: 'from-amber-500/20 via-orange-500/10 to-red-600/20',
      badgeColor: 'bg-amber-500 text-white',
      keyword: 'Banarasi'
    },
    {
      id: 'chanderi',
      name: 'Chanderi Silk-Cotton Weave',
      origin: 'Chanderi, Madhya Pradesh',
      region: 'Central India',
      category: 'Silk-Cotton',
      ecoScore: 96,
      durabilityDecades: '2–3 Decades',
      biodegradable: '100% Biodegradable Silk-Cotton Blend',
      waterSavedLiters: 3200,
      description:
        'Famous for its feather-light sheer texture and fine luxury drape. Weaving pure silk and traditional cotton yarns together creates an airy, breathable fabric perfect for Indian summers and festive evenings.',
      careTip: 'Hand wash gently in cold water with organic mild detergent or dry clean.',
      stylingAdvice: 'Ideal for daytime Haldi ceremonies and formal Indian office wear.',
      imageBg: 'from-teal-500/20 via-emerald-500/10 to-cyan-600/20',
      badgeColor: 'bg-teal-600 text-white',
      keyword: 'Chanderi'
    },
    {
      id: 'khadi',
      name: 'Handloom Khadi & Ahimsa Cotton',
      origin: 'Wardha & Pan-India Artisans',
      region: 'National Heritage',
      category: 'Organic Cotton',
      ecoScore: 100,
      durabilityDecades: '1–2 Decades (Gets Softer with Age)',
      biodegradable: '100% Zero-Carbon Hand-Spun & Hand-Woven',
      waterSavedLiters: 5600,
      description:
        'The soul of India’s freedom and sustainability movement. Hand-spun and hand-woven without electricity, Khadi has the lowest carbon footprint of any fabric on Earth while offering temperature-regulating micro-aeration.',
      careTip: 'Wash with natural reetha/shikakai; dry in shade to preserve organic indigo dyes.',
      stylingAdvice: 'Layer Khadi jackets over linen kurtas for effortless sustainable streetwear.',
      imageBg: 'from-emerald-500/20 via-green-500/10 to-teal-600/20',
      badgeColor: 'bg-emerald-600 text-white',
      keyword: 'Khadi'
    },
    {
      id: 'kalamkari',
      name: 'Kalamkari Natural-Dye Art',
      origin: 'Srikalahasti & Pedana, Andhra Pradesh',
      region: 'South India',
      category: 'Artisan Cotton',
      ecoScore: 97,
      durabilityDecades: '2 Decades',
      biodegradable: '100% Cotton with Vegetable & Alum Dyes',
      waterSavedLiters: 3900,
      description:
        'Hand-painted or block-printed cotton textiles colored entirely with herbal root extracts, indigo, jaggery, and iron rust. Zero chemical toxins enter Indian river systems during production.',
      careTip: 'First wash in cold saltwater; never bleach or tumble dry.',
      stylingAdvice: 'Pair Kalamkari dupattas with monochrome raw cotton Kurtas for striking contrast.',
      imageBg: 'from-orange-500/20 via-amber-500/10 to-yellow-600/20',
      badgeColor: 'bg-orange-600 text-white',
      keyword: 'Kalamkari'
    },
    {
      id: 'ikat',
      name: 'Pochampally & Sambalpuri Ikat',
      origin: 'Telangana & Odisha',
      region: 'East & South India',
      category: 'Resist-Dye Handloom',
      ecoScore: 95,
      durabilityDecades: '2–3 Decades',
      biodegradable: '100% Cotton or Mulberry Silk',
      waterSavedLiters: 4100,
      description:
        'A mesmerizing mathematical dye technique where yarns are tie-dyed in precise geometric patterns before weaving even begins. Demonstrates unparalleled artisan precision.',
      careTip: 'Gentle wash in cold water; avoid direct scorching sunlight.',
      stylingAdvice: 'Ikat A-line dresses and structured sarees make a bold statement in executive meetings.',
      imageBg: 'from-purple-500/20 via-indigo-500/10 to-blue-600/20',
      badgeColor: 'bg-purple-600 text-white',
      keyword: 'Ikat'
    },
    {
      id: 'kanjivaram',
      name: 'Kanjivaram Temple Silk',
      origin: 'Kanchipuram, Tamil Nadu',
      region: 'South India',
      category: 'Silk & Luxury',
      ecoScore: 99,
      durabilityDecades: '4–6 Decades (Heirloom Dynasty)',
      biodegradable: '100% Mulberry Silk & Real Gold Thread',
      waterSavedLiters: 5200,
      description:
        'Woven from pure mulberry silk thread and real zari, Kanjivaram weaves are famous for interlocking border techniques (Korvai). Known to endure for over 50 years with enduring luster.',
      careTip: 'Refold every 6 months to prevent zari creasing; keep in dry climate-controlled cedar boxes.',
      stylingAdvice: 'The ultimate wedding attire; adorn with antique South Indian temple gold.',
      imageBg: 'from-rose-500/20 via-pink-500/10 to-red-600/20',
      badgeColor: 'bg-rose-600 text-white',
      keyword: 'Kanjivaram'
    }
  ];

  const categories = ['All', 'Silk & Luxury', 'Organic Cotton', 'Silk-Cotton', 'Artisan Cotton', 'Resist-Dye Handloom'];

  const filteredWeaves = weavesData.filter((weave) => {
    const matchesCat = selectedCategory === 'All' || weave.category === selectedCategory;
    const matchesSearch =
      weave.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      weave.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      weave.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExploreInMarketplace = (keyword) => {
    navigate(`/marketplace?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto pb-20"
    >
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-14 mb-12 border border-emerald-500/30 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Make-in-India Circular Heritage</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Indian Heritage Weaves & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Sustainable Textile Encyclopedia
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            Explore the timeless circularity of India’s artisanal weaves. From Varanasi's gold zari brocades to Wardha's zero-carbon Khadi, discover why pre-loved Indian handlooms are the ultimate heirloom sustainable fashion.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/marketplace"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all"
            >
              <span>Explore All Handlooms in Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search weaves, origins, techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Weaves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredWeaves.map((weave, idx) => (
            <motion.div
              key={weave.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all flex flex-col group"
            >
              {/* Header Card Visual Banner */}
              <div className={`p-6 bg-gradient-to-br ${weave.imageBg} border-b border-slate-200 relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-black px-3 py-1 rounded-full shadow-sm ${weave.badgeColor}`}>
                    {weave.category}
                  </span>
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-extrabold text-emerald-600 shadow-sm">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Eco Score: {weave.ecoScore}/100</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1 group-hover:text-emerald-500 transition-colors">
                  {weave.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{weave.origin}</span>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {weave.description}
                </p>

                {/* Eco & Durability Metrics Pill */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Lifespan
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {weave.durabilityDecades}
                    </span>
                  </div>
                  <div className="text-center border-l border-slate-200">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Water Saved
                    </span>
                    <span className="text-xs font-black text-emerald-600">
                      {weave.waterSavedLiters.toLocaleString()} L / swap
                    </span>
                  </div>
                </div>

                {/* Styling Tip Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Stylist Note</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    {weave.stylingAdvice}
                  </p>
                </div>

                {/* CTA Action */}
                <button
                  type="button"
                  onClick={() => handleExploreInMarketplace(weave.keyword)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md group/btn"
                >
                  <span>Swap {weave.keyword} in Marketplace</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Banner */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black">Got a Heritage Handloom in Your Wardrobe?</h3>
          <p className="text-emerald-100 text-sm max-w-xl">
            Give your pre-loved Banarasi saree or Khadi jacket a new life. List it on SwapStyle India today and earn double circular Eco-Points!
          </p>
        </div>
        <Link
          to="/add-listing"
          className="px-8 py-4 bg-white text-emerald-700 hover:bg-slate-100 font-black rounded-2xl shadow-lg transition-all transform hover:scale-105 shrink-0"
        >
          + List Indian Handloom Item
        </Link>
      </div>
    </motion.div>
  );
}
