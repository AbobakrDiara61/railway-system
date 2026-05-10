import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Train, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../api/auth.api';
import toast from 'react-hot-toast';
import authBg from '../../assets/auth_page_background.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      const { token, user } = res.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name || 'traveller'}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
      
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0">
        <img src={authBg} alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(135deg,rgba(7,11,20,0.80) 0%,rgba(7,11,20,0.95) 100%)' }} />
        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background:'radial-gradient(circle,rgba(0,229,255,0.5) 0%,transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle,rgba(245,158,11,0.6) 0%,transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity:0, y:30, scale:0.97 }}
        animate={{ opacity:1, y:0,  scale:1 }}
        transition={{ duration:0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <Train className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest">RAIL EGYPT</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 border border-[rgba(0,229,255,0.12)]">
          {error && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)' }}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`input-glass ${error ? 'error' : ''}`}
                required autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input-glass pr-10 ${error ? 'error' : ''}`}
                  required autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00e5ff] transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="checkbox-cyan" />
                Remember me
              </label>
              <button type="button" className="text-[#00e5ff] hover:opacity-75 transition-opacity">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3 rounded-xl font-bold text-sm mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#f59e0b] font-semibold hover:opacity-80 transition-opacity">
              Create one
            </Link>
          </div>
        </div>

        {/* ── DEMO QUICK ACCESS ── */}
        <div className="mt-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-slate-600 text-xs uppercase tracking-widest">Quick Demo</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Passenger demo */}
            <button
              onClick={() => {
                setAuth(
                  { id: 1, name: 'Ahmed Hassan', email: 'passenger@rail.eg', role: 'passenger' },
                  'demo-passenger-token'
                );
                toast.success('Demo: Passenger session started');
                navigate('/');
              }}
              className="py-3 rounded-xl text-sm font-bold flex flex-col items-center gap-1 transition-all"
              style={{
                background: 'rgba(0,229,255,0.06)',
                border: '1px solid rgba(0,229,255,0.25)',
                color: '#00e5ff',
              }}
            >
              <Zap className="w-4 h-4" />
              <span>Passenger View</span>
            </button>

            {/* Admin demo */}
            <button
              onClick={() => {
                setAuth(
                  { id: 99, name: 'Admin User', email: 'admin@rail.eg', role: 'admin' },
                  'demo-admin-token'
                );
                toast.success('Demo: Admin session started');
                navigate('/admin/dashboard');
              }}
              className="py-3 rounded-xl text-sm font-bold flex flex-col items-center gap-1 transition-all"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.30)',
                color: '#f59e0b',
              }}
            >
              <Zap className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>
          <p className="text-center text-xs text-slate-700 mt-3">No backend required for demo mode</p>
        </div>
      </motion.div>
    </div>
  );
}
