import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, X, Train, Check, ChevronDown } from 'lucide-react';
import { getTrains, createTrain, updateTrain, deleteTrain } from '../../api/trains.api';
import toast from 'react-hot-toast';

const MOCK_TRAINS = [
  { id:1, name:'Nile Express X1',     type:'Express',   status:'Active',  capacity:500 },
  { id:2, name:"Pharaoh's Regional",  type:'Regional',  status:'Active',  capacity:350 },
  { id:3, name:'Delta Star',          type:'Express',   status:'Active',  capacity:480 },
  { id:4, name:'Luxor Light',         type:'Regional',  status:'Delayed', capacity:250 },
  { id:5, name:'Cairo Commuter',      type:'Regional',  status:'Active',  capacity:400 },
];

const TYPE_OPTS   = ['Express', 'Regional', 'Intercity'];
const STATUS_OPTS = ['Active', 'Maintenance', 'Delayed', 'Inactive'];
const STATUS_C    = {
  Active:      'badge-success',
  Maintenance: 'badge-warning',
  Delayed:     'badge-warning',
  Inactive:    'badge-error',
};

const BLANK = { name:'', type:'Express', status:'Active', capacity:'', features:[] };
const FEATURES = ['Wi-Fi', 'Dining Car', 'Sleeper Cabins', 'Accessible'];

function TrainModal({ train, onSave, onClose }) {
  const isEdit = !!train?.id;
  const [form, setForm] = useState(train || BLANK);
  const [saving, setSaving] = useState(false);

  const toggle = (f) => setForm(p => ({
    ...p, features: p.features?.includes(f) ? p.features.filter(x=>x!==f) : [...(p.features||[]),f]
  }));

  const handleSave = async () => {
    if (!form.name) { toast.error('Train name is required'); return; }
    setSaving(true);
    try {
      if (isEdit) { await updateTrain(form.id, form); } else { await createTrain(form); }
      onSave(form);
      toast.success(`Train ${isEdit?'updated':'created'}!`);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
        className="relative z-10 w-full max-w-md glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]"
        style={{ boxShadow:'0 25px 60px rgba(0,0,0,0.6)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">{isEdit ? 'Edit Train' : 'ADD NEW TRAIN'}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-slate-500 text-xs mb-1.5">Train Name</label>
            <input value={form.name} onChange={e => setForm({...form,name:e.target.value})}
              placeholder="Enter train name..." className="input-glass" />
          </div>

          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Train Type</label>
            <select value={form.type} onChange={e => setForm({...form,type:e.target.value})}
              className="input-glass">
              {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}
              className="input-glass">
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-slate-500 text-xs mb-1.5">Capacity</label>
            <input type="number" value={form.capacity}
              onChange={e => setForm({...form,capacity:e.target.value})}
              placeholder="Enter capacity..." className="input-glass" />
          </div>

          <div className="col-span-2">
            <label className="block text-slate-500 text-xs mb-2">Features</label>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="checkbox-cyan"
                    checked={form.features?.includes(f)}
                    onChange={() => toggle(f)} />
                  <span className="text-slate-300 text-sm">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="btn-navy flex-1 py-2.5 text-sm rounded-xl font-semibold">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="btn-gold flex-1 py-2.5 text-sm rounded-xl font-bold">
            {saving ? 'Saving...' : 'SAVE TRAIN'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TrainsPage() {
  const [trains,  setTrains]  = useState(MOCK_TRAINS);
  const [search,  setSearch]  = useState('');
  const [typeF,   setTypeF]   = useState('All Types');
  const [statusF, setStatusF] = useState('All Status');
  const [modal,   setModal]   = useState(null); // null | {} | train object
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTrains().then(r => { if(r.data?.length) setTrains(r.data); }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const filtered = trains.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeF === 'All Types'   || t.type   === typeF;
    const matchStatus = statusF === 'All Status' || t.status === statusF;
    return matchSearch && matchType && matchStatus;
  });

  const handleSave = (saved) => {
    setTrains(prev => saved.id
      ? prev.map(t => t.id === saved.id ? {...t,...saved} : t)
      : [...prev, {...saved, id: Date.now()}]
    );
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this train?')) return;
    await deleteTrain(id).catch(()=>{});
    setTrains(prev => prev.filter(t => t.id !== id));
    toast.success('Train deleted');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Egyptian Railways Admin</div>
          <h1 className="text-3xl font-black text-white" style={{ textShadow:'0 0 30px rgba(245,158,11,0.3)' }}>
            ADMIN TRAIN MANAGEMENT
          </h1>
        </div>
        <button onClick={() => setModal(BLANK)}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> ADD TRAIN
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search Trains..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>

        <select value={typeF} onChange={e => setTypeF(e.target.value)} className="input-glass h-9 text-sm w-36">
          <option>All Types</option>
          {TYPE_OPTS.map(t => <option key={t}>{t}</option>)}
        </select>

        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="input-glass h-9 text-sm w-36">
          <option>All Status</option>
          {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
        </select>

        <button className="btn-cyan h-9 px-4 text-sm rounded-xl flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">NAME</th>
              <th className="text-left">TYPE</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">CAPACITY</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((t, i) => (
                <motion.tr key={t.id}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.12)] flex items-center justify-center">
                        <Train className="w-4 h-4 text-[#00e5ff]" />
                      </div>
                      <span className="text-white font-semibold">{t.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-slate-400 text-sm">{t.type}</span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_C[t.status] || 'badge-default'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-slate-300 text-sm">{t.capacity}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(t)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        style={{ background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)', color:'#00e5ff' }}>
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDelete(t.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-600">
                  No trains found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal !== null && (
          <TrainModal train={modal} onSave={handleSave} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
