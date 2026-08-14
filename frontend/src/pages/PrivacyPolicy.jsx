import React from 'react';
import { Shield, Lock, FileText, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-medium text-sm mb-6 border border-emerald-100">
          <Shield className="w-4 h-4" /> Privacy First
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Policy</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Last updated: August 2026. We take your privacy seriously and are committed to protecting your personal data.
        </p>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 md:p-12 prose prose-slate max-w-none">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">1. Information We Collect</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          When you register for SwapStyle, we collect information that identifies you, such as your name, email address, physical address (for shipping), and communication preferences. We also collect data regarding the items you list, your swap history, and interactions on our platform to build a secure reputation score.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">2. How We Use Your Data</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          Your data is strictly used to facilitate the swapping of fashion items, provide customer support, and improve our AI styling recommendations. We do not sell your personal data to third-party advertisers. Shipping addresses are only shared with your verified swap partner once a swap is mutually accepted.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">3. Data Security & Retention</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          All data transmitted between your browser and our servers is encrypted using industry-standard TLS protocols. Passwords are cryptographically hashed using bcrypt. We retain your data as long as your account is active. You may request full deletion of your account and associated data at any time via your settings panel.
        </p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-12">
          <h4 className="font-bold text-slate-800 mb-2">Contacting the Privacy Team</h4>
          <p className="text-slate-600 text-sm m-0">
            If you have questions regarding this policy or wish to exercise your GDPR/CCPA data rights, please contact our Data Protection Officer at <a href="mailto:privacy@swapstyle.in" className="text-emerald-500 font-medium">privacy@swapstyle.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
