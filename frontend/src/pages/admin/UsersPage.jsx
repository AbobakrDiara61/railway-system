import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, UserX, User, Mail, Calendar, MoreVertical, RefreshCw } from 'lucide-react';
import { getUsers } from '../../api/users.api';
import toast from 'react-hot-toast';

const MOCK_USERS = [
  { id:1, name:'Ahmed Hassan',    email:'ahmed@example.com',  role:'passenger', status:'Active',   joined:'Oct 2024', bookings:12 },
  { id:2, name:'Sara Mohamed',    email:'sara@example.com',   role:'passenger', status:'Active',   joined:'Sep 2024', bookings:5  },
  { id:3, name:'Karim Ali',       email:'karim@example.com',  role:'admin',     status:'Active',   joined:'Jan 2024', bookings:0  },
  { id:4, name:'Nour Ibrahim',    email:'nour@example.com',   role:'passenger', status:'Suspended',joined:'Nov 2024', bookings:3  },
  { id:5, name:'Omar Farouk',     email:'omar@example.com',   role:'passenger', status:'Active',   joined:'Dec 2024', bookings:8  },
];

const ROLE_C = { admin:'badge-gold', passenger:'badge-info', superAdmin:'badge-purple' };
const STATUS_C = { Active:'badge-success', Suspended:'badge-error', Inactive:'badge-default' };

export function UsersPage() {
  const [users,  setUsers]  = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleF,  setRoleF]  = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers().then(r => { if(r.data?.length) setUsers(r.data); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleF === 'All' || u.role === roleF;
    return matchSearch && matchRole;
  });

  const toggleSuspend = (id) => {
    setUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
      : u
    ));
    toast.success('User status updated');
  };

  const STATS = [
    { label:'Total Users',   value: users.length,                           color:'#00e5ff' },
    { label:'Active',        value: users.filter(u=>u.status==='Active').length,     color:'#4ade80' },
    { label:'Admins',        value: users.filter(u=>u.role==='admin').length,        color:'#f59e0b' },
    { label:'Suspended',     value: users.filter(u=>u.status==='Suspended').length,  color:'#f87171' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</div>
          <h1 className="text-3xl font-black text-white">USER MANAGEMENT</h1>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(()=>setLoading(false),800); }}
          className="btn-cyan px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="glass rounded-xl p-4 border border-[rgba(0,229,255,0.08)]">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-5 border border-[rgba(0,229,255,0.08)] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)}
            className="input-glass pl-10 h-9 text-sm" />
        </div>
        <select value={roleF} onChange={e=>setRoleF(e.target.value)} className="input-glass h-9 text-sm w-36">
          {['All','passenger','admin','superAdmin'].map(r=><option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-[rgba(0,229,255,0.08)] overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="text-left">USER</th>
              <th className="text-left">EMAIL</th>
              <th className="text-left">ROLE</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">BOOKINGS</th>
              <th className="text-left">JOINED</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background:'rgba(0,229,255,0.10)', color:'#00e5ff', border:'1px solid rgba(0,229,255,0.20)' }}>
                        {u.name[0]}
                      </div>
                      <span className="text-white font-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td><span className="text-slate-400 text-sm">{u.email}</span></td>
                  <td><span className={`badge ${ROLE_C[u.role]||'badge-default'}`}>{u.role}</span></td>
                  <td><span className={`badge ${STATUS_C[u.status]||'badge-default'}`}>{u.status}</span></td>
                  <td><span className="text-slate-300 font-semibold">{u.bookings}</span></td>
                  <td><span className="text-slate-500 text-sm">{u.joined}</span></td>
                  <td>
                    <button onClick={() => toggleSuspend(u.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                      style={u.status === 'Active'
                        ? {background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171'}
                        : {background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', color:'#4ade80'}
                      }>
                      {u.status === 'Active'
                        ? <><UserX className="w-3 h-3" /> Suspend</>
                        : <><Shield className="w-3 h-3" /> Restore</>
                      }
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-slate-600">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
