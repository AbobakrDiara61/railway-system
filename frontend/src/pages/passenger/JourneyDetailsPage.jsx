import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Clock, ArrowRight, X, ChevronRight, Armchair } from 'lucide-react';
import { getJourneyById, getJourneySeats } from '../../api/journeys.api';
import { getCarriagesByTrain } from '../../api/carriages.api';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';
import { PageBackground } from '../../components/ui/PageBackground';
import journeyBg from '../../assets/booking_flow_background.png';

// Simulate rich seat map data matching the Stitch reference
const MOCK_CARRIAGES = [
  { id:'A', label:'Carriage A' },
  { id:'B', label:'Carriage B' },
  { id:'C', label:'Carriage C', selected: true },
  { id:'D', label:'Carriage D' },
];

const generateSeats = (carriageId) => {
  const bookedIds = ['1B','2A','2C','2D','3A','3B','5B','5C','5D','6A','7A','7B','8A','8B','9B','9C'];
  const rows = 9;
  const cols = ['A','B','C','D'];
  const seats = [];
  for (let r = 1; r <= rows; r++) {
    cols.forEach(c => {
      const id = `${r}${c}`;
      seats.push({
        seat_id: `${carriageId}-${id}`,
        seat_number: id,
        row: r,
        col: c,
        class: c === 'A' || c === 'D' ? 'Gold Class, Window' : 'Gold Class, Aisle',
        status: bookedIds.includes(id) ? 'booked' : 'available',
        price: 1200,
      });
    });
  }
  return seats;
};

function SeatBtn({ seat, selected, onToggle }) {
  const isBooked = seat.status === 'booked';

  return (
    <motion.button
      onClick={() => {
        if (isBooked) { toast.error('Seat already taken'); return; }
        onToggle(seat);
      }}
      whileHover={!isBooked ? { scale:1.06 } : {}}
      whileTap={!isBooked ? { scale:0.94 } : {}}
      className={`relative w-12 h-10 rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all ${
        selected   ? 'seat-selected' :
        isBooked   ? 'seat-booked'   :
                     'seat-available'
      }`}
    >
      <Armchair className="w-4 h-4" />
      <span className="text-[9px] font-semibold mt-0.5">{seat.seat_number}</span>
    </motion.button>
  );
}

