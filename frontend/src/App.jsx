import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import AIStylistModal from './components/AIStylistModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Marketplace from './pages/Marketplace';
import ItemDetail from './pages/ItemDetail';
import SwapRequests from './pages/SwapRequests';
import Leaderboard from './pages/Leaderboard';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookieSettings from './pages/CookieSettings';
import NotFound from './pages/NotFound';
import Lookbook from './pages/Lookbook';
import WeavesEncyclopedia from './pages/WeavesEncyclopedia';
import ImpactDashboard from './pages/ImpactDashboard';
import Spinner from './components/Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const [isStylistOpen, setIsStylistOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 flex flex-col overflow-x-hidden relative">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 relative flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookieSettings />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/weaves" element={<WeavesEncyclopedia />} />
            <Route path="/encyclopedia" element={<WeavesEncyclopedia />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/lookbook" element={<ProtectedRoute><Lookbook /></ProtectedRoute>} />
            <Route path="/impact" element={<ProtectedRoute><ImpactDashboard /></ProtectedRoute>} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
            <Route path="/edit-listing/:id" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
            <Route path="/swap-requests" element={<ProtectedRoute><SwapRequests /></ProtectedRoute>} />
            <Route path="/chat/:swapRequestId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      
      {/* Floating AI Studio & Eco-Calculator Button */}
      <button
        onClick={() => setIsStylistOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2 group transition-all transform hover:scale-105 border border-white/20"
        title="SwapStyle India AI Studio & Circular Impact Calculator"
      >
        <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
        <span className="font-extrabold text-sm hidden md:inline pr-2">🇮🇳 AI Studio & Eco-Score</span>
      </button>

      {/* AI Stylist Modal */}
      <AIStylistModal isOpen={isStylistOpen} onClose={() => setIsStylistOpen(false)} />

      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            padding: '16px 24px',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <AppRoutes />
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
