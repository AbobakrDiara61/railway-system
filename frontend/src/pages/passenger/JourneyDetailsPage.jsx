import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronRight, Armchair } from 'lucide-react';
import { getJourneyById, getJourneySeats } from '../../api/journeys.api';
import toast from 'react-hot-toast';
import { PageBackground } from '../../components/ui/PageBackground';
import journeyBg from '../../assets/booking_flow_background.png';

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
        selected ? 'seat-selected' : isBooked ? 'seat-booked' : 'seat-available'
      }`}
    >
      <Armchair className="w-4 h-4" />
      <span className="text-[9px] font-semibold mt-0.5">{seat.seat_number}</span>
    </motion.button>
  );
}

export function JourneyDetailsPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [journey,       setJourney]       = useState(null);
  const [carriages,     setCarriages]     = useState([]);
  const [allSeats,      setAllSeats]      = useState([]);
  const [activeCar,     setActiveCar]     = useState(null);
  const [selectedSeats, setSelected]      = useState([]);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getJourneyById(id), getJourneySeats(id)])
      .then(([journeyRes, seatsRes]) => {
        setJourney(journeyRes.data?.data);

        const seats = seatsRes.data?.data ?? [];
        setAllSeats(seats);

        // ✅ unique carriages من الـ real data
        const uniqueCarriages = [...new Map(
          seats.map(s => [s.carriage_number, {
            carriage_number: s.carriage_number,
            carriage_id:     s.carriage_id,
            class:           s.class,
          }])
        ).values()];
        setCarriages(uniqueCarriages);

        if (uniqueCarriages.length > 0)
          setActiveCar(uniqueCarriages[0].carriage_number);
      })
      .catch(() => toast.error('Failed to load journey'))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ فلتر الـ seats بتاعت الـ carriage الـ active
  const currentSeats = allSeats.filter(s => s.carriage_number === activeCar);

  const seatsByRow = {};
  currentSeats.forEach(s => {
    const row = parseInt(s.seat_number);
    const col = s.seat_number.replace(/[0-9]/g, '');
    if (!seatsByRow[row]) seatsByRow[row] = [];
    seatsByRow[row].push({ ...s, col });
  });

  const toggle = (seat) => setSelected(prev =>
    prev.find(s => s.seat_id === seat.seat_id)
      ? prev.filter(s => s.seat_id !== seat.seat_id)
      : [...prev, seat]
  );

  const BASE  = 1200;
  const FEE   = 150;
  const TAXES = 120;
  const total = selectedSeats.length * (BASE + FEE + TAXES);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <PageBackground src={journeyBg} opacity={0.2} fixed />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* Journey info bar */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          className="glass rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center gap-4 border border-[rgba(0,229,255,0.10)]">
          <div className="flex items-center gap-2 font-bold text-white">
            <ArrowRight className="w-4 h-4 text-[#00e5ff]" />
            <span>{journey?.origin_station_name ?? '—'}</span>
            <span className="text-slate-600">to</span>
            <span>{journey?.destination_station_name ?? '—'}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-400 text-sm">
            Date: {journey?.departure_date_time
              ? new Date(journey.departure_date_time).toLocaleDateString('en-GB')
              : '—'}
          </span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-400 text-sm">
            Time: {journey?.departure_date_time
              ? new Date(journey.departure_date_time).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })
              : '—'}
          </span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-400 text-sm">
            Train: {allSeats[0]?.train_number ?? '—'}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span className="text-[#f59e0b] text-sm font-semibold">Seat Selection</span>
          </div>
        </motion.div>

        {/* Carriage tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {carriages.map(car => (
            <button key={car.carriage_number}
              onClick={() => { setActiveCar(car.carriage_number); setSelected([]); }}
              className={`carriage-tab flex-shrink-0 ${activeCar === car.carriage_number ? 'active' : ''}`}>
              Carriage {car.carriage_number}
              {activeCar === car.carriage_number &&
                <span className="ml-1 text-[10px] opacity-70">(Selected)</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-20">Loading seats…</div>
        ) : (
          <div className="flex gap-5 items-start">
            {/* Seat Map */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              className="flex-1 glass rounded-2xl p-6 border border-[rgba(0,229,255,0.10)]"
              style={{ minHeight: 400 }}>

              {/* Legend */}
              <div className="flex gap-4 mb-6 text-xs">
                {[
                  { label:'Available', cls:'seat-available' },
                  { label:'Selected',  cls:'seat-selected'  },
                  { label:'Booked',    cls:'seat-booked'    },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-md ${cls}`} />
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
                      <div className="flex gap-2">
                        {left.map(seat => (
                          <SeatBtn key={seat.seat_id} seat={seat}
                            selected={!!selectedSeats.find(s => s.seat_id === seat.seat_id)}
                            onToggle={toggle} />
                        ))}
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-slate-700 text-xs font-mono">{row}</div>
                      </div>
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

            {/* Selection Panel */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              className="w-64 flex-shrink-0 glass rounded-2xl p-5 border border-[rgba(0,229,255,0.10)] sticky top-24">
              <h3 className="text-white font-bold text-base mb-4">Your Selection</h3>

              {selectedSeats.length === 0 ? (
                <p className="text-slate-600 text-sm text-center py-6">Click a seat to select it</p>
              ) : (
                <AnimatePresence>
                  {selectedSeats.map(seat => (
                    <motion.div key={seat.seat_id}
                      initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                      className="mb-3 p-3 rounded-xl"
                      style={{ background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.12)' }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-white font-bold text-sm">Seat {seat.seat_number}</div>
                          <div className="text-slate-400 text-xs capitalize">{seat.seat_type} · {seat.class}</div>
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
                  navigate(`/booking/${id}`, { state: { selectedSeats, total, journey } });
                }}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedSeats.length ? 'btn-gold gold-pulse' : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'
                }`}>
                Proceed to Book <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}