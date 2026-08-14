import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: "How does SwapStyle ensure the quality of premium items?",
    answer: "Every premium item listed on SwapStyle undergoes a rigorous community-driven and AI-assisted verification process. High-resolution images are scanned for brand authenticity, and our peer-review system ensures conditions match the description."
  },
  {
    question: "Is there a fee for swapping clothes?",
    answer: "Swapping is completely free for standard users. We only charge a small nominal fee for direct purchases or when utilizing our premium escrow logistics service to guarantee secure delivery for extremely high-value designer items."
  },
  {
    question: "How do I earn Eco Points?",
    answer: "Eco Points are awarded every time you successfully complete a swap, recycle an item through our partners, or invite a friend to join the sustainable fashion movement. Accumulate points to unlock badges and exclusive platform features!"
  },
  {
    question: "What if I receive an item that doesn't match the description?",
    answer: "We have a robust dispute resolution system. If an item arrives significantly not as described, simply open a dispute within 48 hours of delivery. Our admin team will mediate and reverse the swap or issue compensation if necessary."
  },
  {
    question: "Can I sell items instead of swapping?",
    answer: "Currently, our primary focus is on circular fashion through swapping. However, users can attach a 'Suggested Value' to items, and future updates will include a direct-buy feature utilizing secure wallet transactions."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-medium text-sm mb-6 border border-emerald-100">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">help you?</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Everything you need to know about swapping, sustainability, and joining India's premier fashion exchange community.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <button
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:bg-slate-50 transition-colors hover:bg-slate-50/50"
            >
              <span className="font-bold text-slate-800 text-lg pr-8">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-300 flex-shrink-0 ${activeIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-6 overflow-hidden"
                >
                  <p className="pb-6 text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-4 relative z-10" />
        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Still have questions?</h3>
        <p className="text-slate-300 mb-6 relative z-10">Our support team is here to assist you on your sustainable fashion journey.</p>
        <button className="relative z-10 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/30">
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}
