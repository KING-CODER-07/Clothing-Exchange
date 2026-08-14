import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Settings, Package, Activity, RefreshCw, LogOut, Star, Trophy, Medal, Shield, Leaf, Zap, Droplet, Wind, Trash2, Award, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ available: 0, swapped: 0 });
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items/user/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(res.data);
      
      const available = res.data.filter(i => i.status === 'Available').length;
      const swapped = res.data.filter(i => i.status === 'Swapped').length;
      setStats({ available, swapped });

      // Fetch user reviews
      if (user?.id) {
        const reviewRes = await axios.get(`http://localhost:5000/api/reviews/user/${user.id}`);
        setReviews(reviewRes.data.reviews);
        setAvgRating(reviewRes.data.avgRating);
      }
      // Fetch user profile for gamification stats
      if (user?.id) {
        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(profileRes.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Listing deleted successfully');
        fetchMyItems();
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleBoost = async (id) => {
    try {
      const toastId = toast.loading('Processing mock payment securely...');
      await axios.post(`http://localhost:5000/api/items/${id}/boost`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Payment successful! Your listing is now Featured.', { id: toastId });
      fetchMyItems();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to boost item');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCopyPassport = () => {
    const passportText = `🇮🇳 OFFICIAL SWAPSTYLE INDIA CIRCULAR ECO-PASSPORT\n` +
      `👤 Member: ${user?.name || 'Sustainable Swapper'} (${user?.location || 'India'})\n` +
      `🌿 Eco-Points: ${profile?.ecoPoints || 0}\n` +
      `💧 Verified Water Saved: ${(stats.swapped * 2700).toLocaleString()} Liters\n` +
      `☁️ Verified CO₂e Prevented: ${(stats.swapped * 5.5).toFixed(1)} kg\n` +
      `🏆 National Circular Title: Western Ghats Eco-Guardian\n` +
      `Join the Indian sustainable fashion revolution at SwapStyle India! ✨`;
    navigator.clipboard.writeText(passportText);
    toast.success('🇮🇳 India Circular Eco-Passport Certificate copied to clipboard!');
  };

  const getBadgeIcon = (badge) => {
    switch(badge) {
      case 'Eco Warrior': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'Top Rated': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'First Swap': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'Sustainability Guru': return <Trophy className="w-5 h-5 text-purple-500" />;
      default: return <Medal className="w-5 h-5 text-slate-500" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  if (loading) return <Spinner message="Loading your profile..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto py-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-slate-100 text-center relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-400 to-teal-500 z-0"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-emerald-500 uppercase">
                {user?.name?.charAt(0)}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">{user?.name}</h2>
              <p className="text-slate-500 font-medium mb-2">{user?.location}</p>
              
              <div className="flex items-center justify-center gap-1 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-slate-900">{avgRating > 0 ? avgRating : 'New'}</span>
                <span className="text-slate-500 text-sm">({reviews.length} Reviews)</span>
              </div>
              
              <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-emerald-700">Eco Points</span>
                  <span className="text-xl font-black text-emerald-600">{profile?.ecoPoints || 0}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile?.badges?.map((badge, i) => (
                    <div key={i} className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-xs font-bold text-slate-700 border border-emerald-100 shadow-sm" title={badge}>
                      {getBadgeIcon(badge)}
                      <span className="truncate max-w-[80px]">{badge}</span>
                    </div>
                  ))}
                  {(!profile?.badges || profile.badges.length === 0) && (
                    <span className="text-xs text-emerald-600/70 italic">No badges yet</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link to="/swap-requests" className="flex items-center justify-center gap-2 p-3 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <RefreshCw className="w-5 h-5" /> Swap Requests
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 p-3 text-red-500 bg-red-50 rounded-xl font-bold hover:bg-red-100 transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Closet</h2>
            <Link to="/add-listing" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg">
              <Plus className="w-5 h-5" /> Add Item
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 transition-colors duration-300">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Available Items</p>
                <p className="text-3xl font-black text-slate-900">{stats.available}</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 transition-colors duration-300">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Swapped Items</p>
                <p className="text-3xl font-black text-slate-900">{stats.swapped}</p>
              </div>
            </motion.div>
          </div>

          {/* Eco Impact Dashboard */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 mb-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/20 pb-4">
                <div>
                  <h2 className="text-2xl font-black mb-1 flex items-center gap-2"><Leaf className="w-6 h-6 text-yellow-300" /> 🇮🇳 India Circular Eco-Passport</h2>
                  <p className="text-emerald-50 text-sm font-medium">Verified national contribution to India's water conservation & carbon reduction.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPassport}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-white/30 flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span>Copy Verified Eco-Passport Card</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-colors">
                  <Droplet className="w-8 h-8 text-blue-200 mb-3" />
                  <p className="text-3xl font-black mb-1">{(stats.swapped * 2700).toLocaleString()}</p>
                  <p className="text-sm text-emerald-100 font-bold uppercase tracking-wider">Water Saved</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-colors">
                  <Wind className="w-8 h-8 text-emerald-200 mb-3" />
                  <p className="text-3xl font-black mb-1">{(stats.swapped * 5.5).toFixed(1)}</p>
                  <p className="text-sm text-emerald-100 font-bold uppercase tracking-wider">CO2 Prevented</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-colors">
                  <Trash2 className="w-8 h-8 text-amber-200 mb-3" />
                  <p className="text-3xl font-black mb-1">{(stats.swapped * 0.2).toFixed(1)}</p>
                  <p className="text-sm text-emerald-100 font-bold uppercase tracking-wider">Waste Reduced</p>
                </div>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 transition-colors duration-300">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your closet is empty</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start adding items to your closet so you can trade them for pieces you'll love.</p>
              <Link to="/add-listing" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Add Your First Item
              </Link>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {items.map(item => (
                <motion.div variants={itemAnim} key={item._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col">
                  <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black shadow-sm uppercase tracking-wider
                      ${item.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-slate-900/90 text-white'}`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-4 flex-grow">{item.brand || 'Unbranded'} • {item.size}</p>
                    
                    <div className="flex gap-2 mt-auto">
                      <Link to={`/items/${item._id}`} className="flex-1 py-2 bg-slate-50 text-center text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                        View
                      </Link>
                      {item.status === 'Available' && (
                        <>
                          <Link to={`/edit-listing/${item._id}`} className="flex-1 py-2 bg-blue-50 text-center text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors text-sm">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(item._id)} className="flex-1 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                    {item.status === 'Available' && (
                      <div className="mt-2">
                        {item.isFeatured ? (
                          <div className="w-full py-2 flex items-center justify-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-bold rounded-xl border border-amber-200 text-sm shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                            <Star className="w-4 h-4 fill-current" /> Featured Listing
                          </div>
                        ) : (
                          <button onClick={() => handleBoost(item._id)} className="w-full py-2 flex items-center justify-center gap-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all text-sm shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Zap className="w-4 h-4" /> Boost for $4.99
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* User Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">What People Say</h2>
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[2rem] shadow-sm border border-slate-100 transition-colors duration-300">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
                <p className="text-slate-500">Complete swaps to build your reputation!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(review => (
                  <div key={review._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-emerald-600 uppercase">
                          {review.reviewerId?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{review.reviewerId?.name}</p>
                          <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
