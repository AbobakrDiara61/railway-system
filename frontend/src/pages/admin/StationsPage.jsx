import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, MapPin, X } from 'lucide-react';
import { getStations, createStation, updateStation, deleteStation } from '../../api/stations.api';
import toast from 'react-hot-toast';

const MOCK = [
  { station_id:1, station_name:'Cairo Ramses',         city:'Cairo',       state:'Cairo Governorate',        code:'CAI', platform:12, status:'Active'      },
  { station_id:2, station_name:'Alexandria Sidi Gaber', city:'Alexandria',  state:'Alexandria Governorate',   code:'ALX', platform:8,  status:'Active'      },
  { station_id:3, station_name:'Luxor Station',         city:'Luxor',       state:'Luxor Governorate',        code:'LXR', platform:4,  status:'Active'      },
  { station_id:4, station_name:'Aswan Station',         city:'Aswan',       state:'Aswan Governorate',        code:'ASW', platform:3,  status:'Active'      },
  { station_id:5, station_name:'Hurghada Terminal',     city:'Hurghada',    state:'Red Sea Governorate',      code:'HRG', platform:2,  status:'Maintenance' },
  { station_id:6, station_name:'Damietta Central',      city:'Damietta',    state:'Damietta Governorate',     code:'DMT', platform:4,  status:'Active'      },
];

const STATUS_C = { Active:'badge-success', Maintenance:'badge-warning', Inactive:'badge-error' };

const BLANK = { station_name:'', city:'', state:'', code:'', platform:1, status:'Active' };

// Normalize API station to ensure required UI fields exist
const normalizeStation = (s) => ({
  station_id:   s.station_id,
  station_name: s.station_name  ?? '',
  city:         s.city          ?? '',
  state:        s.state         ?? '',
  code:         s.code          ?? '',
  platform:     s.platform      ?? '—',
  status:       s.status        ?? 'Active',
});

function StationModal({ station, onSave, onClose }) {
  const isEdit = !!station?.station_id;
  const [form, setForm] = useState(station ?? BLANK);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.station_name || !form.city) { toast.error('Name and city are required'); return; }
    setSaving(true);
    try {
      if (isEdit) await updateStation(form); else await createStation(form);
      onSave(form);
      toast.success(`Station ${isEdit ? 'updated' : 'created'}!`);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{scale:0.92}} animate={{scale:1}} exit={{scale:0.92}}
        className="relative z-10 w-full max-w-sm glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">{isEdit ? 'Edit Station' : 'ADD STATION'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Station Name</label>
            <input value={form.station_name} onChange={e => setForm({...form, station_name: e.target.value})}
              placeholder="e.g. Cairo Ramses" className="input-glass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">City</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                placeholder="Cairo" className="input-glass" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Code</label>
              <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase().slice(0,3)})}
                placeholder="CAI" className="input-glass font-mono" maxLength={3} />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 text-xs mb-1.5">State / Governorate</label>
            <input value={form.state} onChange={e => setForm({...form, state: e.target.value})}
              placeholder="Cairo Governorate" className="input-glass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Platforms</label>
              <input type="number" min={1} value={form.platform}
                onChange={e => setForm({...form, platform: e.target.value})} className="input-glass" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-glass">
                {['Active','Maintenance','Inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-navy flex-1 py-2.5 text-sm rounded-xl">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 py-2.5 text-sm rounded-xl font-bold">
            {saving ? 'Saving...' : 'Save Station'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function StationsPage() {
  const [stations, setStations] = useState(MOCK);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);

  useEffect(() => {
    getStations()
      .then(r => {
        const raw = r.data?.stations;
        if (Array.isArray(raw) && raw.length) setStations(raw.map(normalizeStation));
      })
      .catch(console.error);
  }, []);

  const filtered = stations.filter(s =>
    s.station_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase()) ||
    s.code?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (saved) => {
    setStations(prev =>
      saved.station_id
        ? prev.map(s => s.station_id === saved.station_id ? {...s, ...saved} : s)
        : [...prev, normalizeStation({...saved, station_id: Date.now()})]
    );
    setModal(null);
  };

  const handleDelete = async (station_id) => {
    if (!confirm('Delete this station?')) return;
    try {
      await deleteStation(station_id);
      setStations(prev => prev.filter(s => s.station_id !== station_id));
      toast.success('Station deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete station');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">STATION MANAGEMENT</h1>
        </div>
        <button onClick={() => setModal(BLANK)} className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> ADD STATION
        </button>
      </div>

      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search stations..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>
      </div>

      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">STATION</th>
              <th className="text-left">CODE</th>
              <th className="text-left">CITY</th>
              <th className="text-left">STATE</th>
              <th className="text-left">PLATFORMS</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((s, i) => (
                <motion.tr key={s.station_id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)] flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#f59e0b]" />
                      </div>
                      <span className="text-white font-semibold">{s.station_name}</span>
                    </div>
                  </td>
                  <td>
                    {s.code ? (
                      <span className="font-mono text-sm px-2 py-0.5 rounded-md"
                        style={{background:'rgba(0,229,255,0.08)', color:'#00e5ff'}}>
                        {s.code}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-sm">—</span>
                    )}
                  </td>
                  <td><span className="text-slate-400 text-sm">{s.city}</span></td>
                  <td><span className="text-slate-500 text-sm">{s.state || '—'}</span></td>
                  <td><span className="text-slate-300">{s.platform}</span></td>
                  <td><span className={`badge ${STATUS_C[s.status] ?? 'badge-default'}`}>{s.status}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                        style={{background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)', color:'#00e5ff'}}>
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDelete(s.station_id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                        style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171'}}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal !== null && <StationModal station={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}