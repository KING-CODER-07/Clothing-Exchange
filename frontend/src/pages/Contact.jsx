import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, PhoneCall, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIST = (date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/contact', formData);
      toast.success('Message sent! Our India Support team will respond within 24 hours.');
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    out: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 }
  };

  const hqLocations = [
    { city: "Mumbai HQ", desc: "Bandra Kurla Complex", icon: MapPin, color: "emerald" },
    { city: "Bengaluru Hub", desc: "Indiranagar", icon: MapPin, color: "purple" },
    { city: "Delhi Office", desc: "Connaught Place", icon: MapPin, color: "blue" }
  ];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="max-w-7xl mx-auto py-12 px-4 relative"
    >
       {/* Background ambient glow */}
       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <motion.div variants={itemVariants} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-sm uppercase tracking-widest mb-6 shadow-sm">
          <PhoneCall className="w-5 h-5 animate-pulse" /> India Member Assistance
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600 tracking-tighter mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          Have questions about a premium swap, need KYC verification support, or want to partner with us? Our national team is ready.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 flex flex-col items-start hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-2">Priority Support</h3>
            <p className="text-slate-600 font-medium mb-4">support@swapstyle.in</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold border border-emerald-100">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
               Avg Response: &lt; 2 Hours
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-800 flex flex-col items-start relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 relative z-10 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="font-black text-2xl text-white mb-2 relative z-10">Live Chat & AI Stylist</h3>
            <p className="text-slate-400 font-medium mb-4 relative z-10">Available 24/7 via floating widget.</p>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/50 text-purple-300 rounded-lg text-sm font-bold border border-purple-800/50 relative z-10">
               <Sparkles className="w-4 h-4" /> Instant Vibe Matching
            </div>
          </div>

          {/* Regional HQ Cards */}
          <div className="bg-white/60 backdrop-blur-3xl rounded-[2rem] border border-white/50 overflow-hidden shadow-xl">
             <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                   <MapPin className="text-emerald-500" /> Regional Offices
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                   <Clock className="w-3 h-3" /> {formatIST(time)} IST
                </div>
             </div>
             <div className="divide-y divide-slate-100">
                {hqLocations.map((hq, idx) => (
                   <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div>
                         <p className="font-extrabold text-slate-900 mb-1">{hq.city}</p>
                         <p className="text-sm font-medium text-slate-500">{hq.desc}</p>
                      </div>
                      <span className="flex h-3 w-3 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${hq.color}-400 opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 bg-${hq.color}-500`}></span>
                      </span>
                   </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={itemVariants} className="lg:col-span-7 h-full">
           <div className="h-full bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/50 flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
               {submitted ? (
                  <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-16 text-center"
                  >
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
                     <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                     Message Received!
                  </h3>
                  <p className="text-slate-600 text-lg max-w-md mx-auto mb-10 font-medium">
                     Your request has been securely routed to our Bandra Kurla Complex headquarters. We will notify your registered email shortly.
                  </p>
                  <button
                     onClick={() => setSubmitted(false)}
                     className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl"
                  >
                     Send Another Message
                  </button>
                  </motion.div>
               ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     <h2 className="text-3xl font-black text-slate-900 mb-3">
                     Drop Us A Line
                     </h2>
                     <p className="text-slate-500 text-base font-medium mb-8">
                     Fill out the form below and our dedicated India community support team will reach out promptly.
                     </p>
         
                     <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 ml-1">
                           First Name
                           </label>
                           <input
                           type="text"
                           name="firstName"
                           value={formData.firstName}
                           onChange={handleChange}
                           required
                           placeholder="Priya"
                           className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 outline-none transition-all text-base font-medium backdrop-blur-sm"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 ml-1">
                           Last Name
                           </label>
                           <input
                           type="text"
                           name="lastName"
                           value={formData.lastName}
                           onChange={handleChange}
                           required
                           placeholder="Sharma"
                           className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 outline-none transition-all text-base font-medium backdrop-blur-sm"
                           />
                        </div>
                     </div>
         
                     <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 ml-1">
                           Email Address
                        </label>
                        <input
                           type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           required
                           placeholder="priya@example.in"
                           className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 outline-none transition-all text-base font-medium backdrop-blur-sm"
                        />
                     </div>
         
                     <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 ml-1">
                           Message
                        </label>
                        <textarea
                           required
                           name="message"
                           value={formData.message}
                           onChange={handleChange}
                           rows="5"
                           className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 outline-none transition-all resize-none text-base font-medium backdrop-blur-sm"
                           placeholder="How can our India support team assist you today?"
                        ></textarea>
                     </div>
         
                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl text-lg transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                     >
                        <Send className="w-6 h-6" />
                        <span>{loading ? 'Transmitting Securely...' : 'Send Message'}</span>
                     </button>
         
                     <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-6 font-medium">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span>Secured by 256-Bit India Enterprise Encryption</span>
                     </div>
                     </form>
                  </motion.div>
               )}
            </AnimatePresence>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
