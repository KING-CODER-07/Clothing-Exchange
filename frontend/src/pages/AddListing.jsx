import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UploadCloud, Calculator, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    size: '',
    condition: 'Good',
    category: 'Tops',
    location: '',
    imageUrl: '',
    suggestedValue: 'Medium'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Max size is 5MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagicFill = async () => {
    setAiLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', {
        imageUrl: formData.imageUrl || (imagePreview ? 'local_file' : ''),
        category: formData.category
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const { title, description, brand, suggestedValue } = res.data.data;
      
      setFormData(prev => ({
        ...prev,
        title,
        description,
        brand,
        suggestedValue
      }));
      
      toast.success('Magic Auto-Fill complete! ✨');
    } catch (err) {
      toast.error('Failed to generate magic details.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        
        finalImageUrl = `http://localhost:5000${uploadRes.data.imageUrl}`;
      } else if (!finalImageUrl) {
        finalImageUrl = `https://source.unsplash.com/400x500/?clothing,${formData.category.toLowerCase()}`;
      }

      await axios.post('http://localhost:5000/api/items', { ...formData, imageUrl: finalImageUrl }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Listing added successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to add listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8"
    >
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">List an Item</h1>
            <p className="text-slate-500">Add details about the clothing you want to swap.</p>
          </div>
          <button 
            type="button"
            onClick={handleMagicFill}
            disabled={aiLoading}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white transition-all shadow-lg ${aiLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105'}`}
          >
            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {aiLoading ? 'Analyzing...' : 'Magic Auto-Fill'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the item, any flaws, history, etc."
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Enter size"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="New with tags">New with tags</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Value Tier</label>
              <div className="flex gap-2">
                <select
                  name="suggestedValue"
                  value={formData.suggestedValue}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="Low">Low (Basic items)</option>
                  <option value="Medium">Medium (Standard brands)</option>
                  <option value="High">High (Designer/Vintage)</option>
                  <option value="Premium">Premium (Luxury)</option>
                </select>
                <button 
                  type="button" 
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await axios.post('http://localhost:5000/api/items/calculate-value', {
                        brand: formData.brand,
                        condition: formData.condition,
                        category: formData.category
                      }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      });
                      setFormData({ ...formData, suggestedValue: res.data.suggestedValue });
                      toast.success('Value calculated successfully!');
                    } catch (error) {
                      toast.error('Failed to calculate value');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-blue-100 text-blue-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap hover:bg-blue-200 transition-colors"
                >
                  <UploadCloud className="h-5 w-5 hidden" /> Auto Calculate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Location (City in India)</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                required
              >
                <option value="" disabled>Select a city</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Surat">Surat</option>
                <option value="Pune">Pune</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Indore">Indore</option>
                <option value="Thane">Thane</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Patna">Patna</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Ludhiana">Ludhiana</option>
                <option value="Agra">Agra</option>
                <option value="Nashik">Nashik</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Faridabad">Faridabad</option>
                <option value="Meerut">Meerut</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Kalyan-Dombivli">Kalyan-Dombivli</option>
                <option value="Vasai-Virar">Vasai-Virar</option>
                <option value="Varanasi">Varanasi</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Product Image (Optional)</label>
              
              <div className="flex flex-col items-center justify-center w-full">
                {imagePreview ? (
                  <div className="relative w-full mb-4">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl border border-slate-200" />
                    <button 
                      type="button" 
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="mb-2 text-sm text-slate-500 font-bold">Click to upload an image</p>
                      <p className="text-xs text-slate-500">PNG, JPG, WEBP (Max 5MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Or Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste an image URL here..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  disabled={imageFile !== null}
                />
                <p className="text-xs text-slate-500 mt-2">Leave blank to use a random placeholder image based on category.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30 hover:-translate-y-1'}`}
            >
              {loading ? 'Adding Listing...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
