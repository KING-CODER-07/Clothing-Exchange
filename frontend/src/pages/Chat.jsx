import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, ShieldAlert, CheckCircle2, MoreVertical, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';

export default function Chat() {
  const { swapRequestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${swapRequestId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Connect to Socket.io
    const socket = io('http://localhost:5000');
    
    socket.emit('joinRoom', swapRequestId);
    
    socket.on('newMessage', (message) => {
      setMessages(prev => {
        // Prevent duplicate messages if we are the sender (we already pushed it)
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [swapRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/chat/${swapRequestId}`, {
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Add immediately to UI for snappy feel
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <Spinner message="Loading secure negotiation room..." />;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50/50 p-4 md:p-6 overflow-hidden relative">
       {/* Ambient Glows */}
       <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full h-full flex flex-col bg-white/80 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 border border-white/50 rounded-[2.5rem] overflow-hidden relative z-10">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
               onClick={() => navigate('/swap-requests')} 
               className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
               <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  Secure Swap Chat <Sparkles className="w-4 h-4 text-emerald-500" />
               </h2>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-2 w-2 relative">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                     End-to-End Encrypted
                  </span>
               </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                const reason = window.prompt("Why are you raising a dispute? Please explain briefly.");
                if (reason) {
                  try {
                    await axios.post(`http://localhost:5000/api/swaps/${swapRequestId}/dispute`, { reason }, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    toast.success("Dispute raised. An India admin will review it shortly.");
                  } catch (e) { toast.error("Failed to raise dispute"); }
                }
              }}
              className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> Report
            </button>
            <button 
              onClick={async () => {
                if(window.confirm('Are you sure you want to finalize this swap? Ensure the terms are agreed upon.')) {
                  try {
                    await axios.patch(`http://localhost:5000/api/swaps/${swapRequestId}/status`, { status: 'Completed' }, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    toast.success("Swap Completed Successfully!");
                    navigate('/swap-requests');
                  } catch (e) { toast.error("Failed to complete swap"); }
                }
              }}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Finalize
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
               <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar bg-slate-50/30">
          
          <div className="flex justify-center mb-4">
             <div className="px-4 py-1.5 rounded-full bg-slate-200/50 border border-slate-300/50 text-xs font-bold text-slate-500">
                Negotiation started for Swap #{swapRequestId.slice(-6)}
             </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 text-sm font-medium text-emerald-800">
             <AlertCircle className="w-5 h-5 shrink-0 text-emerald-600" />
             <p>Remember our community guidelines: Be respectful, negotiate fairly, and verify item details before finalizing.</p>
          </div>

          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-slate-500 my-auto p-8"
               >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Sparkles className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No messages yet</h3>
                  <p>Start the conversation to arrange the India swap!</p>
               </motion.div>
            ) : (
               messages.map((msg, index) => {
               const isMe = msg.senderId._id === user.id;
               return (
                  <motion.div 
                     key={msg._id || index}
                     initial={{ opacity: 0, scale: 0.9, y: 10, originX: isMe ? 1 : 0 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                     <div className="flex items-center gap-2 mb-1.5 px-2">
                        {!isMe && <span className="text-xs font-bold text-slate-500">{msg.senderId.name}</span>}
                     </div>
                     
                     <div className={`px-5 py-3.5 max-w-[85%] md:max-w-[70%] text-sm md:text-base font-medium shadow-sm ${
                     isMe 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl rounded-br-sm shadow-emerald-500/20' 
                        : 'bg-white text-slate-800 rounded-3xl rounded-bl-sm border border-slate-100'
                     }`}>
                     {msg.content}
                     </div>
                  </motion.div>
               );
               })
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-slate-200 rounded-b-[2.5rem]">
          <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow px-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white text-base font-medium transition-all shadow-sm"
            />
            <button 
              type="submit"
              className="w-14 h-auto flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              disabled={!newMessage.trim()}
            >
              <Send className="h-6 w-6 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
