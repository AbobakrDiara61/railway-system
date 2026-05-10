import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, Wifi, Zap, Search,
  ChevronLeft, ChevronRight, Train, MapPin, X
} from 'lucide-react';
import { searchTrains, getScheduledTrainJourneys } from '../../api/trains.api';
import { PageBackground } from '../../components/ui/PageBackground';
import searchBg from '../../assets/search_journey_background.png';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLORS = {
  Express:   'text-[#00e5ff] border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.08)]',
  Regional:  'text-[#4ade80] border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.08)]',
  Intercity: 'text-[#f59e0b] border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)]',
};

const PAGE_SIZE = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse an ISO / datetime string and return { time, period } e.g. { time: '07:00', period: 'AM' }
 */
function parseDateTime(raw) {
  if (!raw) return { time: '--:--', period: '' };
  const d = new Date(raw);
  if (isNaN(d)) return { time: raw, period: '' };
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return { time: `${h12}:${m}`, period };
}

/**
 * Compute human-readable duration between two datetime strings.
 */
function computeDuration(departure, arrival) {
  if (!departure || !arrival) return '--';
  const diff = new Date(arrival) - new Date(departure);
  if (isNaN(diff) || diff < 0) return '--';
  const totalMins = Math.floor(diff / 60000);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

/**
 * Normalise a raw journey object from either API endpoint into a consistent shape.
 * Fields: train_id, train_number, type, journey_id, departure_date_time,
 *         arrival_date_time, route_name, distance_km, origin, destination
 */
function normaliseJourney(raw = {}) {
  const dep = parseDateTime(raw.departure_date_time);
  const arr = parseDateTime(raw.arrival_date_time);
  return {
    // identity
    id:           raw.journey_id   ?? raw.train_id ?? Math.random(),
    trainId:      raw.train_id     ?? null,
    trainNumber:  raw.train_number ?? 'N/A',
    trainType:    raw.type         ?? 'Express',
    journeyId:    raw.journey_id   ?? null,
    // route
    from:         raw.origin      ?? 'Unknown',
    to:           raw.destination ?? 'Unknown',
    routeName:    raw.route_name  ?? '',
    distanceKm:   raw.distance_km ?? null,
    // times
    departureRaw: raw.departure_date_time ?? null,
    arrivalRaw:   raw.arrival_date_time   ?? null,
    departureTime: dep.time,
    departurePeriod: dep.period,
    arrivalTime:   arr.time,
    arrivalPeriod: arr.period,
    duration:      computeDuration(raw.departure_date_time, raw.arrival_date_time),
    // amenities / class — not in API yet, kept with safe defaults
    trainClass:   raw.class  ?? 'Economy Class',
    seat:         raw.seat   ?? 'Standard Seat',
    price:        raw.price  ?? null,
    hasWifi:      raw.hasWifi  ?? false,
    hasPower:     raw.hasPower ?? false,
  };
}

/** Returns true if a journey matches the active filter state */
function matchesFilters(journey, { searchQuery, filterFrom, filterTo, selectedTypes, selectedTimes, selectedClasses, priceRange }) {
  const q = searchQuery.trim().toLowerCase();

  if (q) {
    const haystack = [journey.from, journey.to, journey.trainNumber, journey.routeName, journey.trainType]
      .join(' ').toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filterFrom.trim()) {
    if (!journey.from.toLowerCase().includes(filterFrom.trim().toLowerCase())) return false;
  }

  if (filterTo.trim()) {
    if (!journey.to.toLowerCase().includes(filterTo.trim().toLowerCase())) return false;
  }

  if (selectedTypes.length && !selectedTypes.includes(journey.trainType)) return false;

  if (selectedTimes.length) {
    const h = journey.departureRaw ? new Date(journey.departureRaw).getHours() : -1;
    const slot = h >= 5 && h < 12 ? 'Morning' : h >= 12 && h < 17 ? 'Afternoon' : h >= 17 ? 'Evening' : null;
    if (!selectedTimes.includes(slot)) return false;
  }

  if (selectedClasses.length) {
    const cls = journey.trainClass?.split(' ')[0]; // 'Economy', 'Business', 'VIP'
    if (!selectedClasses.includes(cls)) return false;
  }

  if (journey.price !== null) {
    if (journey.price < priceRange[0] || journey.price > priceRange[1]) return false;
  }

  return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // URL params used as initial filter values
  const urlFrom = params.get('from') ?? '';
  const urlTo   = params.get('to')   ?? '';

  // ── Data state ──
  const [allJourneys, setAllJourneys] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // ── Search / filter state ──
  const [searchQuery,    setSearchQuery]    = useState('');
  const [filterFrom,     setFilterFrom]     = useState(urlFrom);
  const [filterTo,       setFilterTo]       = useState(urlTo);
  const [selectedTypes,  setSelectedTypes]  = useState([]);
  const [selectedTimes,  setSelectedTimes]  = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [priceRange,     setPriceRange]     = useState([0, 5000]);

  // ── Pagination / sort ──
  const [page,    setPage]    = useState(1);
  const [sortKey, setSortKey] = useState('default');

  // ── Fetch ──
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let raw = [];

        if (urlFrom && urlTo) {
          // Directed search
          const res = await searchTrains({ from: urlFrom, to: urlTo });
          raw = Array.isArray(res?.data) ? res.data : [];
        } else {
          // No route specified — load all scheduled journeys
          const res = await getScheduledTrainJourneys();
          raw = Array.isArray(res?.data?.data) ? res.data.data : [];
        }

        if (!cancelled) {
          setAllJourneys(raw.map(normaliseJourney));
        }
      } catch (err) {
        if (!cancelled) setError(err?.message ?? 'Failed to load journeys.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [urlFrom, urlTo]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [searchQuery, filterFrom, filterTo, selectedTypes, selectedTimes, selectedClasses, priceRange, sortKey]);

  // ── Toggle helper ──
  const toggleFilter = useCallback((arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }, []);

  // ── Derived: filtered + sorted list ──
  const filteredJourneys = useMemo(() => {
    const filterState = { searchQuery, filterFrom, filterTo, selectedTypes, selectedTimes, selectedClasses, priceRange };
    let list = allJourneys.filter(j => matchesFilters(j, filterState));

    if (sortKey === 'price-asc')  list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortKey === 'price-desc') list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sortKey === 'duration')   list = [...list].sort((a, b) => (a.departureRaw ?? '') < (b.departureRaw ?? '') ? -1 : 1);

    return list;
  }, [allJourneys, searchQuery, filterFrom, filterTo, selectedTypes, selectedTimes, selectedClasses, priceRange, sortKey]);

  // ── Pagination slice ──
  const totalPages = Math.max(1, Math.ceil(filteredJourneys.length / PAGE_SIZE));
  const pageJourneys = filteredJourneys.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = searchQuery || filterFrom || filterTo ||
    selectedTypes.length || selectedTimes.length || selectedClasses.length;

  const clearFilters = () => {
    setSearchQuery('');
    setFilterFrom('');
    setFilterTo('');
    setSelectedTypes([]);
    setSelectedTimes([]);
    setSelectedClasses([]);
    setPriceRange([0, 5000]);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-navy relative">
      <PageBackground src={searchBg} opacity={0.4} fixed />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Train Search Results</h1>
            <p className="text-slate-500 text-sm">
              {filterFrom || urlFrom || 'All origins'} → {filterTo || urlTo || 'All destinations'}
            </p>
          </div>
        </motion.div>

        {/* ── Global search bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          {/* General keyword search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search train number, route…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-glass w-full pl-9 pr-4 py-2.5 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* From */}
          <div className="relative sm:w-44">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="From"
              value={filterFrom}
              onChange={e => setFilterFrom(e.target.value)}
              className="input-glass w-full pl-9 pr-4 py-2.5 text-sm"
            />
            {filterFrom && (
              <button onClick={() => setFilterFrom('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* To */}
          <div className="relative sm:w-44">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00e5ff] pointer-events-none" />
            <input
              type="text"
              placeholder="To"
              value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
              className="input-glass w-full pl-9 pr-4 py-2.5 text-sm"
            />
            {filterTo && (
              <button onClick={() => setFilterTo('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl glass border border-white/10 text-slate-400 hover:text-white text-sm transition-all whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </motion.div>

        <div className="flex gap-6">

          {/* ── Filter panel (sidebar) ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="filter-panel w-64 flex-shrink-0 p-5 h-fit hidden md:block"
          >
            <h3 className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mb-5">
              Filter Results
            </h3>

            {/* Train Type */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-3">Train Type</p>
              {[
                { key: 'Express',   label: 'Express',   dot: 'bg-[#00e5ff]' },
                { key: 'Economy',   label: 'Economy',   dot: 'bg-[#4ade80]' },
                { key: 'Intercity', label: 'Intercity', dot: 'bg-[#f59e0b]' },
                { key: 'Sleeper',   label: 'Sleeper',   dot: 'bg-blue-700' },
              ].map(({ key, label, dot }) => (
                <label key={key} className="flex items-center gap-2.5 mb-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="checkbox-cyan"
                    checked={selectedTypes.includes(key)}
                    onChange={() => toggleFilter(selectedTypes, setSelectedTypes, key)}
                  />
                  <span className={`w-3 h-3 rounded-full ${dot}`} />
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
            </div>

            {/* Departure Time */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-3">Departure Time</p>
              <div className="flex gap-1.5 flex-wrap">
                {['Morning', 'Afternoon', 'Evening'].map(t => (
                  <button
                    key={t}
                    onClick={() => toggleFilter(selectedTimes, setSelectedTimes, t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimes.includes(t)
                        ? 'bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] text-[#00e5ff]'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
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
                  <input
                    type="checkbox"
                    className="checkbox-cyan"
                    checked={selectedClasses.includes(c)}
                    onChange={() => toggleFilter(selectedClasses, setSelectedClasses, c)}
                  />
                  <span className="text-slate-300 text-sm">{c}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-1">Price Range</p>
              <p className="text-slate-500 text-xs mb-3">{priceRange[0]} EGP — {priceRange[1]} EGP</p>
              <div className="flex items-end gap-0.5 h-10 mb-3">
                {[20,35,45,60,55,70,80,65,50,40,30,45,55,70,80,75,60,40,30,20].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all"
                    style={{ height: `${h}%`, background: i > 5 && i < 15 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full"
              />
            </div>

            {/* Result count */}
            <p className="text-slate-500 text-xs text-center">
              {filteredJourneys.length} result{filteredJourneys.length !== 1 ? 's' : ''} found
            </p>
          </motion.aside>

          {/* ── Results list ── */}
          <div className="flex-1 min-w-0">

            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="glass h-36 animate-pulse rounded-2xl" />
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-red-400 font-semibold mb-2">Failed to load journeys</p>
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredJourneys.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-12 text-center"
              >
                <Train className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-semibold mb-1">No journeys found</p>
                <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 text-[#00e5ff] text-sm hover:underline">
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}

            {/* Journey cards */}
            {!loading && !error && pageJourneys.length > 0 && (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {pageJourneys.map((r, i) => {
                    const typeColor = TYPE_COLORS[r.trainType] ?? TYPE_COLORS.Express;
                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.06 }}
                        className="ticket-card"
                      >
                        <div className="p-5 flex flex-col sm:flex-row gap-4">

                          {/* Left: journey info */}
                          <div className="flex-1 min-w-0">
                            {/* Badge row */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className={`badge text-xs font-bold px-2.5 py-1 rounded-lg border ${typeColor}`}>
                                {r.trainType ?? 'Train'}
                              </span>
                              <span className="text-slate-500 text-sm truncate">
                                {r.from} → {r.to}
                                {r.trainNumber !== 'N/A' && ` — ${r.trainNumber}`}
                              </span>
                              <span className="ml-auto flex items-center gap-1 text-xs text-slate-500 shrink-0">
                                <Clock className="w-3.5 h-3.5" /> {r.duration}
                              </span>
                            </div>

                            {/* Times */}
                            <div className="flex items-center gap-4 mb-3">
                              <div>
                                <div className="text-3xl font-black text-white tracking-tight">{r.departureTime}</div>
                                <div className="text-xs text-slate-500 uppercase">{r.departurePeriod}</div>
                              </div>
                              <div className="flex-1 flex items-center">
                                <div className="h-px flex-1 bg-gradient-to-r from-[rgba(0,229,255,0.3)] to-transparent" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] mx-1" />
                                <div className="h-px flex-1 bg-gradient-to-l from-[rgba(0,229,255,0.3)] to-transparent" />
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-black text-white tracking-tight">{r.arrivalTime}</div>
                                <div className="text-xs text-slate-500 uppercase">{r.arrivalPeriod}</div>
                              </div>
                            </div>

                            {/* Class, seat, amenities */}
                            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                              <span>{r.trainClass}{r.seat !== 'Standard Seat' ? ` — ${r.seat}` : ''}</span>
                              {r.distanceKm && (
                                <span className="text-slate-600">{r.distanceKm} km</span>
                              )}
                              {r.routeName && (
                                <span className="text-slate-600 truncate max-w-[140px]">{r.routeName}</span>
                              )}
                              {r.hasWifi  && <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-[#00e5ff]" /></span>}
                              {r.hasPower && <span className="flex items-center gap-1"><Zap  className="w-3 h-3 text-[#f59e0b]" /></span>}
                            </div>
                          </div>

                          {/* Ticket divider */}
                          <div className="hidden sm:block w-px border-r-2 border-dashed border-[rgba(0,229,255,0.15)] mx-2 relative">
                            <div className="absolute -top-5 -left-2 w-4 h-4 rounded-full bg-[#070b14]" />
                            <div className="absolute -bottom-5 -left-2 w-4 h-4 rounded-full bg-[#070b14]" />
                          </div>

                          {/* Right: price + book */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:w-36 shrink-0">
                            <div className="text-right">
                              {r.price !== null ? (
                                <>
                                  <div className="text-3xl font-black text-[#f59e0b]">{r.price}</div>
                                  <div className="text-[#f59e0b] text-sm font-semibold">EGP</div>
                                </>
                              ) : (
                                <div className="text-slate-500 text-sm">Price on request</div>
                              )}
                            </div>
                            <button
                              onClick={() => navigate(`/journeys/${r.journeyId ?? r.id}`)}
                              className="btn-gold px-6 py-2 text-sm rounded-xl font-bold whitespace-nowrap"
                            >
                              Book Now
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Pagination + sort */}
                <div className="flex items-center justify-between pt-4 flex-wrap gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center hover:border-[rgba(0,229,255,0.3)] transition-all disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const n = i + 1;
                      return (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                            page === n
                              ? 'bg-[rgba(0,229,255,0.15)] border border-[#00e5ff] text-[#00e5ff]'
                              : 'glass border border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Sort by</span>
                    <select
                      value={sortKey}
                      onChange={e => setSortKey(e.target.value)}
                      className="input-glass py-1.5 text-xs"
                      style={{ minWidth: '110px' }}
                    >
                      <option value="default">Default</option>
                      <option value="price-asc">Price ↑</option>
                      <option value="price-desc">Price ↓</option>
                      <option value="duration">Departure</option>
                    </select>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center hover:border-[rgba(0,229,255,0.3)] transition-all disabled:opacity-40"
                    >
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