export function JourneyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeCar, setActiveCar]       = useState('C');
  const [selectedSeats, setSelected]    = useState([]);
  const [journey, setJourney]           = useState(null);
  const [loading, setLoading]           = useState(false);

  const seats = generateSeats(activeCar);
  const seatsByRow = {};
  seats.forEach(s => {
    if (!seatsByRow[s.row]) seatsByRow[s.row] = [];
    seatsByRow[s.row].push(s);
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getJourneyById(id)
      .then(r => setJourney(r.data?.journey || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggle = (seat) => setSelected(prev =>
    prev.find(s => s.seat_id === seat.seat_id)
      ? prev.filter(s => s.seat_id !== seat.seat_id)
      : [...prev, seat]
  );

  const BASE   = 1200;
  const FEE    = 150;
  const TAXES  = 120;
  const total  = selectedSeats.length * (BASE + FEE + TAXES);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <PageBackground src={journeyBg} opacity={0.2} fixed />
      {/* BG */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <img src={journeyBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0"
          style={{ background:'radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.10) 0%, transparent 55%), linear-gradient(180deg,rgba(7,11,20,0.7) 0%,rgba(7,11,20,0.9) 100%)' }} />
      </div> */}
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Journey info bar */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          className="glass rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center gap-4 border border-[rgba(0,229,255,0.10)]">
          <div className="flex items-center gap-2 font-bold text-white">
            <ArrowRight className="w-4 h-4 text-[#00e5ff]" />
            <span>Cairo</span>
            <span className="text-slate-600">to</span>
            <span>Alexandria</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-400 text-sm">Date: Oct 26, 2084</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-400 text-sm">Time: 09:30 AM</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-400 text-sm">Train ID: R-X842</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span className="text-[#f59e0b] text-sm font-semibold">Seat Selection</span>
          </div>
        </motion.div>

        {/* Carriage tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {MOCK_CARRIAGES.map(car => (
            <button key={car.id} onClick={() => { setActiveCar(car.id); setSelected([]); }}
              className={`carriage-tab flex-shrink-0 ${activeCar === car.id ? 'active' : ''}`}>
              {car.label}
              {activeCar === car.id && <span className="ml-1 text-[10px] opacity-70">(Selected)</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-5 items-start">
          {/* ── SEAT MAP ── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="flex-1 glass rounded-2xl p-6 border border-[rgba(0,229,255,0.10)]"
            style={{ minHeight: 400 }}>

            {/* Legend */}
            <div className="flex gap-4 mb-6 text-xs">
              {[
                { label:'Available', cls:'seat-available', size:'w-5 h-5' },
                { label:'Selected',  cls:'seat-selected',  size:'w-5 h-5' },
                { label:'Booked',    cls:'seat-booked',    size:'w-5 h-5' },
              ].map(({ label, cls, size }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`${size} rounded-md ${cls}`} />
                  <span className="text-slate-500">{label}</span>
                </div>
              ))}
            </div>

            {/* Seat grid */}
            <div className="space-y-3">
              {Object.entries(seatsByRow).map(([row, rowSeats]) => {
                const left  = rowSeats.filter(s => s.col === 'A' || s.col === 'B');
                const right = rowSeats.filter(s => s.col === 'C' || s.col === 'D');
                return (
                  <motion.div key={row}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: parseInt(row) * 0.04 }}
                    className="flex items-center gap-3">
                    {/* Left pair */}
                    <div className="flex gap-2">
                      {left.map(seat => (
                        <SeatBtn key={seat.seat_id} seat={seat}
                          selected={!!selectedSeats.find(s => s.seat_id === seat.seat_id)}
                          onToggle={toggle} />
                      ))}
                    </div>
                    {/* Aisle */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-slate-700 text-xs font-mono">{row}</div>
                    </div>
                    {/* Right pair */}
                    <div className="flex gap-2">
                      {right.map(seat => (
                        <SeatBtn key={seat.seat_id} seat={seat}
                          selected={!!selectedSeats.find(s => s.seat_id === seat.seat_id)}
                          onToggle={toggle} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── SELECTION PANEL ── */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
            className="w-64 flex-shrink-0 glass rounded-2xl p-5 border border-[rgba(0,229,255,0.10)] sticky top-24">
            <h3 className="text-white font-bold text-base mb-4">Your Selection</h3>

            {selectedSeats.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-6">
                Click a seat to select it
              </p>
            ) : (
              <AnimatePresence>
                {selectedSeats.map(seat => (
                  <motion.div key={seat.seat_id}
                    initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:-10 }}
                    className="mb-3 p-3 rounded-xl"
                    style={{ background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.12)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-white font-bold text-sm">Seat {seat.seat_number}:</div>
                        <div className="text-slate-400 text-xs">{seat.class}</div>
                      </div>
                      <button onClick={() => toggle(seat)}
                        className="text-slate-500 hover:text-red-400 transition-colors mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {selectedSeats.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base Fare:</span>
                  <span className="text-white">{(selectedSeats.length * BASE).toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Fee:</span>
                  <span className="text-white">{(selectedSeats.length * FEE).toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Taxes:</span>
                  <span className="text-white">{(selectedSeats.length * TAXES).toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-white font-bold">Total:</span>
                  <span className="text-[#f59e0b] font-black text-lg">{total.toLocaleString()} EGP</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!selectedSeats.length) { toast.error('Select at least one seat'); return; }
                navigate(`/booking/${id}`, { state: { selectedSeats, total } });
              }}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedSeats.length ? 'btn-gold gold-pulse' : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'
              }`}>
              Proceed to Book <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
