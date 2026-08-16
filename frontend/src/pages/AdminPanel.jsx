import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { Users, Package, RefreshCw, CheckCircle, Trash2, TrendingUp, ShieldAlert, Zap, Globe, Activity, Terminal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, disputesRes, messagesRes, chartRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/disputes'),
        apiClient.get('/contact'),
        apiClient.get('/admin/chart-data')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDisputes(disputesRes.data);
      setMessages(messagesRes.data);
      setChartData(chartRes.data);
    } catch (err) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id, action) => {
    try {
      await apiClient.post(`/admin/disputes/${id}/resolve`, { action });
      toast.success('Dispute resolved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to resolve dispute');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('CRITICAL ACTION: Are you sure you want to permanently delete this user and all their items from the India network?')) {
      try {
        await apiClient.delete(`/admin/users/${id}`);
        toast.success('User purged from the system');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      await apiClient.patch(`/contact/${id}/status`, { status });
      toast.success(`Message marked as ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update message status');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return <Spinner message="Initializing National Command Center..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-8 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Matrix-like Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 backdrop-blur-xl shadow-2xl">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Terminal className="w-5 h-5" />
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">National Command Center</h1>
              </div>
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                 <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 Systems Online • India Region Active
              </p>
           </div>
           
           <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['overview', 'users', 'disputes', 'messages'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                       activeTab === tab 
                       ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700' 
                       : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </motion.div>

        <AnimatePresence mode="wait">
           {activeTab === 'overview' && (
              <motion.div key="overview" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-8">
                 
                 {/* HUD Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-800/50 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Users className="w-24 h-24 text-emerald-500" />
                       </div>
                       <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                             <Users className="w-6 h-6" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Citizens</h3>
                       </div>
                       <p className="text-4xl font-black text-white relative z-10">{stats?.totalUsers || 0}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-800/50 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Package className="w-24 h-24 text-blue-500" />
                       </div>
                       <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                             <Package className="w-6 h-6" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Inventory</h3>
                       </div>
                       <p className="text-4xl font-black text-white relative z-10">{stats?.totalItems || 0}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-800/50 hover:border-amber-500/30 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <RefreshCw className="w-24 h-24 text-amber-500" />
                       </div>
                       <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                             <RefreshCw className="w-6 h-6" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Swaps</h3>
                       </div>
                       <p className="text-4xl font-black text-white relative z-10">{stats?.totalSwaps || 0}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-800/50 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <CheckCircle className="w-24 h-24 text-purple-500" />
                       </div>
                       <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
                             <CheckCircle className="w-6 h-6" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed</h3>
                       </div>
                       <p className="text-4xl font-black text-white relative z-10">{stats?.completedSwaps || 0}</p>
                    </motion.div>
                 </div>

                 {/* Main Command Chart */}
                 <motion.div variants={itemVariants} className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none"></div>
                    <div className="p-6 md:p-8 border-b border-slate-800/80 flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-3">
                          <Activity className="w-6 h-6 text-emerald-400" />
                          <h2 className="text-2xl font-black text-white">Network Telemetry (30D)</h2>
                       </div>
                       <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-emerald-500 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE
                       </div>
                    </div>
                    <div className="p-6 h-[400px] w-full relative z-10">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                             <defs>
                                <linearGradient id="colorSwaps" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                             <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickMargin={10} stroke="#334155" />
                             <YAxis tick={{fontSize: 12, fill: '#64748b'}} stroke="#334155" allowDecimals={false} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                             />
                             <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                             <Area type="monotone" name="Total Swaps" dataKey="swaps" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSwaps)" />
                             <Area type="monotone" name="Completed Swaps" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </motion.div>

                 {/* Analytics Sub-grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden">
                       <div className="p-6 border-b border-slate-800/80">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                             <Globe className="w-5 h-5 text-blue-400" /> Category Distribution
                          </h2>
                       </div>
                       <div className="p-6 h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={stats?.categoryDistribution || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="_id" tick={{fontSize: 12, fill: '#64748b'}} stroke="#334155" />
                                <YAxis tick={{fontSize: 12, fill: '#64748b'}} stroke="#334155" allowDecimals={false} />
                                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                   {
                                      (stats?.categoryDistribution || []).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))
                                   }
                                </Bar>
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden">
                       <div className="p-6 border-b border-slate-800/80">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                             <Zap className="w-5 h-5 text-amber-400" /> Inventory Quality
                          </h2>
                       </div>
                       <div className="p-6 h-[300px] w-full flex justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie
                                   data={stats?.conditionDistribution || []}
                                   cx="50%"
                                   cy="50%"
                                   innerRadius={70}
                                   outerRadius={110}
                                   paddingAngle={5}
                                   dataKey="count"
                                   nameKey="_id"
                                   stroke="none"
                                >
                                   {(stats?.conditionDistribution || []).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }} />
                                <Legend iconType="circle" />
                             </PieChart>
                          </ResponsiveContainer>
                       </div>
                    </motion.div>
                 </div>
              </motion.div>
           )}

           {activeTab === 'users' && (
              <motion.div key="users" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
                 <div className="p-6 md:p-8 border-b border-slate-800/80 bg-slate-800/30">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                       <Users className="w-7 h-7 text-emerald-400" /> Identity Matrix
                    </h2>
                 </div>
                 <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-slate-800">
                             <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Operative</th>
                             <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Comms Link</th>
                             <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Sector</th>
                             <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Clearance</th>
                             <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Execute</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                          {users.map(user => (
                             <tr key={user._id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="p-4 font-bold text-slate-200">{user.name}</td>
                                <td className="p-4 text-slate-400 font-mono text-sm">{user.email}</td>
                                <td className="p-4 text-slate-400">{user.location}</td>
                                <td className="p-4">
                                   <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                      {user.role}
                                   </span>
                                </td>
                                <td className="p-4 text-right">
                                   {user.role !== 'admin' && (
                                      <button 
                                         onClick={() => deleteUser(user._id)}
                                         className="p-2 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
                                         title="Purge User"
                                      >
                                         <Trash2 className="w-5 h-5" />
                                      </button>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </motion.div>
           )}

           {activeTab === 'disputes' && (
              <motion.div key="disputes" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-red-900/50 shadow-2xl overflow-hidden shadow-red-900/10">
                 <div className="p-6 md:p-8 border-b border-red-900/50 bg-red-950/20">
                    <h2 className="text-2xl font-black text-red-500 flex items-center gap-3">
                       <ShieldAlert className="w-7 h-7" /> Active Conflicts
                    </h2>
                 </div>
                 <div className="p-6 md:p-8">
                    {disputes.length === 0 ? (
                       <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-900/50">
                          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
                          <p className="text-slate-400 font-bold">Network Secure. No active conflicts reported.</p>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 gap-6">
                          {disputes.map(dispute => (
                             <div key={dispute._id} className="border border-red-900/50 rounded-2xl p-6 bg-red-950/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                   <h3 className="font-mono font-bold text-slate-300">INCIDENT ID: <span className="text-white">{dispute._id}</span></h3>
                                   <span className="text-xs font-black tracking-widest uppercase text-red-400 bg-red-950 px-3 py-1 rounded-lg border border-red-900">Critical</span>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-6">
                                   <p className="text-sm font-bold text-red-400 mb-1 uppercase tracking-wider text-xs">Reason log:</p>
                                   <p className="text-slate-300">{dispute.disputeReason}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400 mb-6 bg-slate-900/50 p-4 rounded-xl">
                                   <div>
                                      <p className="uppercase text-xs font-bold text-slate-500 mb-1">Initiator:</p>
                                      <p className="font-medium text-white">{dispute.requesterId?.name}</p>
                                      <p className="font-mono text-xs">{dispute.requesterId?.email}</p>
                                   </div>
                                   <div>
                                      <p className="uppercase text-xs font-bold text-slate-500 mb-1">Target:</p>
                                      <p className="font-medium text-white">{dispute.receiverId?.name}</p>
                                      <p className="font-mono text-xs">{dispute.receiverId?.email}</p>
                                   </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                   <button onClick={() => resolveDispute(dispute._id, 'CancelSwap')} className="px-5 py-2.5 bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white font-bold rounded-xl transition-all">
                                      Abort & Revert Assets
                                   </button>
                                   <button onClick={() => resolveDispute(dispute._id, 'MarkCompleted')} className="px-5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-600 hover:text-white font-bold rounded-xl transition-all">
                                      Override & Complete
                                   </button>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </motion.div>
           )}

           {activeTab === 'messages' && (
              <motion.div key="messages" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-blue-900/50 shadow-2xl overflow-hidden shadow-blue-900/10">
                 <div className="p-6 md:p-8 border-b border-blue-900/50 bg-blue-950/20">
                    <h2 className="text-2xl font-black text-blue-400 flex items-center gap-3">
                       <Globe className="w-7 h-7" /> External Comms
                    </h2>
                 </div>
                 <div className="p-6 md:p-8">
                    {messages.length === 0 ? (
                       <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-900/50">
                          <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400 font-bold">No incoming transmissions.</p>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 gap-6">
                          {messages.map(msg => (
                             <div key={msg._id} className={`border rounded-2xl p-6 relative overflow-hidden ${msg.status === 'Unread' ? 'border-blue-500/50 bg-blue-950/20' : 'border-slate-800 bg-slate-900/50'}`}>
                                {msg.status === 'Unread' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                                <div className="flex justify-between items-start mb-4">
                                   <div>
                                      <h3 className="font-bold text-lg text-white">{msg.firstName} {msg.lastName}</h3>
                                      <p className="font-mono text-sm text-slate-500">{msg.email}</p>
                                   </div>
                                   <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-lg border ${msg.status === 'Unread' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                      {msg.status}
                                   </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-4">
                                   <span>Type: <span className="text-slate-300">{msg.type}</span></span>
                                   <span>•</span>
                                   <span>Received: <span className="text-slate-300">{new Date(msg.createdAt).toLocaleDateString()}</span></span>
                                </div>
                                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-6 text-slate-300 font-medium leading-relaxed">
                                   {msg.message}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                   {msg.status === 'Unread' && (
                                      <button onClick={() => updateMessageStatus(msg._id, 'Read')} className="px-5 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:bg-blue-600 hover:text-white font-bold rounded-xl transition-all">
                                         Acknowledge
                                      </button>
                                   )}
                                   {msg.status !== 'Resolved' && (
                                      <button onClick={() => updateMessageStatus(msg._id, 'Resolved')} className="px-5 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-400 font-bold rounded-xl transition-all">
                                         Mark Resolved
                                      </button>
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
