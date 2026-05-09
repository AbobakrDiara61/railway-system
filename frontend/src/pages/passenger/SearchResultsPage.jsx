import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, Wifi, Zap, Search, SlidersHorizontal,
  Train, ChevronLeft, ChevronRight
} from 'lucide-react';
import { searchTrains } from '../../api/trains.api';
import searchBg from '../../assets/search_journey_background.png';

const MOCK_RESULTS = [
  {
    id: 1, trainName: 'Express Train E-205', trainType: 'Express',
    from: 'Cairo', to: 'Luxor', departureTime: '07:00 AM', arrivalTime: '11:30 AM',
    duration: '4h 30m', class: 'Economy Class', seat: 'Window Seat',
    price: 450, hasWifi: true, hasPower: true,
  },
  {
    id: 2, trainName: 'Regional Train R-311', trainType: 'Regional',
    from: 'Alexandria', to: 'Aswan', departureTime: '08:15 AM', arrivalTime: '09:45 PM',
    duration: '13h 30m', class: 'Business Class', seat: 'Window Seat',
    price: 890, hasWifi: true, hasPower: true,
  },
  {
    id: 3, trainName: 'Intercity Train I-402', trainType: 'Intercity',
    from: 'Giza', to: 'Hurghada', departureTime: '10:00 PM', arrivalTime: '06:00 AM',
    duration: '8h 00m', class: 'VIP Class', seat: 'Window Seat',
    price: 1250, hasWifi: true, hasPower: true,
  },
];

