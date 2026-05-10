import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Clock } from 'lucide-react';
import { cancelBooking, getMyBookingHistory } from '../../api/bookings.api';
import toast from 'react-hot-toast';
import { PageBackground } from '../../components/ui/PageBackground';
import myBookingsBg from '../../assets/profile_history_background.png';

const STATUS_COLORS = {
  Upcoming:  { text:'#f59e0b', bg:'rgba(245,158,11,0.10)', border:'rgba(245,158,11,0.30)', dot:'bg-[#f59e0b]' },
  Completed: { text:'#4ade80', bg:'rgba(74,222,128,0.10)', border:'rgba(74,222,128,0.30)', dot:'bg-[#4ade80]' },
  Cancelled: { text:'#ef4444', bg:'rgba(239,68,68,0.10)',  border:'rgba(239,68,68,0.30)',  dot:'bg-red-500' },
};

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

/** Maps payment_status from API → display status */
function deriveStatus(paymentStatus) {
  if (!paymentStatus) return 'Upcoming';
  const s = paymentStatus.toLowerCase();
  if (s === 'paid')      return 'Completed';
  if (s === 'cancelled' || s === 'canceled' || s === 'refunded') return 'Cancelled';
  return 'Upcoming'; // pending, unpaid, etc.
}

/** Formats an ISO datetime string → "Mon, Nov 18, 2024" */
function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

/** Formats two ISO datetime strings → "08:00 AM – 10:30 AM" */
function formatTimeRange(dep, arr) {
  const fmt = dt =>
    dt ? new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';
  return `${fmt(dep)} – ${fmt(arr)}`;
}

export function MyBookingsPage() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyBookingHistory()
      .then(r => {
        const data = r?.data?.bookingHistory ?? [];
        console.log({data})
        setBookings(data);
      })
      .catch(e => {
        if (e?.response?.status !== 404) {
          toast.error('Failed to load bookings.');
        }
        console.error({ message: 'error fetching bookings', error: e });
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings
    .map(b => ({ ...b, _status: deriveStatus(b.payment_status) }))
    .filter(b => tab === 'All' || b._status === tab);

  const handleCancel = async (bookingId) => {
    // if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      setBookings(prev =>
        prev.map(b =>
          b.booking_id === bookingId ? { ...b, payment_status: 'cancelled' } : b
        )
      );
      toast.success('Booking cancelled');
    } catch(error) {
      toast.error('Could not cancel booking. Please try again.');
      console.error({ error });
      
    }
  };

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <PageBackground src={myBookingsBg} opacity={0.9} fixed />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
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
                background: 'rgba(0,229,255,0.12)',
                border: '1px solid rgba(0,229,255,0.4)',
                color: '#00e5ff',
                boxShadow: '0 0 12px rgba(0,229,255,0.2)',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#4a6080',
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16 text-slate-500 text-sm animate-pulse">
            Loading your bookings…
          </div>
        )}

        {/* Booking cards */}
        {!loading && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((b, i) => {
                const sc = STATUS_COLORS[b._status];
                const dateLabel = formatDate(b.departure_date_time);
                const timeLabel = formatTimeRange(b.departure_date_time, b.arrival_date_time);

                return (
                  <motion.div key={b.booking_id ?? i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-hover cursor-pointer rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgba(10,18,35,0.80)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {/* Status stripe */}
                    <div className="flex items-center gap-2 px-5 py-2 border-b border-white/5"
                      style={{ background: sc.bg }}>
                      <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: sc.text }}>
                        {b._status}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3 className="text-white font-black text-sm mb-1">
                        {b.route_name ?? 'Unknown Route'}
                      </h3>
                      <p className="text-slate-400 text-sm mb-1">
                        {b.origin ?? '—'} → {b.destination ?? '—'}
                      </p>
                      <p className="text-slate-500 text-xs flex items-center gap-1.5 mb-4">
                        <Clock className="w-3 h-3" />
                        {dateLabel} • {timeLabel}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/my-bookings/${b.booking_id}`)}
                          className="btn-cyan px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                        {b._status === 'Upcoming' && (
                          <button
                            onClick={() => handleCancel(b.booking_id)}
                            className="px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all"
                            style={{
                              background: 'rgba(239,68,68,0.06)',
                              border: '1px solid rgba(239,68,68,0.25)',
                              color: '#f87171',
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
        )}

        {/* Footer */}
        <div className="text-center mt-12 flex items-center justify-center gap-6 text-xs text-slate-600">
          {['Home', 'Upcoming', 'Completed', 'Privacy', 'Contact'].map(l => (
            <span key={l} className="hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-700 mt-2">© Copyright All rights reserved.</p>
      </div>
    </div>
  );
}