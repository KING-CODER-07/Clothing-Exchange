import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplet, Wind, TrendingUp, Sparkles, Award } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend,
  RadialBarChart, RadialBar
} from 'recharts';

export default function ImpactDashboard() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    out: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 }
  };

  // Mock data for the charts
  const swapTrendsData = [
    { month: 'Jan', swaps: 4, carbonSaved: 12 },
    { month: 'Feb', swaps: 7, carbonSaved: 21 },
    { month: 'Mar', swaps: 5, carbonSaved: 15 },
    { month: 'Apr', swaps: 12, carbonSaved: 36 },
    { month: 'May', swaps: 9, carbonSaved: 27 },
    { month: 'Jun', swaps: 15, carbonSaved: 45 },
    { month: 'Jul', swaps: 22, carbonSaved: 66 }
  ];

  const waterData = [
    { name: 'Target', value: 100000, fill: '#f1f5f9' },
    { name: 'Saved', value: 74200, fill: '#10b981' }
  ];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="max-w-7xl mx-auto py-12 px-4 relative min-h-screen"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm mb-6 border border-emerald-100">
          <Leaf className="w-4 h-4" /> Eco-Analytics Engine
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-4">
          Your Circular Impact
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl font-medium">
          Track the real-world environmental benefits of your sustainable fashion choices. Every swap makes a measurable difference.
        </p>
      </motion.div>

      {/* Top Metrics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-blue-500/10 group-hover:scale-110 transition-transform duration-500">
            <Droplet className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 relative z-10">
            <Droplet className="w-7 h-7" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1 relative z-10">74,200 L</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider relative z-10">Total Water Saved</p>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-xl shadow-emerald-500/5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
            <Wind className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 relative z-10">
            <Wind className="w-7 h-7" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1 relative z-10">222 Kg</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider relative z-10">CO₂ Emissions Prevented</p>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-3 h-3" /> +24% this month
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-xl shadow-purple-500/5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-purple-500/10 group-hover:scale-110 transition-transform duration-500">
            <Award className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 relative z-10">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1 relative z-10">74</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider relative z-10">Items Kept From Landfill</p>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-3 h-3" /> Top 5% of Swappers
          </div>
        </div>
      </motion.div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Large Line Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <h3 className="text-2xl font-black text-slate-900 mb-6">Carbon Offset Over Time</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={swapTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="carbonSaved" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCarbon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Panel: Radial Chart & Activity */}
        <motion.div variants={itemVariants} className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-900/40"></div>
          
          <h3 className="text-2xl font-black mb-6 relative z-10">Water Goal 2026</h3>
          <div className="h-64 relative z-10 flex items-center justify-center -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={waterData} startAngle={90} endAngle={-270}>
                <RadialBar minAngle={15} background={{ fill: '#334155' }} clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-3xl font-black text-white">74%</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Achieved</span>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 mt-4">
            <h4 className="font-bold text-emerald-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Community Standing
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              You are among the <span className="font-bold text-white">top 5% of eco-contributors</span> in your region this quarter. Keep swapping to reach Diamond Tier!
            </p>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
