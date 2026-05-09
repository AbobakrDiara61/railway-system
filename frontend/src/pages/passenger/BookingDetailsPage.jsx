import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Printer, ArrowLeft, Train } from 'lucide-react';
import { getBookingById } from '../../api/bookings.api';
import { useState, useEffect } from 'react';
import ticketBg from '../../assets/profile_history_background.png';

// Mock ticket data mirroring the Stitch reference
const MOCK_TICKET = {
  id: 'EG-123456789',
  trainName: 'NILELUX RAIL',
  from: 'Cairo (Ramses)', to: 'Alexandria (Sidi Gaber)',
  date: '26 OCT 2024', time: '14:30',
  passenger: 'Ahmed Hassan',
  carriage: '3', seat: 'A42 (Window)',
  class: 'Gold Class',
};

// Simple QR-like grid pattern (SVG)
function QRCode() {
  const cells = Array.from({length:64}, (_, i) => Math.random() > 0.5);
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <rect width="80" height="80" fill="#fff" />
      {cells.map((on, i) => on && (
        <rect key={i}
          x={(i % 8) * 10} y={Math.floor(i/8) * 10}
          width="10" height="10" fill="#0a0e1a" />
      ))}
      {/* Corner markers */}
      {[[0,0],[60,0],[0,60]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width={20} height={20} fill="#0a0e1a" />
          <rect x={x+3} y={y+3} width={14} height={14} fill="#fff" />
          <rect x={x+6} y={y+6} width={8} height={8} fill="#0a0e1a" />
        </g>
      ))}
    </svg>
  );
}

export function BookingDetailsPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(MOCK_TICKET);

  useEffect(() => {
    if (!id) return;
    getBookingById(id).then(r => {
      const b = r.data?.booking || r.data;
      if (b) setTicket({
        id: b.booking_id || b.id,
        trainName: b.train_name || 'NILELUX RAIL',
        from: b.from_station || b.from,
        to:   b.to_station   || b.to,
        date: b.date,
        time: b.departure_time,
        passenger: b.passenger_name,
        carriage:  b.carriage,
        seat:      b.seat_number,
        class:     b.class,
      });
    }).catch(() => {});
  }, [id]);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* BG — dark train station */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={ticketBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(to bottom,rgba(7,11,20,0.60) 0%,rgba(7,11,20,0.85) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </button>

        {/* ── TICKET CARD ── */}
        <motion.div
          initial={{ opacity:0, y:30, scale:0.97 }}
          animate={{ opacity:1, y:0,  scale:1 }}
          transition={{ duration:0.4 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background:'linear-gradient(160deg,rgba(15,25,45,0.95) 0%,rgba(8,14,28,0.98) 100%)',
            border:'1px solid rgba(0,229,255,0.15)',
            boxShadow:'0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,229,255,0.05)',
          }}
        >
          {/* Header — brand */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-dashed border-[rgba(255,255,255,0.10)]">
            {/* Horus Eye + pyramid logo */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background:'radial-gradient(circle,rgba(245,158,11,0.15) 0%,transparent 70%)', border:'1px solid rgba(245,158,11,0.25)' }}>
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
          </div>

          {/* Tear-line divider */}
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
            <div className="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest mb-3">Journey</div>

            {/* Route */}
            <div className="text-white font-semibold text-sm mb-4">
              {ticket.from} to {ticket.to}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Date</div>
                <div className="text-white text-sm font-semibold">{ticket.date}</div>
              </div>
              <div>
                <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Time</div>
                <div className="text-white text-sm font-semibold">{ticket.time}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Passenger</div>
              <div className="text-white text-sm font-semibold">{ticket.passenger}</div>
            </div>

            <div className="mb-4">
              <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">ID</div>
              <div className="text-[#f59e0b] text-sm font-mono font-bold">{ticket.id}</div>
            </div>

            {/* QR + seat info */}
            <div className="flex gap-4 items-center mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Carriage</div>
                  <div className="text-white text-sm font-bold">{ticket.carriage}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">Seat</div>
                  <div className="text-white text-sm font-bold">{ticket.seat}</div>
                </div>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.10)]">
                <QRCode />
              </div>
            </div>
            <div className="text-slate-700 text-[10px] text-right mt-1 tracking-widest">SCAN FOR ENTRY</div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="flex gap-3 mt-5">
          <button
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background:'rgba(245,158,11,0.10)',
              border:'1px solid rgba(245,158,11,0.30)',
              color:'#f59e0b',
            }}>
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.12)',
              color:'#e2eaf4',
            }}>
            <Printer className="w-4 h-4" /> Print
          </button>
        </motion.div>
      </div>
    </div>
  );
}
