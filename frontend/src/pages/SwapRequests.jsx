import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw, Check, X, MessageSquare, ArrowRightLeft, Star, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';

export default function SwapRequests() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSwapId, setSelectedSwapId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [inRes, outRes] = await Promise.all([
        axios.get('http://localhost:5000/api/swaps/incoming', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/swaps/outgoing', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setRequests({ incoming: inRes.data, outgoing: outRes.data });
    } catch (err) {
      console.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/swaps/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update request');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        swapRequestId: selectedSwapId,
        rating: reviewData.rating,
        comment: reviewData.comment
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast.success('Review submitted successfully! You earned Eco Points!');
      setReviewModalOpen(false);
      setReviewData({ rating: 5, comment: '' });
      fetchRequests(); 
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (loading) return <Spinner message="Loading your swap requests..." />;

  const displayRequests = activeTab === 'incoming' ? requests.incoming : requests.outgoing;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-10 px-4"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Swap Headquarters</h1>
          <p className="text-slate-500 font-medium text-lg">Manage your ongoing circular fashion exchanges.</p>
        </div>
        
        {/* Animated Premium Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
          <button
            className={`relative px-8 py-3 font-bold text-sm uppercase tracking-wider rounded-xl transition-all z-10 ${activeTab === 'incoming' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('incoming')}
          >
            {activeTab === 'incoming' && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md" />
            )}
            Incoming Offers ({requests.incoming.length})
          </button>
          <button
            className={`relative px-8 py-3 font-bold text-sm uppercase tracking-wider rounded-xl transition-all z-10 ${activeTab === 'outgoing' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('outgoing')}
          >
            {activeTab === 'outgoing' && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-md" />
            )}
            Sent Requests ({requests.outgoing.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {displayRequests.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <ArrowRightLeft className="h-20 w-20 text-slate-200 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No {activeTab} requests yet</h3>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              {activeTab === 'incoming' 
                ? "Your closet is quiet. Feature your items to attract more swap offers!" 
                : "You haven't requested to swap any items. Browse the marketplace to find your next treasure!"}
            </p>
            {activeTab === 'outgoing' && (
              <Link to="/marketplace" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:-translate-y-1 transition-all">
                Explore Marketplace <ArrowRightLeft className="w-5 h-5" />
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {displayRequests.map(req => (
              <motion.div 
                variants={itemVariants} 
                key={req._id} 
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col xl:flex-row items-center gap-8 hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors
                  ${req.status === 'Accepted' ? 'bg-green-500' : 
                    req.status === 'Pending' ? 'bg-amber-400' : 
                    req.status === 'Completed' ? 'bg-blue-500' : 'bg-red-500'}`} 
                />

                {/* Items Exchange Visual */}
                <div className="flex items-center gap-4 flex-1 w-full justify-center xl:justify-start">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-50 relative z-10">
                      <img src={req.requestedItemId?.imageUrl} alt="Requested" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <span className="block mt-3 text-sm font-bold text-slate-700 truncate w-32">{req.requestedItemId?.title}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Their Item</span>
                  </div>
                  
                  <div className="flex flex-col items-center px-6 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2 hidden sm:block"></div>
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 z-10 shadow-sm">
                      <RefreshCw className={`h-5 w-5 ${req.status === 'Pending' ? 'animate-spin-slow text-amber-500' : 'text-emerald-500'}`} />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-50 relative z-10">
                      <img src={req.offeredItemId?.imageUrl} alt="Offered" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <span className="block mt-3 text-sm font-bold text-slate-700 truncate w-32">{req.offeredItemId?.title}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Your Item</span>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="flex-1 text-center xl:text-left w-full">
                  <div className="mb-6">
                    <div className="flex items-center justify-center xl:justify-start gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full shadow-sm
                        ${req.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                          req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          req.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {req.status}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-lg text-slate-700 font-medium">
                      {activeTab === 'incoming' ? (
                        <><strong>{req.requesterId?.name}</strong> wants to trade their <strong>{req.offeredItemId?.title}</strong> for your <strong>{req.requestedItemId?.title}</strong>.</>
                      ) : (
                        <>You offered your <strong>{req.offeredItemId?.title}</strong> to <strong>{req.receiverId?.name}</strong> in exchange for their <strong>{req.requestedItemId?.title}</strong>.</>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center xl:justify-start">
                    {req.status === 'Accepted' && (
                      <button 
                        onClick={() => navigate(`/chat/${req._id}`)}
                        className="px-6 py-3 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <MessageSquare className="h-5 w-5" /> Chat to Exchange
                      </button>
                    )}
                    
                    {activeTab === 'incoming' && req.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(req._id, 'Accepted')}
                          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/20 hover:-translate-y-1"
                        >
                          <Check className="h-5 w-5" /> Accept Swap
                        </button>
                        <button 
                          onClick={() => updateStatus(req._id, 'Rejected')}
                          className="px-6 py-3 bg-white border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-2"
                        >
                          <X className="h-5 w-5" /> Decline
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button 
                        onClick={() => {
                          if(window.confirm('Has the physical exchange taken place? Mark this as completed.')) updateStatus(req._id, 'Completed')
                        }}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {req.status === 'Completed' && (
                      <button 
                        onClick={() => {
                          setSelectedSwapId(req._id);
                          setReviewModalOpen(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:-translate-y-1"
                      >
                        <Star className="h-5 w-5 fill-current" /> Leave a Review
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Review Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative shadow-2xl border border-white/50"
            >
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 fill-current" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Rate the Swap</h2>
              <p className="text-slate-500 font-medium mb-8">How was your experience trading with this user? Honest feedback helps the community.</p>
              
              <form onSubmit={submitReview} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Select Rating</label>
                  <div className="flex gap-2 justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({...reviewData, rating: star})}
                        className={`transition-all duration-300 ${reviewData.rating >= star ? 'text-amber-400 scale-125' : 'text-slate-300 hover:scale-110 hover:text-amber-200'}`}
                      >
                        <Star className="w-10 h-10 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Your Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none h-32 resize-none bg-slate-50 font-medium text-slate-900 transition-colors"
                    placeholder="Friendly, fast shipping, item exactly as described..."
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-wider rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1"
                >
                  Publish Review
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
