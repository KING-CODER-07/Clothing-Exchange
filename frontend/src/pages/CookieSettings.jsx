import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CookieSettings() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    personalization: false,
    marketing: false
  });

  const handleToggle = (key) => {
    if (key === 'essential') return; // Cannot toggle essential cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Cookie preferences updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-sm mb-6 border border-slate-200">
          <Cookie className="w-4 h-4" /> Privacy Controls
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">Settings</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Manage how we use cookies to personalize your experience. We respect your choices.
        </p>
      </motion.div>

      <div className="space-y-6">
        
        {/* Essential */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex items-start gap-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-500" /> Essential Cookies
              </h3>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">Always On</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              These cookies are required for the platform to function properly, including secure login, session management, and CSRF protection. They cannot be disabled.
            </p>
          </div>
        </div>

        {/* Analytics */}
        <div className={`bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex items-start gap-6 relative overflow-hidden transition-colors ${preferences.analytics ? 'border-emerald-200' : 'border-slate-200'}`}>
          {preferences.analytics && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900">Analytics & Performance</h3>
              <button 
                onClick={() => handleToggle('analytics')}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${preferences.analytics ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute transition-transform ${preferences.analytics ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Helps us understand how visitors interact with SwapStyle by collecting and reporting information anonymously. Used to improve the platform.
            </p>
          </div>
        </div>

        {/* Personalization */}
        <div className={`bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex items-start gap-6 relative overflow-hidden transition-colors ${preferences.personalization ? 'border-blue-200' : 'border-slate-200'}`}>
          {preferences.personalization && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900">AI Personalization</h3>
              <button 
                onClick={() => handleToggle('personalization')}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${preferences.personalization ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute transition-transform ${preferences.personalization ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Allows our AI Stylist to remember your sizing preferences, favored Indian weaves, and provide highly tailored swap recommendations.
            </p>
          </div>
        </div>

      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xl shadow-slate-900/20"
        >
          <Settings2 className="w-5 h-5" /> Save Preferences
        </button>
      </div>
    </div>
  );
}
