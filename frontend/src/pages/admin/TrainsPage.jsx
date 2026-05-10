import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Edit, Trash2, Train,
  Users, BarChart3, Activity, ChevronRight, Hash,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  getTrains,
  getTrainsWithJourneys,
  getTrainCapacity,
  getTrainCounts,
  createTrain,
  updateTrain,
  deleteTrain,
} from '../../api/trains.api';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────────────
const TYPE_OPTS   = ['Express', 'Intercity', 'Local', 'Sleeper'];
const STATUS_OPTS = ['active', 'maintenance', 'delayed', 'inactive'];

const STATUS_LABEL = {
  active:      'Active',
  maintenance: 'Maintenance',
  delayed:     'Delayed',
  inactive:    'Inactive',
};

const STATUS_C = {
  active:      'badge-success',
  maintenance: 'badge-warning',
  delayed:     'badge-warning',
  inactive:    'badge-error',
};

const TYPE_COLORS  = ['#00e5ff', '#f59e0b', '#a78bfa', '#34d399'];
const STATUS_COLORS = { active: '#34d399', maintenance: '#f59e0b', delayed: '#fb923c', inactive: '#f87171' };

const BLANK = { train_number: '', type: 'Express', status: 'active', driver_name: '' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const safeStr  = (v) => (v == null ? '—' : String(v));
const fmtDate  = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-EG', { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return iso; }
};

