import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Train, X, Armchair } from 'lucide-react';
import { getCarriages, createCarriage, deleteCarriage } from '../../api/carriages.api';
import { getTrains } from '../../api/trains.api';
import toast from 'react-hot-toast';

const MOCK = [
  { id:1, carriage_number:'A1', train:'Nile Express X1',   class:'Gold Class',   capacity:48, status:'Active'   },
  { id:2, carriage_number:'B1', train:'Nile Express X1',   class:'Silver Class', capacity:64, status:'Active'   },
  { id:3, carriage_number:'A1', train:'Luxor Odyssey',     class:'Sleeper',      capacity:24, status:'Active'   },
  { id:4, carriage_number:'B1', train:'Luxor Odyssey',     class:'Gold Class',   capacity:48, status:'Maintenance'},
  { id:5, carriage_number:'A1', train:"Pharaoh's Regional",'class':'Economy',   capacity:80, status:'Active'   },
  { id:6, carriage_number:'B1', train:"Pharaoh's Regional",'class':'Economy',   capacity:80, status:'Active'   },
];

const CLASS_C   = { 'Gold Class':'badge-gold', 'Silver Class':'badge-info', 'Sleeper':'badge-purple', 'Economy':'badge-default' };
const STATUS_C  = { Active:'badge-success', Maintenance:'badge-warning', Inactive:'badge-error' };
const BLANK     = { carriage_number:'', train:'', class:'Gold Class', capacity:48, status:'Active' };
const CLASSES   = ['Gold Class', 'Silver Class', 'Sleeper', 'Economy', 'Business'];

function CarriageModal({ onSave, onClose }) {
  const [form, setForm]   = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.carriage_number || !form.train) { toast.error('Number and train required'); return; }
    setSaving(true);
    try {
      await createCarriage(form);
      onSave(form);
      toast.success('Carriage created!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale:0.92 }} animate={{ scale:1 }} exit={{ scale:0.92 }}
        className="relative z-10 w-full max-w-sm glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">ADD CARRIAGE</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Carriage No.</label>
              <input value={form.carriage_number} onChange={e => setForm({...form, carriage_number: e.target.value})}
                placeholder="e.g. A1" className="input-glass font-mono" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Capacity</label>
              <input type="number" min={1} value={form.capacity}
                onChange={e => setForm({...form, capacity: e.target.value})} className="input-glass" />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Train</label>
            <input value={form.train} onChange={e => setForm({...form, train: e.target.value})}
              placeholder="Train name" className="input-glass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Class</label>
              <select value={form.class} onChange={e => setForm({...form, class: e.target.value})} className="input-glass">
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
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
            {saving ? 'Saving...' : 'Save Carriage'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CarriagesPage() {
  const [carriages, setCarriages] = useState(MOCK);
  const [search, setSearch]       = useState('');
  const [classF, setClassF]       = useState('All Classes');
  const [modal,  setModal]        = useState(false);

  useEffect(() => {
    getCarriages().then(r => { if(r.data?.length) setCarriages(r.data); }).catch(() => {});
  }, []);

  const filtered = carriages.filter(c => {
    const matchSearch = c.train?.toLowerCase().includes(search.toLowerCase()) ||
                        c.carriage_number?.toLowerCase().includes(search.toLowerCase());
    const matchClass  = classF === 'All Classes' || c.class === classF;
    return matchSearch && matchClass;
  });

  const handleSave = (saved) => {
    setCarriages(prev => [...prev, { ...saved, id: Date.now() }]);
    setModal(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this carriage?')) return;
    await deleteCarriage(id).catch(() => {});
    setCarriages(prev => prev.filter(c => c.id !== id));
    toast.success('Carriage deleted');
  };

  // Summary stats
  const totalSeats = carriages.reduce((s, c) => s + (Number(c.capacity) || 0), 0);
  const activeCount = carriages.filter(c => c.status === 'Active').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">CARRIAGE MANAGEMENT</h1>
        </div>
        <button onClick={() => setModal(true)} className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> ADD CARRIAGE
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:'Total Carriages', value: carriages.length, color:'#00e5ff' },
          { label:'Total Seats',     value: totalSeats,        color:'#f59e0b' },
          { label:'Active',          value: activeCount,       color:'#4ade80' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="glass rounded-xl p-4 border border-[rgba(0,229,255,0.08)]">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search carriages..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>
        <select value={classF} onChange={e => setClassF(e.target.value)} className="input-glass h-9 text-sm w-40">
          <option>All Classes</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">CARRIAGE</th>
              <th className="text-left">TRAIN</th>
              <th className="text-left">CLASS</th>
              <th className="text-left">CAPACITY</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(168,85,247,0.10)] border border-[rgba(168,85,247,0.20)] flex items-center justify-center">
                        <Armchair className="w-4 h-4 text-[#c084fc]" />
                      </div>
                      <span className="text-white font-mono font-bold">{c.carriage_number}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                      <Train className="w-3.5 h-3.5 text-[#00e5ff]" /> {c.train}
                    </div>
                  </td>
                  <td><span className={`badge ${CLASS_C[c.class] || 'badge-default'}`}>{c.class}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">{c.capacity}</span>
                      <span className="text-slate-600 text-xs">seats</span>
                    </div>
                  </td>
                  <td><span className={`badge ${STATUS_C[c.status] || 'badge-default'}`}>{c.status}</span></td>
                  <td>
                    <button onClick={() => handleDelete(c.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                      style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-slate-600">No carriages found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal && <CarriageModal onSave={handleSave} onClose={() => setModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
