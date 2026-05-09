import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, MapPin, ArrowRight, X } from 'lucide-react';
import { getRoutes, createRoute, deleteRoute } from '../../api/routes.api';
import { getStations } from '../../api/stations.api';
import toast from 'react-hot-toast';

const MOCK = [
  { id:1, name:'Cairo–Alexandria Main',  from:'Cairo (Ramses)',       to:'Alexandria (Sidi Gaber)', distance:'218 km', duration:'2h 30m', trains:6 },
  { id:2, name:'Nile Valley Express',    from:'Cairo (Ramses)',       to:'Luxor',                   distance:'676 km', duration:'9h 00m', trains:3 },
  { id:3, name:'Upper Egypt Link',       from:'Luxor',                to:'Aswan',                   distance:'215 km', duration:'3h 20m', trains:4 },
  { id:4, name:'Red Sea Corridor',       from:'Cairo (Ain Shams)',    to:'Hurghada',                distance:'490 km', duration:'6h 00m', trains:2 },
  { id:5, name:'Delta Northern Line',    from:'Cairo (Ramses)',       to:'Damietta',                distance:'205 km', duration:'4h 00m', trains:5 },
];

function RouteModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name:'', from:'', to:'', distance:'', duration:'' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.from || !form.to) { toast.error('Select origin and destination'); return; }
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
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Cairo–Alexandria Main" className="input-glass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Origin</label>
              <input value={form.from} onChange={e=>setForm({...form,from:e.target.value})} placeholder="From station" className="input-glass" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Destination</label>
              <input value={form.to} onChange={e=>setForm({...form,to:e.target.value})} placeholder="To station" className="input-glass" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Distance (km)</label>
              <input value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})} placeholder="e.g. 218 km" className="input-glass" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Duration</label>
              <input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="e.g. 2h 30m" className="input-glass" />
            </div>
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
    getRoutes().then(r => { if(r.data?.length) setRoutes(r.data); }).catch(() => {});
  }, []);

  const filtered = routes.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.from?.toLowerCase().includes(search.toLowerCase()) ||
    r.to?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (saved) => {
    setRoutes(prev => [...prev, { ...saved, id: Date.now(), trains: 0 }]);
    setModal(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this route?')) return;
    await deleteRoute(id).catch(() => {});
    setRoutes(prev => prev.filter(r => r.id !== id));
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
          <input type="text" placeholder="Search routes..." value={search} onChange={e=>setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>
      </div>

      {/* Route cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}}
              transition={{delay:i*0.05}}
              className="glass rounded-2xl p-5 border border-[rgba(0,229,255,0.08)] hover:border-[rgba(0,229,255,0.20)] transition-all group">
              {/* Route name */}
              <h3 className="text-white font-bold mb-3">{r.name}</h3>

              {/* From → To */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span className="text-slate-300">{r.from}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00e5ff] flex-shrink-0" />
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#4ade80]" />
                  <span className="text-slate-300">{r.to}</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{background:'rgba(0,229,255,0.08)',border:'1px solid rgba(0,229,255,0.15)',color:'#00e5ff'}}>
                  {r.distance}
                </div>
                <div className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.15)',color:'#f59e0b'}}>
                  {r.duration}
                </div>
                <div className="px-2.5 py-1 rounded-lg text-xs font-semibold ml-auto"
                  style={{background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.15)',color:'#c084fc'}}>
                  {r.trains} trains
                </div>
              </div>

              <button onClick={() => handleDelete(r.id)}
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
