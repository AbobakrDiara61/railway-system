import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Train, Clock, MapPin, Calendar, X } from 'lucide-react';
import { getJourneys, createJourney, updateJourney } from '../../api/journeys.api';
import { getTrains } from '../../api/trains.api';
import { getRoutes } from '../../api/routes.api';
import toast from 'react-hot-toast';

const MOCK = [
  { id:1, train:'Nile Express X1', route:'Cairo → Alexandria', departure:'2024-11-18 08:00', arrival:'2024-11-18 10:30', status:'Scheduled', seats:500 },
  { id:2, train:'Luxor Odyssey',   route:'Aswan → Luxor',      departure:'2024-10-25 21:00', arrival:'2024-10-26 06:00', status:'Active',    seats:350 },
  { id:3, train:'Hurghada Link',   route:'Cairo → Hurghada',   departure:'2024-09-29 11:00', arrival:'2024-09-29 15:30', status:'Completed', seats:480 },
  { id:4, train:'Delta Commuter',  route:'Cairo → Damietta',   departure:'2024-12-02 07:00', arrival:'2024-12-02 11:00', status:'Scheduled', seats:250 },
];

const STATUS_C = { Scheduled:'badge-info', Active:'badge-success', Completed:'badge-default', Cancelled:'badge-error' };

const BLANK = { train:'', route:'', departure:'', arrival:'', status:'Scheduled' };

function JourneyModal({ journey, onSave, onClose }) {
  const isEdit = !!journey?.id;
  const [form, setForm] = useState(journey || BLANK);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.train) { toast.error('Select a train'); return; }
    setSaving(true);
    try {
      if (isEdit) await updateJourney(form.id, form); else await createJourney(form);
      onSave(form);
      toast.success(`Journey ${isEdit ? 'updated' : 'created'}!`);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale:0.92 }} animate={{ scale:1 }} exit={{ scale:0.92 }}
        className="relative z-10 w-full max-w-md glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">{isEdit ? 'Edit Journey' : 'ADD JOURNEY'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label:'Train Name', key:'train', placeholder:'e.g. Nile Express X1' },
            { label:'Route',      key:'route', placeholder:'e.g. Cairo → Alexandria' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-slate-500 text-xs mb-1.5">{label}</label>
              <input value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}
                placeholder={placeholder} className="input-glass" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Departure</label>
              <input type="datetime-local" value={form.departure}
                onChange={e => setForm({...form,departure:e.target.value})} className="input-glass" />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Arrival</label>
              <input type="datetime-local" value={form.arrival}
                onChange={e => setForm({...form,arrival:e.target.value})} className="input-glass" />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm({...form,status:e.target.value})} className="input-glass">
              {['Scheduled','Active','Completed','Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-navy flex-1 py-2.5 text-sm rounded-xl">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 py-2.5 text-sm rounded-xl font-bold">
            {saving ? 'Saving...' : 'Save Journey'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function JourneysPage() {
  const [journeys, setJourneys] = useState(MOCK);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);

  useEffect(() => {
    getJourneys().then(r => { if(r.data?.length) setJourneys(r.data); }).catch(() => {});
  }, []);

  const filtered = journeys.filter(j =>
    j.train?.toLowerCase().includes(search.toLowerCase()) ||
    j.route?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (saved) => {
    setJourneys(prev => saved.id ? prev.map(j => j.id===saved.id ? {...j,...saved} : j) : [...prev,{...saved,id:Date.now()}]);
    setModal(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">JOURNEY MANAGEMENT</h1>
        </div>
        <button onClick={() => setModal(BLANK)} className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> ADD JOURNEY
        </button>
      </div>

      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search journeys..." value={search} onChange={e=>setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>
      </div>

      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">TRAIN</th>
              <th className="text-left">ROUTE</th>
              <th className="text-left">DEPARTURE</th>
              <th className="text-left">ARRIVAL</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((j, i) => (
                <motion.tr key={j.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.12)] flex items-center justify-center">
                        <Train className="w-4 h-4 text-[#00e5ff]" />
                      </div>
                      <span className="text-white font-semibold">{j.train}</span>
                    </div>
                  </td>
                  <td><span className="text-slate-300 text-sm">{j.route}</span></td>
                  <td><span className="text-slate-400 text-sm">{j.departure}</span></td>
                  <td><span className="text-slate-400 text-sm">{j.arrival}</span></td>
                  <td><span className={`badge ${STATUS_C[j.status]||'badge-default'}`}>{j.status}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(j)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                        style={{background:'rgba(0,229,255,0.08)',border:'1px solid rgba(0,229,255,0.2)',color:'#00e5ff'}}>
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setJourneys(p=>p.filter(x=>x.id!==j.id))}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                        style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171'}}>
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
        {modal !== null && <JourneyModal journey={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
