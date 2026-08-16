import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, RefreshCw, Sparkles, MapPin, Award } from 'lucide-react';
import Spinner from '../components/Spinner';

export default function Exchanged() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchanged = async () => {
      try {
        const res = await apiClient.get('/swaps');
        const allSwaps = [...(res.data.incoming || []), ...(res.data.outgoing || [])];
        const accepted = allSwaps.filter((s) => s.status === 'Accepted' || s.status === 'Completed');
        setCompleted(accepted);
      } catch (err) {
        console.error('Failed to fetch completed swaps', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExchanged();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-extrabold text-xs uppercase tracking-wider mb-3">
          <Award className="w-4 h-4" /> Circular Fashion Hall of Swaps
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
          Completed India Exchanges
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Review the pre-loved garments you and your swap partners have successfully exchanged across India.
        </p>
      </div>

      {completed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
        >
          <RefreshCw className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            No completed swaps yet
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Accept or initiate a swap request in the Marketplace to build your India circular wardrobe history.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completed.map((swap, index) => (
            <motion.div
              key={swap._id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Swap Verified Completed
                </span>
                <span className="text-xs font-bold text-slate-400">
                  ID: #{swap._id?.slice(-6) || 'IND-01'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">Partner:</strong>{' '}
                  {swap.targetUser?.name || 'Verified Indian Swapper'}
                </p>
                <p>
                  <strong className="text-slate-900">Item Exchanged:</strong>{' '}
                  {swap.targetItem?.title || 'Traditional / Contemporary Garment'}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1 text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>2,700L Water Saved</span>
                </div>
                <span>+30 Eco-Points Earned</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
