import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, MapPin, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: 'Select a city'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const indianCities = [
    'Select a city','Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Ranchi', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      toast.success('Welcome to SwapStyle India! 30 Eco-Points awarded.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.error || 
                       (err.message === 'Network Error' ? 'Network Error: Cannot connect to server (is backend running?)' : 'Registration failed');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100 my-8">
      {/* Right Image Section (Flipped for Register) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 order-2">
        <img 
          src="/images/fashion_community_1_1779264883216.png" 
          alt="Fashion Community" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold tracking-wide">30 Eco-Points Signup Bonus</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              Join India's <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">Circular Fashion</span> Movement
            </h2>
            <p className="text-slate-300 text-lg max-w-md">
              Create an account today to start swapping premium styles across the country.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-slate-50 relative overflow-hidden order-1">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Join SwapStyle & build your sustainable wardrobe
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-bold border border-red-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 pl-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium shadow-sm hover:border-emerald-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 pl-1">
                India City (KYC Location)
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium shadow-sm hover:border-emerald-300 appearance-none"
                  required
                >
                  {indianCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium shadow-sm hover:border-emerald-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2 pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none transition-all text-sm font-medium shadow-sm hover:border-emerald-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm mt-6 group"
            >
              <span>{loading ? 'Creating Account...' : 'Create India Account'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 font-extrabold hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-bold bg-white py-3 rounded-xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>India Verified KYC & Secure Data</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
