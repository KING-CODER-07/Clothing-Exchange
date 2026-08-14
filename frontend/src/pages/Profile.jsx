import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { User, MapPin, Camera, Save, Settings, Heart, UploadCloud, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [myItems, setMyItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', location: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Varanasi'
  ];

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, location: user.location });
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user's listings
      const itemsRes = await axios.get('http://localhost:5000/api/items/user/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyItems(itemsRes.data);

      // Fetch wishlist items
      if (user.wishlist && user.wishlist.length > 0) {
        // We'll fetch items one by one for simplicity if there's no bulk endpoint
        const wItems = await Promise.all(user.wishlist.map(id => 
          axios.get(`http://localhost:5000/api/items/${id}`).then(res => res.data).catch(() => null)
        ));
        setWishlistItems(wItems.filter(Boolean));
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
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

  const handleSaveProfile = async () => {
    try {
      let finalAvatarUrl = user.avatarUrl;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        finalAvatarUrl = `http://localhost:5000${uploadRes.data.imageUrl}`;
      }

      const res = await axios.put('http://localhost:5000/api/auth/profile', {
        name: editForm.name,
        location: editForm.location,
        avatarUrl: finalAvatarUrl
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setUser(res.data);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) return <div className="text-center py-20">Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-8"
    >
      {/* Profile Header Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/50 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/40 to-blue-100/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-700 transition-colors">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-2xl font-bold outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <MapPin className="text-slate-400" />
                  <select 
                    value={editForm.location} 
                    onChange={e => setEditForm({...editForm, location: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 font-semibold text-sm"
                  >
                    <option value="">Select an Indian city</option>
                    {indianCities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-700">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => { setIsEditing(false); setImagePreview(null); setImageFile(null); }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-300">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-black text-slate-900 mb-2">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500" /> {user.location}</span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{user.role}</span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <Settings className="w-5 h-5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-4 px-4 font-bold text-lg transition-colors border-b-2 ${activeTab === 'listings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          My Listings ({myItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          className={`pb-4 px-4 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'wishlist' ? 'border-pink-500 text-pink-500' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <Heart className="w-5 h-5" /> Saved Items ({wishlistItems.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 text-slate-500">
              Loading...
            </motion.div>
          ) : activeTab === 'listings' ? (
            <motion.div 
              key="listings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {myItems.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No listings yet</h3>
                  <p className="text-slate-500 mb-6">Start clearing out your closet today!</p>
                  <Link to="/add-listing" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
                    Add a Listing
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {myItems.map(item => (
                    <Link to={`/items/${item._id}`} key={item._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="aspect-square bg-slate-50 relative overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase">{item.status}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.brand || 'Unbranded'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100">
                  <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-slate-500 mb-6">Find items you love in the marketplace and save them for later.</p>
                  <Link to="/marketplace" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30">
                    Explore Marketplace
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlistItems.map(item => (
                    <Link to={`/items/${item._id}`} key={item._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="aspect-square bg-slate-50 relative overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-pink-100 text-pink-600 p-2 rounded-full"><Heart className="w-4 h-4 fill-current" /></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.brand || 'Unbranded'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
