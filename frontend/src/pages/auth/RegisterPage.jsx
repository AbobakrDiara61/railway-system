import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Train, Eye, EyeOff, AlertCircle, User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { register } from '../../api/auth.api';
import toast from 'react-hot-toast';
import authBg from '../../assets/auth_page_background.png';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm]       = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const strength = form.password.length > 10 ? 100 : form.password.length * 10;

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      const { token, user } = res.data;
      setAuth(user, token);
      toast.success('Account created! Welcome aboard.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0">
        <img src={authBg} alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(135deg,rgba(7,11,20,0.85) 0%,rgba(7,11,20,0.96) 100%)' }} />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle,rgba(245,158,11,0.5) 0%,transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <Train className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest">RAIL EGYPT</h1>
          <p className="text-slate-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-[rgba(0,229,255,0.12)]">
          {error && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)' }}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="text" value={form.name} onChange={update('name')}
                  placeholder="Ahmed Hassan"
                  className="input-glass pl-10" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="email" value={form.email} onChange={update('email')}
                  placeholder="you@example.com"
                  className="input-glass pl-10" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={update('password')}
                  placeholder="Min. 8 characters"
                  className="input-glass pl-10 pr-10" required minLength={8} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00e5ff] transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength */}
              {form.password && (
                <div className="mt-2">
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{
                        width:`${Math.min(100,strength)}%`,
                        background: strength > 70 ? '#4ade80' : strength > 40 ? '#f59e0b' : '#ef4444',
                      }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="password" value={form.confirm} onChange={update('confirm')}
                  placeholder="Re-enter password"
                  className={`input-glass pl-10 ${form.confirm && form.confirm !== form.password ? 'error' : ''}`}
                  required />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
              <input type="checkbox" className="checkbox-cyan mt-0.5" required />
              <span>I agree to the <span className="text-[#00e5ff]">Terms of Service</span> and <span className="text-[#00e5ff]">Privacy Policy</span></span>
            </label>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f59e0b] font-semibold hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
