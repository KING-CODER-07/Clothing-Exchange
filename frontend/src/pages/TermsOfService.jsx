import React from 'react';
import { Scale, FileWarning, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-sm mb-6 border border-slate-200">
          <Scale className="w-4 h-4" /> Legal Agreement
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">Service</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Please read these terms carefully before using the SwapStyle platform.
        </p>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 md:p-12 prose prose-slate max-w-none">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">Acceptance of Terms</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          By accessing or using SwapStyle (the "Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Platform.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">User Responsibilities</h2>
        </div>
        <ul className="text-slate-600 leading-relaxed mb-8 space-y-2 list-none p-0">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
            <span>You must be at least 18 years old to use this platform.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
            <span>You guarantee that you are the legal owner of any items you list for swapping.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
            <span>Items must be accurately described; listing counterfeit goods is strictly prohibited and will result in a permanent ban.</span>
          </li>
        </ul>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">Dispute Resolution</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          In the event of a dispute between swappers (e.g., item not received, item not as described), SwapStyle acts as a neutral mediator. Our decisions regarding account penalties or reversed transactions are final. We highly recommend using tracked shipping for all exchanges.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">4</div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">Limitation of Liability</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          SwapStyle operates as a peer-to-peer marketplace. We do not take ownership of the items exchanged. Therefore, we are not liable for any damages, loss of items during transit, or dissatisfaction with a swapped item, beyond the scope of our dispute mediation policies.
        </p>

        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start">
          <FileWarning className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Changes to Terms</h4>
            <p className="text-amber-800 text-sm m-0 leading-relaxed">
              We reserve the right to modify these terms at any time. We will always notify active users of significant changes via email or platform notification. Continued use of the platform constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
