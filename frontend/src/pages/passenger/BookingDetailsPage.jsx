import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { getBookingById } from '../../api/bookings.api';
import { useState, useEffect } from 'react';
import { PageBackground } from '../../components/ui/PageBackground';
import ticketBg from '../../assets/profile_history_background.png';

// Simple QR-like grid pattern (SVG) — stable per booking id
function QRCode({ seed = 42 }) {
  const cells = Array.from({ length: 64 }, (_, i) => ((seed * (i + 1) * 2654435761) >>> 0) % 2 === 0);
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <rect width="80" height="80" fill="#fff" />
      {cells.map((on, i) =>
        on && (
          <rect
            key={i}
            x={(i % 8) * 10}
            y={Math.floor(i / 8) * 10}
            width="10"
            height="10"
            fill="#0a0e1a"
          />
        )
      )}
      {[[0, 0], [60, 0], [0, 60]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={20} height={20} fill="#0a0e1a" />
          <rect x={x + 3} y={y + 3} width={14} height={14} fill="#fff" />
          <rect x={x + 6} y={y + 6} width={8} height={8} fill="#0a0e1a" />
        </g>
      ))}
    </svg>
  );
}

/** Format an ISO datetime string → "01 AUG 2025" */
function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

/** Format an ISO datetime string → "03:00" */
function formatTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Map API payload → normalised ticket shape */
function normaliseBooking(b) {
  return {
    id:        b.booking_id ?? '—',
    trainName: b.route_name  ?? 'NILELUX RAIL',
    from:      b.origin      ?? '—',
    to:        b.destination ?? '—',
    date:      formatDate(b.departure_date_time),
    time:      formatTime(b.departure_date_time),
    arrival:   formatTime(b.arrival_date_time),
    passenger: b.full_name   ?? '—',
    amount:    b.total_amount != null ? `EGP ${Number(b.total_amount).toFixed(2)}` : null,
    status:    b.payment_status ?? null,
  };
}

const STATUS_STYLES = {
  confirmed: { color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.30)' },
  cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.30)' },
  pending:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.30)'  },
};

function StatusBadge({ status }) {
  if (!status) return null;
  const style = STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.pending;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
    >
      {status}
    </span>
  );
}

export function BookingDetailsPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [ticket,  setTicket]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    getBookingById(id)
      .then(r => {
        const b = r.data?.booking ?? r.data;
        if (!b) throw new Error('Booking not found');
        setTicket(normaliseBooking(b));
      })
      .catch(err => {
        console.error(err);
        setError(err.message ?? 'Failed to load booking');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <PageBackground src={ticketBg} opacity={0.85} fixed />
      {/* Background */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <img src={ticketBg} alt="" className="w-full h-full object-cover opacity-100" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom,rgba(7,11,20,0.80) 0%,rgba(7,11,20,0.20) 100%)' }}
        />
      </div> */}
      <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </button>

        {/* Loading */}
        {loading && (
          <div className="text-center text-slate-400 py-20">Loading ticket…</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-400 py-20">{error}</div>
        )}

        {/* Ticket Card */}
        {!loading && !error && ticket && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg,rgba(15,25,45,0.95) 0%,rgba(8,14,28,0.98) 100%)',
                border: '1px solid rgba(0,229,255,0.15)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,229,255,0.05)',
              }}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center border-b border-dashed border-[rgba(255,255,255,0.10)]">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle,rgba(245,158,11,0.15) 0%,transparent 70%)',
                      border: '1px solid rgba(245,158,11,0.25)',
                    }}
                  >
                    <span className="text-2xl">𓂀</span>
                  </div>
                  <div>
                    <div className="text-white font-black text-xl tracking-[0.2em]">
                      {ticket.trainName}
                    </div>
                    <div className="text-[#f59e0b] text-[10px] uppercase tracking-[0.3em] font-bold">
                      Official Ticket
                    </div>
                  </div>
                </div>
                {ticket.status && (
                  <div className="mt-2">
                    <StatusBadge status={ticket.status} />
                  </div>
                )}
              </div>

              {/* Tear-line */}
              <div className="relative h-5 flex items-center">
                <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#070b14]" />
                <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#070b14]" />
                <div className="w-full border-t-2 border-dashed border-[rgba(255,255,255,0.08)]" />
                <div className="absolute left-1/2 -translate-x-1/2 text-slate-700 text-[10px] tracking-widest">
                  ✂ TEAR TO VALIDATE
                </div>
              </div>

              {/* Journey details */}
              <div className="px-8 py-6">
                <div className="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest mb-3">
                  Journey
                </div>

                {/* Route */}
                <div className="text-white font-semibold text-sm mb-4">
                  {ticket.from} → {ticket.to}
                </div>

                {/* Date / Departure / Arrival */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Date</div>
                    <div className="text-white text-sm font-semibold">{ticket.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Departs</div>
                    <div className="text-white text-sm font-semibold">{ticket.time}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Arrives</div>
                    <div className="text-white text-sm font-semibold">{ticket.arrival}</div>
                  </div>
                </div>

                {/* Passenger */}
                <div className="mb-4">
                  <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Passenger</div>
                  <div className="text-white text-sm font-semibold">{ticket.passenger}</div>
                </div>

                {/* Booking ID */}
                <div className="mb-4">
                  <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Booking ID</div>
                  <div className="text-[#f59e0b] text-sm font-mono font-bold">#{ticket.id}</div>
                </div>

                {/* Amount */}
                {ticket.amount && (
                  <div className="mb-4">
                    <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Total Paid</div>
                    <div className="text-white text-sm font-semibold">{ticket.amount}</div>
                  </div>
                )}

                {/* QR */}
                <div className="flex gap-4 items-center mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex-1 text-slate-500 text-xs italic">
                    Present this QR code at the gate
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.10)]">
                    <QRCode seed={ticket.id} />
                  </div>
                </div>
                <div className="text-slate-700 text-[10px] text-right mt-1 tracking-widest">
                  SCAN FOR ENTRY
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 mt-5"
            >
              <button
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(245,158,11,0.10)',
                  border: '1px solid rgba(245,158,11,0.30)',
                  color: '#f59e0b',
                }}
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#e2eaf4',
                }}
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}