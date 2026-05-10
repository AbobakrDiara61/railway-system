import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, User, RefreshCw, MapPin, Phone, CreditCard, Calendar, Mail, Globe } from 'lucide-react';
import { deleteUserById, getUsers } from '../../api/users.api';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const ROLE_C = {
  admin: 'badge-gold',
  passenger: 'badge-info',
  superAdmin: 'badge-purple',
};

function UserAvatar({ name, size = 'md' }) {
  const dim = size === 'md' ? 'w-8 h-8 text-sm' : 'w-14 h-14 text-xl';
  const initial = name?.trim()?.[0]?.toUpperCase();

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{
        background: 'rgba(0,229,255,0.10)',
        color: '#00e5ff',
        border: '1px solid rgba(0,229,255,0.20)',
      }}
    >
      {initial ?? <User className="w-4 h-4" />}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="mt-0.5 text-[#00e5ff] opacity-70">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-slate-200 text-sm break-words">{value}</div>
      </div>
    </div>
  );
}

function UserDetailModal({ user, isOpen, onClose, onDelete }) {
  if (!user) return null;

  const fullAddress = [user.street, user.building, user.city]
    .filter(Boolean)
    .join(', ');

  const handleDelete = () => {
    onDelete(user.user_id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/8">
        <UserAvatar name={user.full_name} size="lg" />
        <div className="min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight">
            {user.full_name ?? (`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || '—')}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge ${ROLE_C[user.role] ?? 'badge-default'}`}>{user.role ?? 'unknown'}</span>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-0 mb-6">
        <InfoRow icon={Mail}     label="Email"           value={user.email} />
        <InfoRow icon={Phone}    label="Phone"           value={user.phone} />
        <InfoRow icon={Calendar} label="Date of Birth"   value={user.birth_date} />
        <InfoRow icon={CreditCard} label="National ID"   value={user.national_id} />
        <InfoRow icon={Globe}    label="Passport"        value={user.passport_number} />
        <InfoRow icon={MapPin}   label="Address"         value={fullAddress || undefined} />
        <InfoRow
          icon={Calendar}
          label="Member Since"
          value={user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
        />
      </div>

      {/* Delete action */}
      <button
        onClick={handleDelete}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: '#f87171',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
      >
        <Trash2 className="w-4 h-4" />
        Delete Account
      </button>
    </Modal>
  );
}

export function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [roleF,   setRoleF]   = useState('All');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then(r => {
        const list = r?.data?.users ?? [];
        setUsers(list);
      })
      .catch(err => {
        console.error('Failed to load users:', err);
        toast.error('Failed to load users');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const full = u.full_name ?? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim();
    const matchSearch =
      full.toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleF === 'All' || u.role === roleF;
    return matchSearch && matchRole;
  });

  const handleDelete = async (userId) => {
    await deleteUserById(userId);
  };

  const STATS = [
    { label: 'Total Users', value: users.length,                                      color: '#00e5ff' },
    { label: 'Admins',      value: users.filter(u => u.role === 'admin').length,       color: '#f59e0b' },
    { label: 'Passengers',  value: users.filter(u => u.role === 'passenger').length,   color: '#4ade80' },
    { label: 'Super Admins',value: users.filter(u => u.role === 'superAdmin').length,  color: '#a78bfa' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">USER MANAGEMENT</h1>
        </div>
        <button
          onClick={fetchUsers}
          className="btn-cyan px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-xl p-4 border border-[rgba(0,229,255,0.08)]"
          >
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm"
          />
        </div>
        <select
          value={roleF}
          onChange={e => setRoleF(e.target.value)}
          className="input-glass h-9 text-sm w-36"
        >
          {['All', 'passenger', 'admin', 'superAdmin'].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">USER</th>
              <th className="text-left">EMAIL</th>
              <th className="text-left">PHONE</th>
              <th className="text-left">ROLE</th>
              <th className="text-left">CITY</th>
              <th className="text-left">JOINED</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((u, i) => {
                const fullName =
                  u.full_name ?? (`${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || 'Unknown');

                const joinedDate = u.created_at
                  ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : '—';
                const roleBadge = ROLE_C[u.role] ?? 'badge-default';

                return (
                  <motion.tr
                    key={u.user_id ?? i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setSelected(u)}
                  >
                    <td>
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={fullName} />
                        <span className="text-white font-semibold">{fullName}</span>
                      </div>
                    </td>
                    <td><span className="text-slate-400 text-sm">{u.email ?? '—'}</span></td>
                    <td><span className="text-slate-400 text-sm">{u.phone ?? '—'}</span></td>
                    <td><span className={`badge ${roleBadge}`}>{u.role ?? '—'}</span></td>
                    <td><span className="text-slate-300 text-sm">{u.city ?? '—'}</span></td>
                    <td><span className="text-slate-500 text-sm">{joinedDate}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        onClick={async () => {
                            await handleDelete(u.user_id);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        style={{
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          color: '#f87171',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-600">
                  No users found
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-600">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <UserDetailModal
        user={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
