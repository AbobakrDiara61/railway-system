import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Train, X, Armchair } from 'lucide-react';
import { getCarriages, createCarriage, deleteCarriage } from '../../api/carriages.api';
import { getTrains } from '../../api/trains.api';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MOCK = [
  { carriage_id: 1, carriage_number: 'A1', train_id: 1, class: 'gold class',   capacity: 48 },
  { carriage_id: 2, carriage_number: 'B1', train_id: 1, class: 'silver class', capacity: 64 },
  { carriage_id: 3, carriage_number: 'A1', train_id: 2, class: 'sleeper',      capacity: 24 },
  { carriage_id: 4, carriage_number: 'B1', train_id: 2, class: 'gold class',   capacity: 48 },
  { carriage_id: 5, carriage_number: 'A1', train_id: 3, class: 'economy',      capacity: 80 },
  { carriage_id: 6, carriage_number: 'B1', train_id: 3, class: 'economy',      capacity: 80 },
];

const CLASSES = ['Gold Class', 'Silver Class', 'Sleeper', 'Economy', 'Business'];

// Normalise API class strings (lowercase) → display labels
const formatClass = (raw = '') =>
  raw.replace(/\b\w/g, (c) => c.toUpperCase());

// Badge colours — keys are lowercase for easy matching
const CLASS_BADGE = {
  'gold class':   'badge-gold',
  'silver class': 'badge-info',
  'sleeper':      'badge-purple',
  'economy':      'badge-default',
  'business':     'badge-success',
};

const BLANK_FORM = {
  carriage_number: '',
  train_id: '',
  class: 'economy',
  capacity: 48,
};

// ---------------------------------------------------------------------------
// CarriageModal
// ---------------------------------------------------------------------------

