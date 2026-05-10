import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ChevronRight, Train } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { updateProfile, changePassword } from '../../api/auth.api';
import { getUserBookings } from '../../api/bookings.api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageBackground } from '../../components/ui/PageBackground';
import profileBg from '../../assets/profile_history_background.png';

const RECENT_BOOKINGS = [
  { from:'Cairo', to:'Luxor',      date:'26 OCT 2024', status:'View Ticket' },
  { from:'Alexandria', to:'Aswan', date:'18 NOV 2024', status:'Past Trip'   },
  { from:'Cairo', to:'Hurghada',   date:'5 DEC 2024',  status:'View Ticket' },
];

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name:  user?.full_name  || 'Karim Hassan',
    email: user?.email || 'karim.hassan@email.com',
    phone: user?.phone || '+20 123 456 7890',
  });

  const [passwords, setPasswords] = useState({ old:'', newP:'', confirm:'' });
  const [showOld,  setShowOld]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [changing, setChanging] = useState(false);

  const strength = passwords.newP.length > 10 ? 100 : passwords.newP.length * 10;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(profile);
      updateUser(profile);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handlePassword = async () => {
    if (passwords.newP !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    setChanging(true);
    try {
      await changePassword({ oldPassword: passwords.old, newPassword: passwords.newP });
      toast.success('Password updated!');
      setPasswords({ old:'', newP:'', confirm:'' });
    } catch { toast.error('Password change failed'); }
    finally { setChanging(false); }
  };

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* BG */}
      <PageBackground src={profileBg} opacity={0.8} fixed /
      >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* EGYPT RAIL label */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <Train className="w-4 h-4 text-black" />
          </div>
          <span className="text-white font-black tracking-widest text-sm">EGYPT RAIL</span>
        </div>

        {/* Avatar hero card */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          className="glass-hover cursor-pointer rounded-2xl p-8 text-center mb-8 relative overflow-hidden backdrop-blur-sm"
          style={{ border:'1px solid rgba(0,229,255,0.12)' }}>
          {/* Glow ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full"
              style={{ background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)' }} />
          </div>

          <div className="relative">
            {/* Avatar with cyan glow ring */}
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 relative"
              style={{
                background:'linear-gradient(135deg,#1a2a4a,#0a1220)',
                border:'3px solid rgba(0,229,255,0.5)',
                boxShadow:'0 0 30px rgba(0,229,255,0.25), 0 0 60px rgba(0,229,255,0.1)',
              }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-12 h-12 text-[#00e5ff]" />
              )}
              {/* Online dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#00e5ff] border-2 border-[#070b14]" />
            </div>

            <h1 className="text-2xl font-black text-white mb-2">
              {profile.name.toUpperCase()}
            </h1>
            <span className="px-4 py-1 rounded-full text-xs font-bold"
              style={{ background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.25)', color:'#00e5ff' }}>
              ✈ Passenger
            </span>
          </div>
        </motion.div>

        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Edit Profile */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1 }}
            className="glass glass-hover rounded-2xl p-5" style={{ border:'1px solid rgba(0,229,255,0.10)' }}>
            <h2 className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mb-5">Edit Profile</h2>

            <div className="space-y-3">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Full Name</label>
                <input value={profile.name} onChange={e => setProfile({...profile, name:e.target.value})}
                  className="input-glass" />
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Email Address</label>
                <input value={profile.email} onChange={e => setProfile({...profile, email:e.target.value})}
                  className="input-glass" type="email" />
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Phone Number</label>
                <input value={profile.phone} onChange={e => setProfile({...profile, phone:e.target.value})}
                  className="input-glass" />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="btn-gold w-full py-2.5 text-xs rounded-xl font-bold mt-5">
              {saving ? 'Saving...' : 'SAVE CHANGES'}
            </button>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.15 }}
            className="glass glass-hover rounded-2xl p-5" style={{ border:'1px solid rgba(0,229,255,0.10)' }}>
            <h2 className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mb-5">Change Password</h2>

            <div className="space-y-3">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Old Password</label>
                <div className="relative">
                  <input type={showOld ? 'text':'password'} value={passwords.old}
                    onChange={e => setPasswords({...passwords, old:e.target.value})}
                    className="input-glass pr-10" />
                  <button type="button" onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text':'password'} value={passwords.newP}
                    onChange={e => setPasswords({...passwords, newP:e.target.value})}
                    className="input-glass pr-10" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {passwords.newP && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>STRENGTH</span>
                      <span style={{ color: strength > 70 ? '#4ade80' : strength > 40 ? '#f59e0b' : '#ef4444' }}>
                        {strength > 70 ? 'Strong' : strength > 40 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width:`${Math.min(100,strength)}%`,
                          background: strength > 70 ? '#4ade80' : strength > 40 ? '#f59e0b' : '#ef4444',
                        }} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Confirm Password</label>
                <input type="password" value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm:e.target.value})}
                  className="input-glass" />
              </div>
            </div>

            <button onClick={handlePassword} disabled={changing}
              className="btn-gold w-full py-2.5 text-xs rounded-xl font-bold mt-5">
              {changing ? 'Updating...' : 'UPDATE PASSWORD'}
            </button>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2 }}
            className="glass glass-hover rounded-2xl p-5" style={{ border:'1px solid rgba(0,229,255,0.10)' }}>
            <h2 className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mb-5">Recent Bookings</h2>

            <div className="space-y-3">
              {RECENT_BOOKINGS.map((b, i) => (
                <div key={i}
                  className="p-3 rounded-xl border border-[rgba(0,229,255,0.08)] bg-[rgba(0,229,255,0.02)] flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-semibold">
                      {b.from} to {b.to}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">{b.date}</div>
                  </div>
                  <button
                    onClick={() => navigate('/bookings')}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={b.status === 'View Ticket' ? {
                      background:'rgba(0,229,255,0.10)',
                      border:'1px solid rgba(0,229,255,0.25)',
                      color:'#00e5ff',
                    } : {
                      background:'rgba(255,255,255,0.05)',
                      border:'1px solid rgba(255,255,255,0.10)',
                      color:'#4a6080',
                    }}>
                    {b.status}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
