import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Train, X } from 'lucide-react';
import { getJourneysWithTrains, createJourney, updateJourney } from '../../api/journeys.api';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CLASSES = {
  scheduled: 'badge-info',
  active:    'badge-success',
  completed: 'badge-default',
  cancelled: 'badge-error',
};

const STATUSES = ['scheduled', 'active', 'completed', 'cancelled'];

/** Fields the API accepts on create / update */
const BLANK_FORM = {
  train_id:            '',
  route_id:            '',
  departure_date_time: '',
  arrival_date_time:   '',
  status:              'scheduled',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely format an ISO date string for display. */
const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

/** Convert an ISO string to the value expected by <input type="datetime-local">. */
const isoToLocal = (iso) => {
  if (!iso) return '';
  try {
    // "2025-08-05T05:00:00.000Z" → "2025-08-05T05:00"
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

/** Build the editable form state from a journey object coming from the API. */
const journeyToForm = (journey) => ({
  train_id:            journey?.train_id            ?? '',
  route_id:            journey?.route_id            ?? '',
  departure_date_time: isoToLocal(journey?.departure_date_time),
  arrival_date_time:   isoToLocal(journey?.arrival_date_time),
  status:              journey?.status              ?? 'scheduled',
});

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

function JourneyModal({ journey, onSave, onClose }) {
  const isEdit = !!journey?.journey_id;

  const [form, setForm]     = useState(() => isEdit ? journeyToForm(journey) : { ...BLANK_FORM });
  const [saving, setSaving] = useState(false);

  const set = useCallback((key, value) => setForm(prev => ({ ...prev, [key]: value })), []);

  const handleSave = async () => {
    if (!form.train_id) { toast.error('Train ID is required'); return; }
    if (!form.route_id) { toast.error('Route ID is required'); return; }

    // Build ISO strings back from datetime-local values
    const payload = {
      train_id:            Number(form.train_id),
      route_id:            Number(form.route_id),
      departure_date_time: form.departure_date_time ? new Date(form.departure_date_time).toISOString() : '',
      arrival_date_time:   form.arrival_date_time   ? new Date(form.arrival_date_time).toISOString()   : '',
      status:              form.status,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateJourney(journey.journey_id, payload);
      } else {
        await createJourney(payload);
      }
      onSave({ ...journey, ...payload });
      toast.success(`Journey ${isEdit ? 'updated' : 'created'}!`);
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
        className="relative z-10 w-full max-w-md glass rounded-2xl p-6 border border-[rgba(0,229,255,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">
            {isEdit ? 'Edit Journey' : 'ADD JOURNEY'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Read-only info (edit mode only) */}
        {isEdit && (journey?.train_number || journey?.driver_name) && (
          <div className="mb-4 p-3 rounded-xl bg-white/5 border border-[rgba(0,229,255,0.08)] text-xs text-slate-400 space-y-1">
            {journey.train_number && (
              <p><span className="text-slate-500">Train #:</span> {journey.train_number} — {journey.type ?? ''}</p>
            )}
            {journey.driver_name && (
              <p><span className="text-slate-500">Driver:</span> {journey.driver_name}</p>
            )}
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Train ID</label>
              <input
                type="number" min="1"
                value={form.train_id}
                onChange={e => set('train_id', e.target.value)}
                placeholder="e.g. 1"
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Route ID</label>
              <input
                type="number" min="1"
                value={form.route_id}
                onChange={e => set('route_id', e.target.value)}
                placeholder="e.g. 2"
                className="input-glass"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Departure</label>
              <input
                type="datetime-local"
                value={form.departure_date_time}
                onChange={e => set('departure_date_time', e.target.value)}
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1.5">Arrival</label>
              <input
                type="datetime-local"
                value={form.arrival_date_time}
                onChange={e => set('arrival_date_time', e.target.value)}
                className="input-glass"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 text-xs mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="input-glass capitalize"
            >
              {STATUSES.map(s => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
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
            {saving ? 'Saving…' : 'Save Journey'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function JourneysPage() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null); // null | BLANK_FORM | journey object

  // Fetch on mount
  useEffect(() => {
    setLoading(true);
    getJourneysWithTrains()
      .then(r => {
        const data = r?.data?.data;
        if (Array.isArray(data) && data.length) setJourneys(data);
      })
      .catch(() => toast.error('Failed to load journeys'))
      .finally(() => setLoading(false));
  }, []);

  // Merge saved journey back into state
  const handleSave = useCallback((saved) => {
    setJourneys(prev =>
      saved.journey_id
        ? prev.map(j => j.journey_id === saved.journey_id ? { ...j, ...saved } : j)
        : [...prev, { ...saved, journey_id: Date.now() }]
    );
    setModal(null);
  }, []);

  const handleDelete = useCallback((journey_id) => {
    setJourneys(prev => prev.filter(j => j.journey_id !== journey_id));
  }, []);

  // Filter by train number or status
  const filtered = journeys.filter(j => {
    const q = search.toLowerCase();
    return (
      (j.train_number ?? '').toLowerCase().includes(q) ||
      (j.status       ?? '').toLowerCase().includes(q) ||
      (j.driver_name  ?? '').toLowerCase().includes(q) ||
      String(j.route_id ?? '').includes(q)
    );
  });

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">JOURNEY MANAGEMENT</h1>
        </div>
        <button
          onClick={() => setModal({ ...BLANK_FORM })}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD JOURNEY
        </button>
      </div>

      {/* Search bar */}
      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by train, driver, route ID or status…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">TRAIN</th>
              <th className="text-left">TYPE</th>
              <th className="text-left">DRIVER</th>
              <th className="text-left">DEPARTURE</th>
              <th className="text-left">ARRIVAL</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-10">Loading…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-10">No journeys found.</td>
              </tr>
            ) : (
              <AnimatePresence>
                {filtered.map((j, i) => {
                  const statusKey   = (j.status ?? '').toLowerCase();
                  const badgeClass  = STATUS_CLASSES[statusKey] ?? 'badge-default';

                  return (
                    <motion.tr
                      key={j.journey_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Train */}
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.12)] flex items-center justify-center">
                            <Train className="w-4 h-4 text-[#00e5ff]" />
                          </div>
                          <div>
                            <span className="text-white font-semibold block leading-tight">
                              {j.train_number ?? `Train #${j.train_id}`}
                            </span>
                            <span className="text-slate-500 text-xs">ID: {j.train_id ?? '—'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className="text-slate-300 text-sm">{j.type ?? '—'}</span>
                      </td>

                      {/* Driver */}
                      <td>
                        <span className="text-slate-300 text-sm">{j.driver_name ?? '—'}</span>
                      </td>

                      {/* Departure */}
                      <td>
                        <span className="text-slate-400 text-sm">{formatDateTime(j.departure_date_time)}</span>
                      </td>

                      {/* Arrival */}
                      <td>
                        <span className="text-slate-400 text-sm">{formatDateTime(j.arrival_date_time)}</span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`badge ${badgeClass} capitalize`}>{j.status ?? '—'}</span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal(j)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(j.journey_id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal !== null && (
          <JourneyModal
            journey={modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}