const TYPE_COLORS = {
  Express:  'text-[#00e5ff] border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.08)]',
  Regional: 'text-[#4ade80] border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.08)]',
  Intercity:'text-[#f59e0b] border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)]',
};

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get('from') || 'Cairo';
  const to   = params.get('to')   || 'Alexandria';

  const [results, setResults]           = useState(MOCK_RESULTS);
  const [loading, setLoading]           = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [priceRange, setPriceRange]     = useState([50, 1500]);
  const [page, setPage]                 = useState(1);

  useEffect(() => {
    setLoading(true);
    searchTrains({ from, to }).then(r => {
      if (r.data?.length) setResults(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [from, to]);

  const toggleFilter = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  return (
    <div className="min-h-screen bg-navy relative">
      {/* BG image */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={searchBg} alt="" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0" style={{
          background:'linear-gradient(to bottom, rgba(7,11,20,0.8) 0%, rgba(7,11,20,0.9) 100%)'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Train Search Results</h1>
            <p className="text-slate-500 text-sm">{from} → {to}</p>
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* ─ FILTER PANEL ─ */}
          <motion.aside
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            className="filter-panel w-64 flex-shrink-0 p-5 h-fit hidden md:block"
          >
            <h3 className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mb-5">
              Filter Results
            </h3>

            {/* Train Type */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-3">Train Type</p>
              {['Express (Blue)', 'Regional (Green)', 'Intercity (Orange)'].map(t => {
                const key = t.split(' ')[0];
                const dot = key === 'Express' ? 'bg-[#00e5ff]' : key === 'Regional' ? 'bg-[#4ade80]' : 'bg-[#f59e0b]';
                return (
                  <label key={t} className="flex items-center gap-2.5 mb-2.5 cursor-pointer group">
                    <input type="checkbox" className="checkbox-cyan"
                      checked={selectedTypes.includes(key)}
                      onChange={() => toggleFilter(selectedTypes, setSelectedTypes, key)} />
                    <span className={`w-3 h-3 rounded-full ${dot}`} />
                    <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{t}</span>
                  </label>
                );
              })}
            </div>

            {/* Departure Time */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-3">Departure Time</p>
              <div className="flex gap-1.5 flex-wrap">
                {['Morning', 'Afternoon', 'Evening'].map(t => (
                  <button key={t}
                    onClick={() => toggleFilter(selectedTimes, setSelectedTimes, t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimes.includes(t)
                        ? 'bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] text-[#00e5ff]'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Class */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-3">Class</p>
              {['Economy', 'Business', 'VIP'].map(c => (
                <label key={c} className="flex items-center gap-2.5 mb-2.5 cursor-pointer">
                  <input type="checkbox" className="checkbox-cyan"
                    checked={selectedClasses.includes(c)}
                    onChange={() => toggleFilter(selectedClasses, setSelectedClasses, c)} />
                  <span className="text-slate-300 text-sm">{c}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-1">Price Range</p>
              <p className="text-slate-500 text-xs mb-3">{priceRange[0]} EGP — {priceRange[1]} EGP</p>
              {/* Mini histogram */}
              <div className="flex items-end gap-0.5 h-10 mb-3">
                {[20,35,45,60,55,70,80,65,50,40,30,45,55,70,80,75,60,40,30,20].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm transition-all"
                    style={{ height:`${h}%`, background: i > 5 && i < 15 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
              <input type="range" min={50} max={1500}
                value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full" />
            </div>

            <button className="btn-gold w-full py-2.5 text-sm font-bold rounded-xl">
              Apply Filters
            </button>
          </motion.aside>

          {/* ─ RESULTS ─ */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="glass h-32 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {results.map((r, i) => (
                    <motion.div key={r.id}
                      initial={{ opacity:0, y:20 }}
                      animate={{ opacity:1, y:0 }}
                      transition={{ delay: i * 0.08 }}
                      className="ticket-card"
                    >
                      <div className="p-5 flex flex-col sm:flex-row gap-4">
                        {/* Left: journey info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`badge text-xs font-bold px-2.5 py-1 rounded-lg border ${TYPE_COLORS[r.trainType]}`}>
                              {r.trainType}
                            </span>
                            <span className="text-slate-500 text-sm">{r.from} to {r.to} — {r.trainName}</span>
                            <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3.5 h-3.5" /> {r.duration}
                            </span>
                          </div>

                          {/* Times */}
                          <div className="flex items-center gap-4 mb-3">
                            <div>
                              <div className="text-3xl font-black text-white tracking-tight">{r.departureTime.split(' ')[0]}</div>
                              <div className="text-xs text-slate-500 uppercase">{r.departureTime.split(' ')[1]}</div>
                            </div>
                            <div className="flex-1 flex items-center">
                              <div className="h-px flex-1 bg-gradient-to-r from-[rgba(0,229,255,0.3)] to-transparent" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] mx-1" />
                              <div className="h-px flex-1 bg-gradient-to-l from-[rgba(0,229,255,0.3)] to-transparent" />
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-black text-white tracking-tight">{r.arrivalTime.split(' ')[0]}</div>
                              <div className="text-xs text-slate-500 uppercase">{r.arrivalTime.split(' ')[1]}</div>
                            </div>
                          </div>

                          {/* Class + amenities */}
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{r.class} — {r.seat}</span>
                            {r.hasWifi && <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-[#00e5ff]" /></span>}
                            {r.hasPower && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#f59e0b]" /></span>}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px border-r-2 border-dashed border-[rgba(0,229,255,0.15)] mx-2 relative">
                          <div className="absolute -top-5 -left-2 w-4 h-4 rounded-full bg-[#070b14]" />
                          <div className="absolute -bottom-5 -left-2 w-4 h-4 rounded-full bg-[#070b14]" />
                        </div>

                        {/* Right: price + book */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:w-36">
                          <div className="text-right">
                            <div className="text-3xl font-black text-[#f59e0b]">{r.price}</div>
                            <div className="text-[#f59e0b] text-sm font-semibold">EGP</div>
                          </div>
                          <button
                            onClick={() => navigate(`/journeys/${r.id}`)}
                            className="btn-gold px-6 py-2 text-sm rounded-xl font-bold whitespace-nowrap"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p-1))}
                    className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center hover:border-[rgba(0,229,255,0.3)] transition-all">
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <div className="flex gap-2">
                    {[1,2,3].map(n => (
                      <button key={n} onClick={() => setPage(n)}
                        className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                          page === n
                            ? 'bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] text-[#00e5ff]'
                            : 'glass border border-white/10 text-slate-400 hover:border-white/20'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Sort by</span>
                    <select className="input-glass py-1.5 text-xs w-auto pr-8"
                      style={{ width:'auto', minWidth:'100px' }}>
                      <option>Default</option>
                      <option>Price ↑</option>
                      <option>Price ↓</option>
                      <option>Duration</option>
                    </select>
                    <button
                      onClick={() => setPage(p => p+1)}
                      className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center hover:border-[rgba(0,229,255,0.3)] transition-all">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
