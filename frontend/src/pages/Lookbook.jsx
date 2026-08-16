import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import apiClient from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Save, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Lookbook() {
  const { user } = useAuth();
  const [closetItems, setClosetItems] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchCloset = async () => {
      try {
        const res = await apiClient.get('/items/user/me');
        setClosetItems(res.data);
      } catch (error) {
        console.error("Failed to load closet items", error);
      }
    };
    fetchCloset();
  }, []);

  const handleDragStart = (e, item) => {
    // For HTML5 Drag and Drop into Canvas
    e.dataTransfer.setData('itemId', item._id);
    e.dataTransfer.setData('imageUrl', item.imageUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const imageUrl = e.dataTransfer.getData('imageUrl');
    
    if (itemId && imageUrl) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCanvasItems([
        ...canvasItems,
        {
          id: `${itemId}-${Date.now()}`,
          originalId: itemId,
          imageUrl,
          x: x - 50, // Center image roughly
          y: y - 50,
          scale: 1,
          zIndex: canvasItems.length + 1
        }
      ]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearCanvas = () => {
    setCanvasItems([]);
    toast.success('Canvas cleared!');
  };

  const bringToFront = (id) => {
    setCanvasItems(prev => {
      const maxZ = Math.max(...prev.map(i => i.zIndex), 0);
      return prev.map(item => 
        item.id === id ? { ...item, zIndex: maxZ + 1 } : item
      );
    });
  };

  return (
    <div className="py-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" /> The Lookbook
          </h1>
          <p className="text-slate-500">Drag items from your closet to build the perfect outfit.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearCanvas} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button onClick={() => toast.success('Outfit saved to your gallery!')} className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-colors shadow-lg shadow-purple-500/30">
            <Save className="w-4 h-4" /> Save Outfit
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 grow overflow-hidden">
        {/* Sidebar: Closet Items */}
        <div className="w-full md:w-1/4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 overflow-y-auto flex flex-col h-full">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Your Wardrobe
          </h3>
          
          {closetItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p>Your closet is empty.</p>
              <p className="text-sm mt-2">Add items to start styling!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-10">
              {closetItems.map(item => (
                <div 
                  key={item._id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="aspect-square bg-slate-50 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-purple-400 transition-colors"
                >
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="w-full md:w-3/4 bg-slate-50 rounded-3xl shadow-inner border border-slate-200 relative overflow-hidden h-full flex flex-col">
          <div 
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="grow relative w-full h-full"
            style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-400 font-bold text-xl uppercase tracking-widest opacity-50">Drag items here</p>
              </div>
            )}

            {canvasItems.map((item) => (
              <motion.div
                key={item.id}
                drag
                dragConstraints={canvasRef}
                dragElastic={0.1}
                dragMomentum={false}
                onDragStart={() => bringToFront(item.id)}
                whileTap={{ scale: 1.05 }}
                whileHover={{ scale: 1.02 }}
                initial={{ x: item.x, y: item.y, scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ zIndex: item.zIndex }}
                className="absolute w-40 h-40 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center group"
              >
                <div className="relative w-full h-full">
                  <img src={item.imageUrl} alt="Outfit item" className="w-full h-full object-contain drop-shadow-xl pointer-events-none" />
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => setCanvasItems(canvasItems.filter(i => i.id !== item.id))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
