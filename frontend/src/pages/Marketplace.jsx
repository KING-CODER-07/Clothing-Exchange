import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { Search, MapPin, Tag, Map, Grid, Filter, Star, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Marketplace() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', location: '', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser. Try Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFilters((prev) => ({ ...prev, search: transcript }));
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Voice search error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    fetchItems();
  }, [filters, page]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      
      // If in map mode, fetch more items to plot
      params.append('page', page);
      params.append('limit', viewMode === 'map' ? 50 : 8);

      const res = await apiClient.get(`/items?${params.toString()}`);
      
      // Handle the new paginated backend response structure
      if (res.data.items) {
        setItems(res.data.items);
        setTotalPages(res.data.totalPages);
      } else {
        // Fallback for older backend structure if needed
        setItems(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset page on filter change
  };

  // Helper to generate coordinates based on city name for location mapping
  // In a real app, this would be geocoded on the backend and saved with the item
  const getCoordinatesForCity = (cityName) => {
    if (!cityName) return [20.5937, 78.9629];
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
      hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Base coords around a central point (India)
    const lat = 20.5937 + ((hash % 100) / 10 - 5);
    const lng = 78.9629 + (((hash >> 5) % 100) / 10 - 5);
    return [lat, lng];
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-6"
    >
      <div className="flex flex-col mb-10 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 transition-colors duration-300">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace</h1>
          <div className="flex bg-slate-100 p-1 rounded-xl transition-colors">
            <button 
              onClick={() => { setViewMode('grid'); setPage(1); }}
              className={`p-2 rounded-lg flex items-center gap-2 font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Grid className="w-4 h-4" /> <span className="hidden sm:inline">Grid</span>
            </button>
            <button 
              onClick={() => { setViewMode('map'); setPage(1); }}
              className={`p-2 rounded-lg flex items-center gap-2 font-bold transition-all ${viewMode === 'map' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Map className="w-4 h-4" /> <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 w-full border-t border-slate-100 pt-4 transition-colors">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              name="search"
              placeholder="Search items..."
              value={filters.search}
              onChange={handleFilterChange}
              className="pl-11 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 w-full md:w-64 outline-none bg-slate-50 text-slate-900 font-medium transition-colors shadow-sm"
            />
            <button 
              onClick={startVoiceSearch}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`}
              title="Voice Search"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50 text-slate-900 font-medium transition-colors"
          >
            <option value="">All Categories</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Dresses">Dresses</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Accessories">Accessories</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50 text-slate-900 font-medium transition-colors"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
          <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                name="location"
                placeholder="City..."
                value={filters.location}
                onChange={handleFilterChange}
                className="pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 w-full md:w-48 outline-none bg-slate-50 text-slate-900 font-medium transition-colors"
              />
            </div>
            {user && user.location && (
              <button 
                onClick={() => setFilters({ ...filters, location: user.location })}
                className="px-4 py-3 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" /> Near Me
              </button>
            )}
          </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading premium pieces...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 transition-colors duration-300">
          <Tag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
          <p className="text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      ) : viewMode === 'map' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-[600px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative z-0 transition-colors duration-300"
        >
          <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {items.map(item => (
              <Marker key={item._id} position={getCoordinatesForCity(item.location)}>
                <Popup className="rounded-xl">
                  <div className="w-48">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">{item.location} • {item.size}</p>
                    <Link to={`/items/${item._id}`} className="block text-center py-1.5 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-sm hover:bg-emerald-200">
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {items.map(item => (
            <motion.div variants={itemAnim} key={item._id}>
              <Link to={`/items/${item._id}`} className={`group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border-2 ${item.isFeatured ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-slate-100'}`}>
                <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-slate-900 shadow-sm uppercase tracking-wider">
                    {item.size}
                  </div>
                  {item.isFeatured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-lg uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </div>
                  )}
                </div>
                <div className="p-6 relative">
                  {item.isFeatured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-400 rounded-full blur-xl opacity-30 z-0 pointer-events-none"></div>
                  )}
                  <h3 className="font-bold text-xl text-slate-900 mb-1 truncate relative z-10">{item.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 font-medium">{item.brand || 'Unbranded'}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-slate-600 font-medium gap-1"><MapPin className="h-4 w-4"/> {item.location}</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${item.suggestedValue === 'Premium' ? 'bg-purple-100 text-purple-700' :
                        item.suggestedValue === 'High' ? 'bg-blue-100 text-blue-700' :
                        item.suggestedValue === 'Medium' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                      {item.suggestedValue}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {!loading && items.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
