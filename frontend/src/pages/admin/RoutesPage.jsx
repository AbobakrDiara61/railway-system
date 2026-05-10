import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, MapPin, ArrowRight, X } from 'lucide-react';
import { getRoutesWithDetails, createRoute, deleteRoute } from '../../api/routes.api';
import { getStations } from '../../api/stations.api';
import toast from 'react-hot-toast';

const MOCK = [
  { route_id:1, route_name:'Cairo–Alexandria Main',  origin_station:'Cairo (Ramses)',    origin_city:'Cairo',  destination_station:'Sidi Gaber Station', destination_city:'Alexandria', distance_km:'218', trains:6 },
  { route_id:2, route_name:'Nile Valley Express',    origin_station:'Ramses Station',    origin_city:'Cairo',  destination_station:'Luxor Station',      destination_city:'Luxor',      distance_km:'676', trains:3 },
  { route_id:3, route_name:'Upper Egypt Link',       origin_station:'Luxor Station',     origin_city:'Luxor',  destination_station:'Aswan Station',      destination_city:'Aswan',      distance_km:'215', trains:4 },
  { route_id:4, route_name:'Red Sea Corridor',       origin_station:'Ain Shams Station', origin_city:'Cairo',  destination_station:'Hurghada Terminal',  destination_city:'Hurghada',   distance_km:'490', trains:2 },
  { route_id:5, route_name:'Delta Northern Line',    origin_station:'Ramses Station',    origin_city:'Cairo',  destination_station:'Damietta Central',   destination_city:'Damietta',   distance_km:'205', trains:5 },
];

// Normalize raw API route to the shape the UI expects
const normalizeRoute = (r) => ({
  route_id:            r.route_id,
  route_name:          r.route_name          ?? 'Unnamed Route',
  origin_station:      r.origin_station      ?? '',
  origin_city:         r.origin_city         ?? '',
  destination_station: r.destination_station ?? '',
  destination_city:    r.destination_city    ?? '',
  distance_km:         r.distance_km         ?? null,
  trains:              r.trains              ?? 0,
});

function RouteModal({ onSave, onClose }) {
  const [form, setForm]     = useState({ route_name:'', origin_station:'', destination_station:'', distance_km:'' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.origin_station || !form.destination_station) {
      toast.error('Select origin and destination'); return;
    }
    setSaving(true);
    try {
      await createRoute(form);
      onSave(form);
      toast.success('Route created!');
    } catch { toast.error('Failed to create route'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{scale:0.92}} animate={{scale:1}} exit={{scale:0.92}}
        className="relative z-10 w-full max-w-md glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">ADD NEW ROUTE</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Route Name</label>
            <input value={form.route_name} onChange={e => setForm({...form, route_name: e.target.value})}
              placeholder="e.g. Cairo–Alexandria Main" className="input-glass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Origin Station</label>
              <input value={form.origin_station} onChange={e => setForm({...form, origin_station: e.target.value})}
                placeholder="From station" className="input-glass" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Destination Station</label>
              <input value={form.destination_station} onChange={e => setForm({...form, destination_station: e.target.value})}
                placeholder="To station" className="input-glass" />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Distance (km)</label>
            <input value={form.distance_km} onChange={e => setForm({...form, distance_km: e.target.value})}
              placeholder="e.g. 218" className="input-glass" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-navy flex-1 py-2.5 text-sm rounded-xl">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 py-2.5 text-sm rounded-xl font-bold">
            {saving ? 'Saving...' : 'Save Route'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function RoutesPage() {
  const [routes, setRoutes] = useState(MOCK);
  const [search, setSearch] = useState('');
  const [modal,  setModal]  = useState(false);

  useEffect(() => {
    getRoutesWithDetails()
      .then(r => {
        const raw = r.data?.routes;
        if (Array.isArray(raw) && raw.length) setRoutes(raw.map(normalizeRoute));
      })
      .catch(() => {});
  }, []);

  const filtered = routes.filter(r =>
    r.route_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.origin_station?.toLowerCase().includes(search.toLowerCase()) ||
    r.origin_city?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination_station?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination_city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (saved) => {
    setRoutes(prev => [...prev, normalizeRoute({ ...saved, route_id: Date.now() })]);
    setModal(false);
  };

  const handleDelete = async (route_id) => {
    if (!confirm('Delete this route?')) return;
    await deleteRoute(route_id).catch(() => {});
    setRoutes(prev => prev.filter(r => r.route_id !== route_id));
    toast.success('Route deleted');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">ROUTE MANAGEMENT</h1>
        </div>
        <button onClick={() => setModal(true)} className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> ADD ROUTE
        </button>
      </div>

      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search routes..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((r, i) => (
            <motion.div key={r.route_id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}}
              transition={{delay:i*0.05}}
              className="glass rounded-2xl p-5 border border-[rgba(0,229,255,0.08)] hover:border-[rgba(0,229,255,0.20)] transition-all group">

              <h3 className="text-white font-bold mb-3">{r.route_name}</h3>

              {/* Origin → Destination */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
                    <span className="text-slate-300 truncate">{r.origin_station}</span>
                  </div>
                  {r.origin_city && (
                    <span className="text-slate-500 text-xs ml-5">{r.origin_city}</span>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-[#00e5ff] flex-shrink-0 mx-1" />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#4ade80] flex-shrink-0" />
                    <span className="text-slate-300 truncate">{r.destination_station}</span>
                  </div>
                  {r.destination_city && (
                    <span className="text-slate-500 text-xs ml-5">{r.destination_city}</span>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mb-4">
                {r.distance_km && (
                  <div className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{background:'rgba(0,229,255,0.08)',border:'1px solid rgba(0,229,255,0.15)',color:'#00e5ff'}}>
                    {r.distance_km} km
                  </div>
                )}
                <div className="px-2.5 py-1 rounded-lg text-xs font-semibold ml-auto"
                  style={{background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.15)',color:'#c084fc'}}>
                  {r.trains} trains
                </div>
              </div>

              <button onClick={() => handleDelete(r.route_id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 w-full justify-center"
                style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171'}}>
                <Trash2 className="w-3 h-3" /> Delete Route
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal && <RouteModal onSave={handleSave} onClose={() => setModal(false)} />}
      </AnimatePresence>
    </div>
  );
}