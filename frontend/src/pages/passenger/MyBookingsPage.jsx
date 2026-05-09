import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, X, Clock, ChevronRight } from 'lucide-react';
import { getUserBookings, cancelBooking } from '../../api/bookings.api';
import toast from 'react-hot-toast';
import myBookingsBg from '../../assets/profile_history_background.png';

const MOCK = [
  {
    id: 1, trainName: 'RAIL OF THE NILE – ALEXANDRIA EXPRESS',
    from: 'Cairo (RAMSES)', to: 'Alexandria (SIDI GABER)',
    date: 'Mon, Nov 18, 2024', time: '08:00 AM – 10:30 AM',
    status: 'Upcoming', color: '#f59e0b',
  },
  {
    id: 2, trainName: 'LUXOR ODYSSEY – SLEEPER TRAIN',
    from: 'Aswan', to: 'Luxor',
    date: 'Fri, Oct 25, 2024', time: '09:00 PM – 06:00 AM',
    status: 'Completed', color: '#4ade80',
  },
  {
    id: 3, trainName: 'RED SEA EXPLORER – HURGHADA LINK',
    from: 'Cairo', to: 'Hurghada',
    date: 'Sun, Sep 29, 2024', time: '11:00 AM – 03:30 PM',
    status: 'Cancelled', color: '#ef4444',
  },
  {
    id: 4, trainName: 'NILE DELTA COMMUTER',
    from: 'Cairo', to: 'Damietta',
    date: 'Mon, Dec 2, 2024', time: '07:00 AM – 11:00 AM',
    status: 'Upcoming', color: '#f59e0b',
  },
];

const STATUS_COLORS = {
  Upcoming:  { text:'#f59e0b', bg:'rgba(245,158,11,0.10)', border:'rgba(245,158,11,0.30)', dot:'bg-[#f59e0b]' },
  Completed: { text:'#4ade80', bg:'rgba(74,222,128,0.10)', border:'rgba(74,222,128,0.30)', dot:'bg-[#4ade80]' },
  Cancelled: { text:'#ef4444', bg:'rgba(239,68,68,0.10)',  border:'rgba(239,68,68,0.30)',  dot:'bg-red-500' },
};

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export function MyBookingsPage() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState('All');
  const [bookings, setBookings] = useState(MOCK);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserBookings().then(r => {
      if (r.data?.length) setBookings(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'All' ? bookings : bookings.filter(b => b.status === tab);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await cancelBooking(id).catch(() => {});
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status:'Cancelled' } : b));
    toast.success('Booking cancelled');
  };

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={myBookingsBg} alt="" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(180deg,rgba(7,11,20,0.70) 0%,rgba(7,11,20,0.92) 100%)' }} />
        {/* Left glow */}
        <div className="absolute top-1/3 -left-24 w-96 h-96 rounded-full opacity-50"
          style={{ background:'radial-gradient(circle,rgba(0,229,255,0.4) 0%,transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.h1
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          className="text-3xl font-black text-white text-center mb-8"
        >
          My Bookings History
        </motion.h1>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={tab === t ? {
                background:'rgba(0,229,255,0.12)',
                border:'1px solid rgba(0,229,255,0.4)',
                color:'#00e5ff',
                boxShadow:'0 0 12px rgba(0,229,255,0.2)',
              } : {
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.08)',
                color:'#4a6080',
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Booking cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((b, i) => {
              const sc = STATUS_COLORS[b.status];
              return (
                <motion.div key={b.id}
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{   opacity:0, scale:0.95 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-hover cursor-pointer rounded-2xl overflow-hidden"
                  style={{
                    background:'rgba(10,18,35,0.80)',
                    backdropFilter:'blur(20px)',
                    border:`1px solid ${sc.border}`,
                  }}
                >
                  {/* Status stripe */}
                  <div className="flex  items-center gap-2 px-5 py-2 border-b border-white/5"
                    style={{ background: sc.bg }}>
                    <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: sc.text }}>
                      {b.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-white font-black text-sm mb-1">{b.trainName}</h3>
                    <p className="text-slate-400 text-sm mb-1">
                      {b.from} → {b.to}
                    </p>
                    <p className="text-slate-500 text-xs flex items-center gap-1.5 mb-4">
                      <Clock className="w-3 h-3" />
                      {b.date} • {b.time}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/bookings/${b.id}`)}
                        className="btn-cyan px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      {b.status === 'Upcoming' && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all"
                          style={{
                            background:'rgba(239,68,68,0.06)',
                            border:'1px solid rgba(239,68,68,0.25)',
                            color:'#f87171',
                          }}>
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-600">
              <div className="text-4xl mb-3">🎫</div>
              <div className="text-sm">No {tab.toLowerCase()} bookings</div>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div className="text-center mt-12 flex items-center justify-center gap-6 text-xs text-slate-600">
          {['Home','Upcoming','Completed','Privacy','Contact'].map(l => (
            <span key={l} className="hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-700 mt-2">© Copyright All rights reserved.</p>
      </div>
    </div>
  );
}