function CarriageModal({ trains = [], onSave, onClose }) {
  const [form, setForm]     = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.carriage_number) { toast.error('Carriage number is required'); return; }
    if (!form.train_id)        { toast.error('Train is required');            return; }

    setSaving(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      const created = await createCarriage(payload);
      onSave(created ?? payload);
      toast.success('Carriage created!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        className="relative z-10 w-full max-w-sm glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">ADD CARRIAGE</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Carriage No.</label>
              <input
                value={form.carriage_number}
                onChange={(e) => set('carriage_number', e.target.value)}
                placeholder="e.g. A1"
                className="input-glass font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Capacity</label>
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                className="input-glass"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Train</label>
            {trains.length > 0 ? (
              <select
                value={form.train_id}
                onChange={(e) => set('train_id', e.target.value)}
                className="input-glass"
              >
                <option value="">Select a train…</option>
                {trains.map((t) => (
                  <option key={t.train_id} value={t.train_id}>
                    {t.name ?? `Train #${t.train_id}`}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={form.train_id}
                onChange={(e) => set('train_id', e.target.value)}
                placeholder="Train ID"
                className="input-glass"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Class</label>
              <select
                value={form.class}
                onChange={(e) => set('class', e.target.value)}
                className="input-glass"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-navy flex-1 py-2.5 text-sm rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold flex-1 py-2.5 text-sm rounded-xl font-bold"
          >
            {saving ? 'Saving…' : 'Save Carriage'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// CarriagesPage
// ---------------------------------------------------------------------------

export function CarriagesPage() {
  const [carriages, setCarriages] = useState(MOCK);
  // trainMap: { [train_id]: trainName }
  const [trainMap,  setTrainMap]  = useState({});
  const [trains,    setTrains]    = useState([]);
  const [search,    setSearch]    = useState('');
  const [classF,    setClassF]    = useState('All Classes');
  const [modal,     setModal]     = useState(false);
  const [loading,   setLoading]   = useState(true);

  // ── Fetch trains first, then carriages ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 1. Trains — build an id→name lookup
        const trainRes = await getTrains();
        const trainList = trainRes?.data?.data ?? trainRes?.data ?? [];
        setTrains(trainList);
        const map = Object.fromEntries(
          trainList.map((t) => [t.train_id, t.name ?? `Train #${t.train_id}`])
        );
        setTrainMap(map);

        // 2. Carriages
        const carriageRes = await getCarriages();
        const carriageList = carriageRes?.data?.data ?? carriageRes?.data ?? [];
        if (carriageList.length) setCarriages(carriageList);
      } catch (err) {
        console.error('Failed to load data:', err);
        // Falls back to MOCK data already in state
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── Helper: resolve train name from id ──────────────────────────────────
  const resolveTrainName = useCallback(
    (train_id) => trainMap[train_id] ?? (train_id ? `Train #${train_id}` : '—'),
    [trainMap]
  );

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = carriages.filter((c) => {
    const trainName  = resolveTrainName(c.train_id).toLowerCase();
    const carNum     = (c.carriage_number ?? '').toLowerCase();
    const query      = search.toLowerCase();
    const matchSearch = trainName.includes(query) || carNum.includes(query);
    const matchClass  =
      classF === 'All Classes' ||
      (c.class ?? '').toLowerCase() === classF.toLowerCase();
    return matchSearch && matchClass;
  });

  // ── CRUD handlers ────────────────────────────────────────────────────────
  const handleSave = (saved) => {
    setCarriages((prev) => [
      ...prev,
      { ...saved, carriage_id: saved.carriage_id ?? Date.now() },
    ]);
    setModal(false);
  };

  const handleDelete = async (carriage_id) => {
    if (!confirm('Delete this carriage?')) return;
    try {
      await deleteCarriage(carriage_id);
    } catch {
      // Optimistic — continue even if API fails
    }
    setCarriages((prev) => prev.filter((c) => c.carriage_id !== carriage_id));
    toast.success('Carriage deleted');
  };

  // ── Summary stats ────────────────────────────────────────────────────────
  const totalSeats  = carriages.reduce((s, c) => s + (Number(c.capacity) || 0), 0);
  // API has no status field; count carriages with a defined carriage_id as "active"
  const activeCount = carriages.filter((c) => c.carriage_id != null).length;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">
            Admin Panel
          </div>
          <h1 className="text-3xl font-black text-white">CARRIAGE MANAGEMENT</h1>
        </div>
        <button
          onClick={() => setModal(true)}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD CARRIAGE
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Carriages', value: carriages.length, color: '#00e5ff' },
          { label: 'Total Seats',     value: totalSeats,        color: '#f59e0b' },
          { label: 'Active',          value: activeCount,       color: '#4ade80' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-xl p-4 border border-[rgba(0,229,255,0.08)]"
          >
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
              {s.label}
            </div>
            <div className="text-3xl font-black" style={{ color: s.color }}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by carriage or train…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm"
          />
        </div>
        <select
          value={classF}
          onChange={(e) => setClassF(e.target.value)}
          className="input-glass h-9 text-sm w-44"
        >
          <option>All Classes</option>
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
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
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  Loading carriages…
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filtered.map((c, i) => {
                  const classKey   = (c.class ?? '').toLowerCase();
                  const badgeClass = CLASS_BADGE[classKey] ?? 'badge-default';

                  return (
                    <motion.tr
                      key={c.carriage_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Carriage number */}
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(168,85,247,0.10)] border border-[rgba(168,85,247,0.20)] flex items-center justify-center">
                            <Armchair className="w-4 h-4 text-[#c084fc]" />
                          </div>
                          <span className="text-white font-mono font-bold">
                            {c.carriage_number ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Train name resolved from train_id */}
                      <td>
                        <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                          <Train className="w-3.5 h-3.5 text-[#00e5ff]" />
                          {resolveTrainName(c.train_id)}
                        </div>
                      </td>

                      {/* Class */}
                      <td>
                        <span className={`badge ${badgeClass}`}>
                          {formatClass(c.class) || '—'}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-bold">
                            {c.capacity ?? '—'}
                          </span>
                          {c.capacity != null && (
                            <span className="text-slate-600 text-xs">seats</span>
                          )}
                        </div>
                      </td>

                      {/* Delete */}
                      <td>
                        <button
                          onClick={() => handleDelete(c.carriage_id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                          style={{
                            background: 'rgba(239,68,68,0.08)',
                            border:     '1px solid rgba(239,68,68,0.2)',
                            color:      '#f87171',
                          }}
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-600">
                  No carriages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <CarriageModal
            trains={trains}
            onSave={handleSave}
            onClose={() => setModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}