// ─── Edit / Create Modal ──────────────────────────────────────────────────────
function TrainFormModal({ train, onSave, onClose }) {
  const isEdit = !!train?.train_id;
  const [form, setForm]   = useState({
    train_id:     train?.train_id     ?? null,
    train_number: train?.train_number ?? '',
    type:         train?.type         ?? 'Express',
    status:       train?.status       ?? 'active',
    driver_name:  train?.driver_name  ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.train_number.trim()) { toast.error('Train number is required'); return; }
    setSaving(true);
    try {
      if (isEdit) { await updateTrain(form.train_id, form); }
      else         { await createTrain(form); }
      onSave(form);
      toast.success(`Train ${isEdit ? 'updated' : 'created'}!`);
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={isEdit ? 'Edit Train' : 'Add New Train'} size="md">
      <div className="grid grid-cols-2 gap-4">
        {/* Train Number */}
        <div className="col-span-2">
          <label className="block text-slate-500 text-xs mb-1.5">Train Number</label>
          <input
            value={form.train_number}
            onChange={e => setForm(p => ({ ...p, train_number: e.target.value }))}
            placeholder="e.g. TR-101"
            className="input-glass w-full"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            className="input-glass w-full"
          >
            {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
            className="input-glass w-full"
          >
            {STATUS_OPTS.map(s => (
              <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>
            ))}
          </select>
        </div>

        {/* Driver */}
        <div className="col-span-2">
          <label className="block text-slate-500 text-xs mb-1.5">Driver Name</label>
          <input
            value={form.driver_name}
            onChange={e => setForm(p => ({ ...p, driver_name: e.target.value }))}
            placeholder="e.g. Ahmed Kamal"
            className="input-glass w-full"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onClose} className="btn-navy flex-1 py-2.5 text-sm rounded-xl font-semibold">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 py-2.5 text-sm rounded-xl font-bold">
          {saving ? 'Saving…' : 'SAVE TRAIN'}
        </button>
      </div>
    </Modal>
  );
}

// ─── Journey Detail Modal ─────────────────────────────────────────────────────
function JourneyDetailModal({ train, journey, capacity, onClose }) {
  const cap = capacity ?? {};

  const infoRow = (label, value) => (
    <div className="flex items-start justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-slate-500 text-xs uppercase tracking-wide">{label}</span>
      <span className="text-slate-200 text-sm font-medium text-right max-w-[55%]">{value}</span>
    </div>
  );

  return (
    <Modal isOpen onClose={onClose} title="Train Details" size="lg">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Left – Train info */}
        <div>
          {/* Hero badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.15)] flex items-center justify-center">
              <Train className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">
                {safeStr(train?.train_number)}
              </div>
              <span className={`badge ${STATUS_C[train?.status] ?? 'badge-default'} mt-0.5`}>
                {STATUS_LABEL[train?.status] ?? safeStr(train?.status)}
              </span>
            </div>
          </div>

          <div className="bg-white/3 rounded-xl p-4 mb-4 border border-white/5">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Train Info</p>
            {infoRow('Train ID',    safeStr(train?.train_id))}
            {infoRow('Type',        safeStr(train?.type))}
            {infoRow('Driver',      safeStr(train?.driver_name))}
            {infoRow('Created At',  fmtDate(train?.created_at))}
          </div>

          <div className="bg-white/3 rounded-xl p-4 border border-white/5">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Capacity</p>
            {infoRow('Carriages',   safeStr(cap['Number of Carriages']))}
            {infoRow('Total Seats', safeStr(cap['Total Seats (MAX Capacity) per train']))}
          </div>
        </div>

        {/* Right – Journey info */}
        <div>
          {journey ? (
            <div className="bg-white/3 rounded-xl p-4 border border-white/5 h-full">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Current Journey</p>

              {/* Route visual */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 text-center">
                  <div className="text-[#00e5ff] text-xs mb-1">FROM</div>
                  <div className="text-white font-semibold text-sm">{safeStr(journey.origin)}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <div className="flex-1 text-center">
                  <div className="text-[#f59e0b] text-xs mb-1">TO</div>
                  <div className="text-white font-semibold text-sm">{safeStr(journey.destination)}</div>
                </div>
              </div>

              {infoRow('Route',       safeStr(journey.route_name))}
              {infoRow('Distance',    journey.distance_km ? `${journey.distance_km} km` : '—')}
              {infoRow('Departure',   fmtDate(journey.departure_date_time))}
              {infoRow('Arrival',     fmtDate(journey.arrival_date_time))}
              {infoRow('Journey ID',  safeStr(journey.journey_id))}
            </div>
          ) : (
            <div className="bg-white/3 rounded-xl p-4 border border-white/5 h-full flex flex-col items-center justify-center gap-3 text-slate-600">
              <Activity className="w-8 h-8" />
              <p className="text-sm">No active journey</p>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = '#00e5ff' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 border border-[rgba(0,229,255,0.08)] flex items-center gap-4"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}14`, border: `1px solid ${accent}30` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-slate-500 text-xs">{label}</div>
        <div className="text-white font-bold text-xl leading-tight">{value ?? '—'}</div>
      </div>
    </motion.div>
  );
}

// ─── Custom Pie Tooltip ───────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs text-white border border-white/10" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <span className="font-semibold">{payload[0].name}</span>: {payload[0].value}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export function TrainsPage() {
  const [trains,    setTrains]    = useState([]);
  const [journeys,  setJourneys]  = useState([]);   // from getTrainsWithJourneys
  const [capacity,  setCapacity]  = useState([]);   // from getTrainCapacity
  const [counts,    setCounts]    = useState(null);  // from getTrainCounts
  const [search,    setSearch]    = useState('');
  const [typeF,     setTypeF]     = useState('All');
  const [statusF,   setStatusF]   = useState('All');
  const [loading,   setLoading]   = useState(true);

  // modal state
  const [editModal,   setEditModal]   = useState(null);   // null | train obj
  const [detailModal, setDetailModal] = useState(null);   // null | train obj

  // ── Fetch all data in parallel ───────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      getTrains(),
      getTrainsWithJourneys(),
      getTrainCapacity(),
      getTrainCounts(),
    ]).then(([tr, jr, cap, cnt]) => {
      if (tr.status  === 'fulfilled') setTrains(tr.value?.data?.data   ?? tr.value?.data   ?? []);
      if (jr.status  === 'fulfilled') setJourneys(jr.value?.data?.data ?? jr.value?.data   ?? []);
      if (cap.status === 'fulfilled') setCapacity(cap.value?.data?.data ?? cap.value?.data ?? []);
      if (cnt.status === 'fulfilled') setCounts(cnt.value?.data?.data   ?? cnt.value?.data ?? null);
    }).finally(() => setLoading(false));
  }, []);

  // ── Build lookup maps ────────────────────────────────────────────────────
  const journeyMap  = useMemo(() => {
    const m = {};
    journeys.forEach(j => { if (j.train_id) m[j.train_id] = j; });
    return m;
  }, [journeys]);

  const capacityMap = useMemo(() => {
    const m = {};
    capacity.forEach(c => { if (c.train_id) m[c.train_id] = c; });
    return m;
  }, [capacity]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalSeats = useMemo(
    () => capacity.reduce((s, c) => s + (parseInt(c['Total Seats (MAX Capacity) per train'], 10) || 0), 0),
    [capacity]
  );

  // ── Chart data ───────────────────────────────────────────────────────────
  const typePieData = useMemo(() =>
    (counts?.trainsTypeCounts ?? []).map((t, i) => ({
      name:  t.type,
      value: t.Number ?? 0,
      color: TYPE_COLORS[i % TYPE_COLORS.length],
    })),
  [counts]);

  const statusBarData = useMemo(() =>
    (counts?.trainsStatusCounts ?? []).map(s => ({
      name:  STATUS_LABEL[s.status] ?? s.status,
      value: s.Number ?? 0,
      fill:  STATUS_COLORS[s.status] ?? '#94a3b8',
    })),
  [counts]);

  const capacityBarData = useMemo(() =>
    capacity.slice(0, 10).map(c => ({
      name:  `TR-${String(c.train_id).padStart(3, '0')}`,
      seats: parseInt(c['Total Seats (MAX Capacity) per train'], 10) || 0,
    })),
  [capacity]);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => trains.filter(t => {
    const q  = search.toLowerCase();
    const matchS = !q || (t.train_number ?? '').toLowerCase().includes(q) || (t.driver_name ?? '').toLowerCase().includes(q);
    const matchT = typeF   === 'All' || t.type   === typeF;
    const matchSt = statusF === 'All' || t.status === statusF;
    return matchS && matchT && matchSt;
  }), [trains, search, typeF, statusF]);

  // ── CRUD helpers ─────────────────────────────────────────────────────────
  const handleSave = (saved) => {
    setTrains(prev =>
      saved.train_id
        ? prev.map(t => t.train_id === saved.train_id ? { ...t, ...saved } : t)
        : [...prev, { ...saved, train_id: Date.now() }]
    );
    setEditModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this train?')) return;
    try { await deleteTrain(id); } catch { /* silent */ }
    setTrains(prev => prev.filter(t => t.train_id !== id));
    toast.success('Train deleted');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">
            Egyptian Railways Admin
          </div>
          <h1 className="text-3xl font-black text-white" style={{ textShadow: '0 0 30px rgba(245,158,11,0.3)' }}>
            TRAIN MANAGEMENT
          </h1>
        </div>
        <button
          onClick={() => setEditModal(BLANK)}
          className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD TRAIN
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Train}    label="Total Trains"   value={trains.length}   accent="#00e5ff" />
        <StatCard icon={Activity} label="Active"         value={counts?.trainsStatusCounts?.find(s=>s.status==='active')?.Number ?? '—'} accent="#34d399" />
        <StatCard icon={Users}    label="Total Seats"    value={totalSeats.toLocaleString()} accent="#f59e0b" />
        <StatCard icon={BarChart3}label="Fleet Types"    value={counts?.trainsTypeCounts?.length ?? '—'} accent="#a78bfa" />
      </div>

      {/* ── Charts row ── */}
      {!loading && (typePieData.length > 0 || capacityBarData.length > 0) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* Pie – type distribution */}
          <div className="glass rounded-2xl p-5 border border-[rgba(0,229,255,0.08)]">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Fleet by Type</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={typePieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {typePieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {typePieData.map((d, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>

          {/* Bar – status counts */}
          <div className="glass rounded-2xl p-5 border border-[rgba(0,229,255,0.08)]">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Fleet by Status</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusBarData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={<PieTooltip />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusBarData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar – capacity per train */}
          <div className="glass rounded-2xl p-5 border border-[rgba(0,229,255,0.08)]">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Seats per Train</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={capacityBarData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<PieTooltip />} />
                <Bar dataKey="seats" fill="#00e5ff" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

      {/* ── Filters ── */}
      <div className="glass rounded-2xl p-4 border border-[rgba(0,229,255,0.08)] flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by number or driver…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm w-full"
          />
        </div>

        <select value={typeF} onChange={e => setTypeF(e.target.value)} className="input-glass h-9 text-sm w-36">
          <option value="All">All Types</option>
          {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="input-glass h-9 text-sm w-40">
          <option value="All">All Status</option>
          {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>

        <button
          onClick={() => { setSearch(''); setTypeF('All'); setStatusF('All'); }}
          className="btn-cyan h-9 px-4 text-sm rounded-xl flex items-center gap-2"
        >
          <Filter className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* ── Table ── */}
      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-600 text-sm animate-pulse">Loading trains…</div>
        ) : (
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left">TRAIN NO.</th>
                <th className="text-left">TYPE</th>
                <th className="text-left">STATUS</th>
                <th className="text-left">DRIVER</th>
                <th className="text-left">CAPACITY</th>
                <th className="text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((t, i) => {
                  const cap = capacityMap[t.train_id];
                  const seats = cap?.['Total Seats (MAX Capacity) per train'];
                  const carriages = cap?.['Number of Carriages'];

                  return (
                    <motion.tr
                      key={t.train_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      {/* Train number */}
                      <td>
                        <button
                          onClick={() => setDetailModal(t)}
                          className="flex items-center gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.12)] flex items-center justify-center">
                            <Train className="w-4 h-4 text-[#00e5ff]" />
                          </div>
                          <span className="text-white font-semibold group-hover:text-[#00e5ff] transition-colors">
                            {safeStr(t.train_number)}
                          </span>
                        </button>
                      </td>

                      {/* Type */}
                      <td><span className="text-slate-400 text-sm">{safeStr(t.type)}</span></td>

                      {/* Status */}
                      <td>
                        <span className={`badge ${STATUS_C[t.status] ?? 'badge-default'}`}>
                          {STATUS_LABEL[t.status] ?? safeStr(t.status)}
                        </span>
                      </td>

                      {/* Driver */}
                      <td><span className="text-slate-300 text-sm">{safeStr(t.driver_name)}</span></td>

                      {/* Capacity */}
                      <td>
                        {seats ? (
                          <div>
                            <span className="text-slate-300 text-sm">{seats} seats</span>
                            {carriages && (
                              <span className="text-slate-600 text-xs ml-1.5">· {carriages} cars</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditModal(t)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.train_id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
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

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-600">
                    No trains match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Edit / Create Modal ── */}
      {editModal !== null && (
        <TrainFormModal
          train={editModal}
          onSave={handleSave}
          onClose={() => setEditModal(null)}
        />
      )}

      {/* ── Journey Detail Modal ── */}
      {detailModal !== null && (
        <JourneyDetailModal
          train={detailModal}
          journey={journeyMap[detailModal.train_id] ?? null}
          capacity={capacityMap[detailModal.train_id] ?? null}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  );
}