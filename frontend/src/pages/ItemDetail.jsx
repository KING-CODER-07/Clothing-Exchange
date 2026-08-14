import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, ArrowLeft, RefreshCw, Heart, Star, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Spinner from '../components/Spinner';
import VirtualTryOnModal from '../components/VirtualTryOnModal';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [sellerRating, setSellerRating] = useState({ avgRating: 0, totalReviews: 0 });
  const [coordinates, setCoordinates] = useState(null);
  const [showTryOnModal, setShowTryOnModal] = useState(false);

  useEffect(() => {
    if (item && item.location) {
      // Geocode the location string using OpenStreetMap Nominatim restricted to India
      const geocode = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.location)}&countrycodes=in&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (e) {
          console.error('Geocoding failed', e);
        }
      };
      geocode();
    }
  }, [item?.location]);

  useEffect(() => {
    fetchItem();
    if (user) {
      fetchMyItems();
    }
  }, [id, user]);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/items/${id}`);
      setItem(res.data);
      
      // Fetch seller rating
      if (res.data.ownerId && res.data.ownerId._id) {
        const reviewRes = await axios.get(`http://localhost:5000/api/reviews/user/${res.data.ownerId._id}`);
        setSellerRating({ avgRating: reviewRes.data.avgRating, totalReviews: reviewRes.data.totalReviews });
      }
    } catch (err) {
      setError('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items/user/me');
      setMyItems(res.data.filter(i => i.status === 'Available'));
    } catch (err) {
      console.error('Failed to load your items');
    }
  };

  const handleRequestSwap = async () => {
    if (!selectedOfferId) return toast.error('Please select an item to offer');
    try {
      await axios.post('http://localhost:5000/api/swaps', {
        requestedItemId: item._id,
        offeredItemId: selectedOfferId
      });
      toast.success('Swap request sent successfully!');
      setShowSwapModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send swap request');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/wishlist/${item._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // The API returns the new wishlist, update the local context user
      // Assuming useAuth now exposes setUser (which we added!)
      // Wait, setUser is destructured from useAuth(). Let's make sure it's available.
      // We will destruct it from useAuth above.
      // I'll modify the destructuring above if needed.
      toast.success(res.data.wishlist.includes(item._id) ? 'Added to wishlist!' : 'Removed from wishlist!');
      window.location.reload(); // Simple reload to reflect changes, though setUser is better
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return <Spinner />;
  if (error || !item) return <div className="text-center py-20 text-red-600">{error || 'Item not found'}</div>;

  const isOwner = user && user.id === item.ownerId._id;
  const isWishlisted = user && user.wishlist && user.wishlist.includes(item._id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8"
    >
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 h-[500px]">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{item.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold inline-block
                  ${item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                  {item.status}
                </span>
                <span className="flex items-center text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  {sellerRating.avgRating > 0 ? `${sellerRating.avgRating} (${sellerRating.totalReviews} reviews)` : 'No reviews'}
                </span>
              </div>
            </div>
            {!isOwner && (
              <button 
                onClick={handleToggleWishlist}
                className={`p-3 rounded-full transition-colors ${isWishlisted ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' : 'bg-slate-100 text-slate-400 hover:bg-pink-50 hover:text-pink-500'}`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
          
          <p className="text-xl text-slate-500 mb-6">{item.brand || 'Unbranded'}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-sm text-slate-500 mb-1">Size</span>
              <span className="font-bold text-slate-900">{item.size}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-sm text-slate-500 mb-1">Condition</span>
              <span className="font-bold text-slate-900">{item.condition}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-sm text-slate-500 mb-1">Category</span>
              <span className="font-bold text-slate-900">{item.category}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-sm text-slate-500 mb-1">Value Tier</span>
              <span className="font-bold text-primary-600">{item.suggestedValue}</span>
            </div>
          </div>

          <div className="mb-8 flex-grow">
            <h3 className="font-bold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>

          <div className="flex items-center text-slate-600 mb-4 border-t border-slate-100 pt-4">
            <MapPin className="h-5 w-5 mr-2 text-primary-500" /> 
            <span>Located in <strong>{item.location}</strong></span>
          </div>

          {coordinates && (
            <div className="mb-8 w-full h-48 rounded-xl overflow-hidden border border-slate-200 z-0">
              <MapContainer center={coordinates} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={coordinates}>
                  <Popup>
                    Approximate location in {item.location}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto">
            {!user ? (
              <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                Log in to Request Swap
              </button>
            ) : isOwner ? (
              <p className="text-center text-slate-500 bg-slate-50 py-4 rounded-xl">This is your item</p>
            ) : item.status === 'Available' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowTryOnModal(true)}
                  className="flex-1 py-4 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25"
                >
                  <Eye className="h-5 w-5" /> ✨ AI Virtual Try-On
                </button>
                <button 
                  onClick={() => setShowSwapModal(true)}
                  className="flex-1 py-4 flex justify-center items-center gap-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                >
                  <RefreshCw className="h-5 w-5" /> Request Swap
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Propose a Swap</h3>
            <p className="text-slate-500 mb-6">Select an item from your closet to offer in exchange for <strong>{item.title}</strong>.</p>
            
            {myItems.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl mb-6">
                <p className="text-slate-600 mb-4">You don't have any items available to swap.</p>
                <button onClick={() => navigate('/add-listing')} className="text-primary-600 font-bold hover:underline">Add an item first</button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                  {myItems.map(myItem => (
                    <label key={myItem._id} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${selectedOfferId === myItem._id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-primary-300'}`}>
                      <input 
                        type="radio" 
                        name="offerItem" 
                        value={myItem._id}
                        checked={selectedOfferId === myItem._id}
                        onChange={(e) => setSelectedOfferId(e.target.value)}
                        className="hidden"
                      />
                      <img src={myItem.imageUrl} className="w-12 h-12 rounded-lg object-cover mr-4 border border-slate-200" alt="" />
                      <div>
                        <h4 className="font-bold text-slate-900">{myItem.title}</h4>
                        <p className="text-xs text-slate-500">{myItem.brand} • {myItem.suggestedValue} Tier</p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedOfferId && (() => {
                  const valMap = { Low: 1, Medium: 2, High: 3, Premium: 4 };
                  const selectedItem = myItems.find(i => i._id === selectedOfferId);
                  const myVal = valMap[selectedItem.suggestedValue] || 1;
                  const theirVal = valMap[item.suggestedValue] || 1;
                  const diff = myVal - theirVal;
                  
                  if (diff === 0) return <div className="text-sm font-bold text-green-600 bg-green-50 p-3 rounded-lg mb-6 flex justify-between"><span>Fair Trade!</span> <span>Same Value Tier</span></div>;
                  if (diff > 0) return <div className="text-sm font-bold text-yellow-600 bg-yellow-50 p-3 rounded-lg mb-6 flex justify-between"><span>Generous Offer!</span> <span>You are offering a higher tier item.</span></div>;
                  if (diff < 0) return <div className="text-sm font-bold text-red-600 bg-red-50 p-3 rounded-lg mb-6 flex justify-between"><span>Lowball Offer?</span> <span>You are offering a lower tier item.</span></div>;
                })()}
              </>
            )}
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSwapModal(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleRequestSwap}
                disabled={!selectedOfferId}
                className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors ${selectedOfferId ? 'bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/30' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={showTryOnModal}
        onClose={() => setShowTryOnModal(false)}
        item={item}
        onProceedSwap={() => setShowSwapModal(true)}
      />
    </motion.div>
  );
}
