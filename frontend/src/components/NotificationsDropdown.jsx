import React, { useState, useEffect } from 'react';
import { Bell, Check, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.id) {
      // Fetch initial notifications
      fetchNotifications();

      // Connect socket
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        newSocket.emit('joinUserRoom', user.id);
      });

      newSocket.on('notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        toast(newNotif.message, {
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark read');
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-emerald-500 transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  You have no notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`p-4 transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-emerald-50/50' : ''}`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="mt-1">
                          {!notif.read ? (
                            <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                          ) : (
                            <div className="w-2.5 h-2.5"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">{notif.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="flex gap-3">
                              {notif.link && (
                                <Link 
                                  to={notif.link} 
                                  onClick={() => setIsOpen(false)}
                                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                  View
                                </Link>
                              )}
                              {!notif.read && (
                                <button 
                                  onClick={() => markAsRead(notif._id)}
                                  className="text-[11px] font-bold text-slate-500 hover:text-slate-700"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
