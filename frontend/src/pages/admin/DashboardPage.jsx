import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Train, Navigation, Ticket, Users, Plus, Bell, Mail, LogOut,
         TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getTrainCounts } from '../../api/trains.api';
import { getJourneyCount } from '../../api/journeys.api';
import { getAllBookings } from '../../api/bookings.api';
import { getUsers } from '../../api/users.api';
import { formatDate } from '../../utils/formatDate';

const bookingTrend = [
  { month:'Jan', bookings:45,  prev:30  },
  { month:'Feb', bookings:72,  prev:45  },
  { month:'Mar', bookings:98,  prev:72  },
  { month:'Apr', bookings:155, prev:98  },
  { month:'May', bookings:198, prev:155 },
  { month:'Jun', bookings:245, prev:198 },
];

const trainStatus = [
  { name:'On Time',    value:65, color:'#00e5ff' },
  { name:'Delayed',   value:20, color:'#a855f7' },
  { name:'Maintenance',value:15,color:'#22d3ee' },
];

const MOCK_BOOKINGS = [
  { id:'102507', passenger:'Adham Manger',  journey:'Bondco Train',       status:'On Time', date:'09/05/2024' },
  { id:'102508', passenger:'Maoe Mauon',    journey:'Railway to Avrait',  status:'Delayed', date:'13/05/2024' },
  { id:'102513', passenger:'Senw Modan',    journey:'Railway to Avrait',  status:'On Time', date:'11/05/2024' },
  { id:'102506', passenger:'Aohab Mahmian', journey:'Bonticn Train',      status:'Delayed', date:'28/05/2024' },
];

const KPI = [
  { label:'Total Trains',   icon:Train,      color:'#00e5ff',  bg:'rgba(0,229,255,0.1)',   border:'rgba(0,229,255,0.2)',  val:'312',       trend:'+2.5%', up:true  },
  { label:'Journeys Today', icon:Navigation, color:'#4ade80',  bg:'rgba(74,222,128,0.1)',  border:'rgba(74,222,128,0.2)', val:'4,580',     trend:'+1.2%', up:true  },
  { label:'Bookings',       icon:Ticket,     color:'#a855f7',  bg:'rgba(168,85,247,0.1)',  border:'rgba(168,85,247,0.2)',  val:'11,205',    trend:'-0.5%', up:false },
  { label:'Users',          icon:Users,      color:'#f59e0b',  bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)', val:'1,450,000', trend:'+5.8%', up:true  },
];

const STATUS_COLORS = {
  'On Time': 'text-[#00e5ff] bg-[rgba(0,229,255,0.1)] border-[rgba(0,229,255,0.25)]',
  'Delayed': 'text-[#a855f7] bg-[rgba(168,85,247,0.1)] border-[rgba(168,85,247,0.25)]',
  'Cancelled': 'text-[#ef4444] bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.25)]',
};

export function DashboardPage() {
  const [loading, setLoading]   = useState(false);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  useEffect(() => {
    Promise.all([getTrainCounts(), getJourneyCount(), getAllBookings(), getUsers()])
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back — here's what's happening today</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl glass border border-[rgba(0,229,255,0.12)] flex items-center justify-center text-slate-400 hover:text-[#00e5ff] transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <button className="w-10 h-10 rounded-xl glass border border-[rgba(0,229,255,0.12)] flex items-center justify-center text-slate-400 hover:text-[#00e5ff] transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
            <Plus className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* ─ KPI CARDS ─ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(({ label, icon: Icon, color, bg, border, val, trend, up }, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.08 }}
            className="kpi-card"
            style={{ borderColor: border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: bg, border:`1px solid ${border}` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${up ? 'text-[#4ade80]' : 'text-red-400'}`}>
                {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend}
              </span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{val}</div>
            <div className="text-slate-500 text-sm">{label}</div>
            {/* Mini sparkline */}
            <div className="mt-3 flex items-end gap-0.5 h-8">
              {[30,45,35,60,50,70,80,65,75,90].map((h, j) => (
                <div key={j} className="flex-1 rounded-sm"
                  style={{ height:`${h}%`, background: color, opacity: 0.3 + (j/10)*0.5 }} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─ CHARTS ROW ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Line chart */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 glass p-5 rounded-2xl border border-[rgba(0,229,255,0.10)]">
          <h3 className="text-xs font-bold text-[#00e5ff] uppercase tracking-widest mb-4">
            Bookings Over Last 6 Months
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingTrend} margin={{ top:5, right:10, bottom:5, left:0 }}>
              <XAxis dataKey="month" tick={{ fill:'#4a6080', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#4a6080', fontSize:11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{ background:'rgba(10,18,35,0.95)', border:'1px solid rgba(0,229,255,0.2)', borderRadius:'10px', fontSize:'12px' }}
                labelStyle={{ color:'#00e5ff' }} itemStyle={{ color:'#e2eaf4' }} />
              <Line type="monotone" dataKey="bookings" stroke="#00e5ff" strokeWidth={2} dot={{ r:4, fill:'#00e5ff', strokeWidth:0 }} />
              <Line type="monotone" dataKey="prev" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 2" dot={{ r:3, fill:'#a855f7', strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut chart */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.4 }}
          className="glass p-5 rounded-2xl border border-[rgba(0,229,255,0.10)]">
          <h3 className="text-xs font-bold text-[#00e5ff] uppercase tracking-widest mb-4">
            Train Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={trainStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value">
                {trainStatus.map((s, i) => (
                  <Cell key={i} fill={s.color} opacity={0.85} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8}
                formatter={v => <span style={{ color:'#94a3b8', fontSize:'12px' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {trainStatus.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-bold text-white">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─ BOTTOM ROW ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Bookings */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2 glass rounded-2xl border border-[rgba(0,229,255,0.10)] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-[#00e5ff] uppercase tracking-widest">Recent Bookings</h3>
          </div>
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Passenger</th>
                <th className="text-left">Journey</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="text-slate-500 font-mono text-xs">{b.id}</td>
                  <td className="text-white font-medium">{b.passenger}</td>
                  <td className="text-slate-400">{b.journey}</td>
                  <td>
                    <span className={`badge border text-xs ${STATUS_COLORS[b.status] || 'badge-default'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.5 }}
          className="glass p-5 rounded-2xl border border-[rgba(0,229,255,0.10)]">
          <h3 className="text-xs font-bold text-[#00e5ff] uppercase tracking-widest mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Add New Train',    icon:Train },
              { label:'Generate Report',  icon:TrendingUp },
              { label:'Manage Schedule',  icon:Navigation },
              { label:'View Alerts',      icon:Bell },
            ].map(({ label, icon: Icon }, i) => (
              <button key={i}
                className="btn-cyan p-4 rounded-xl flex flex-col items-center gap-2 text-center text-xs font-semibold h-20">
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
