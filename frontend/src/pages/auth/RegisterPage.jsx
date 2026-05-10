import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Train, Eye, EyeOff, AlertCircle,
  User, Mail, Lock, Phone, Calendar,
  CreditCard, MapPin, Building2,
  ArrowRight, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { register } from '../../api/auth.api';
import toast from 'react-hot-toast';

/* ─── step definitions ─────────────────────────────────────── */
const STEPS = [
  { label: 'Personal',  icon: User },
  { label: 'Security',  icon: Lock },
  { label: 'Identity',  icon: CreditCard },
  { label: 'Address',   icon: MapPin },
];

/* ─── tiny field wrapper ────────────────────────────────────── */
function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-slate-600 text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

/* ─── icon input ────────────────────────────────────────────── */
function IconInput({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
      <input className={`input-glass pl-10 ${className}`} {...props} />
    </div>
  );
}

/* ─── main component ────────────────────────────────────────── */
export function RegisterPage() {
  const navigate   = useNavigate();
  const { setAuth } = useAuthStore();

  const [step, setStep]     = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const [form, setForm] = useState({
    first_name: '', last_name: '',
    email: '', phone: '',
    birth_date: '',
    password: '', confirm: '',
    national_id: '', passport_number: '',
    city: '', street: '', building: '',
  });

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const strength = form.password.length > 10 ? 100 : form.password.length * 10;
  const strengthColor = strength > 70 ? '#4ade80' : strength > 40 ? '#f59e0b' : '#ef4444';
  const strengthLabel = strength > 70 ? 'Strong' : strength > 40 ? 'Fair' : 'Weak';

  /* per-step validation */
  const validateStep = () => {
    setError('');
    if (step === 0) {
      if (!form.first_name.trim() || !form.last_name.trim()) return setError('First and last name are required.'), false;
      if (!form.email.includes('@')) return setError('Enter a valid email.'), false;
      if (!/^\+?[0-9]{7,15}$/.test(form.phone)) return setError('Enter a valid phone number.'), false;
      if (!form.birth_date) return setError('Birth date is required.'), false;
    }
    if (step === 1) {
      if (form.password.length < 8) return setError('Password must be at least 8 characters.'), false;
      if (form.password !== form.confirm) return setError("Passwords don't match."), false;
    }
    if (step === 2) {
      if (!form.national_id.trim() && !form.passport_number.trim())
        return setError('Provide at least a National ID or Passport number.'), false;
    }
    if (step === 3) {
      if (!form.city.trim() || !form.street.trim()) return setError('City and street are required.'), false;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = {
        first_name:      form.first_name,
        last_name:       form.last_name,
        email:           form.email,
        password:   form.password,   // hashing happens server-side
        phone:           form.phone,
        birth_date:      form.birth_date,
        national_id:     form.national_id  || null,
        passport_number: form.passport_number || null,
        role:            'passenger',
        city:            form.city,
        street:          form.street,
        building:        form.building     || null,
      };
      const res = await register(payload);
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

  /* ── step content panels ── */
  const panels = [
    /* 0 – Personal */
    <div key="personal" className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name">
          <IconInput icon={User} type="text" value={form.first_name}
            onChange={update('first_name')} placeholder="Ahmed" required />
        </Field>
        <Field label="Last Name">
          <IconInput icon={User} type="text" value={form.last_name}
            onChange={update('last_name')} placeholder="Hassan" required />
        </Field>
      </div>
      <Field label="Email Address">
        <IconInput icon={Mail} type="email" value={form.email}
          onChange={update('email')} placeholder="you@example.com" required />
      </Field>
      <Field label="Phone Number">
        <IconInput icon={Phone} type="tel" value={form.phone}
          onChange={update('phone')} placeholder="+20 10 0000 0000" required />
      </Field>
      <Field label="Date of Birth">
        <IconInput icon={Calendar} type="date" value={form.birth_date}
          onChange={update('birth_date')} required
          max={new Date().toISOString().split('T')[0]} />
      </Field>
    </div>,

    /* 1 – Security */
    <div key="security" className="space-y-4">
      <Field label="Password">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input type={showPw ? 'text' : 'password'} value={form.password}
            onChange={update('password')} placeholder="Min. 8 characters"
            className="input-glass pl-10 pr-10" required minLength={8} />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00e5ff] transition-colors">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.password && (
          <div className="mt-2 space-y-1">
            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, strength)}%`, background: strengthColor }} />
            </div>
            <p className="text-[10px]" style={{ color: strengthColor }}>{strengthLabel} password</p>
          </div>
        )}
      </Field>
      <Field label="Confirm Password">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input type="password" value={form.confirm} onChange={update('confirm')}
            placeholder="Re-enter password"
            className={`input-glass pl-10 ${form.confirm && form.confirm !== form.password ? 'error' : ''}`}
            required />
          {form.confirm && form.confirm === form.password && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
          )}
        </div>
      </Field>
      <div className="p-3 rounded-xl text-xs text-slate-500 space-y-1"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-slate-400 font-semibold mb-2">Password requirements:</p>
        {[
          ['At least 8 characters', form.password.length >= 8],
          ['Contains a number', /\d/.test(form.password)],
          ['Contains uppercase letter', /[A-Z]/.test(form.password)],
        ].map(([txt, ok]) => (
          <div key={txt} className="flex items-center gap-2">
            <span style={{ color: ok ? '#4ade80' : 'rgba(255,255,255,0.2)' }}>
              {ok ? '✓' : '○'}
            </span>
            <span style={{ color: ok ? '#4ade80' : undefined }}>{txt}</span>
          </div>
        ))}
      </div>
    </div>,

    /* 2 – Identity */
    <div key="identity" className="space-y-4">
      <p className="text-slate-500 text-xs leading-relaxed">
        Provide at least one identity document. Both can be left optional if the other is filled.
      </p>
      <Field label="National ID" hint="Egyptian National ID — 14 digits">
        <IconInput icon={CreditCard} type="text" value={form.national_id}
          onChange={update('national_id')} placeholder="2 XXXXXX X XXXXX X X"
          maxLength={14} inputMode="numeric" />
      </Field>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-slate-600 text-xs">or</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
      <Field label="Passport Number">
        <IconInput icon={CreditCard} type="text" value={form.passport_number}
          onChange={update('passport_number')} placeholder="A 1234567"
          style={{ textTransform: 'uppercase' }} />
      </Field>
    </div>,

    /* 3 – Address */
    <div key="address" className="space-y-4">
      <Field label="City">
        <IconInput icon={MapPin} type="text" value={form.city}
          onChange={update('city')} placeholder="Cairo" required />
      </Field>
      <Field label="Street">
        <IconInput icon={MapPin} type="text" value={form.street}
          onChange={update('street')} placeholder="El-Tahrir Street" required />
      </Field>
      <Field label="Building / Apartment" hint="Optional">
        <IconInput icon={Building2} type="text" value={form.building}
          onChange={update('building')} placeholder="Building 12, Apt 3A" />
      </Field>

      {/* Terms */}
      <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer pt-1">
        <input type="checkbox" className="checkbox-cyan mt-0.5" required />
        <span>
          I agree to the{' '}
          <span className="text-[#00e5ff]">Terms of Service</span>
          {' '}and{' '}
          <span className="text-[#00e5ff]">Privacy Policy</span>
        </span>
      </label>
    </div>,
  ];

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <Train className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest">RAIL EGYPT</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create your account</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {STEPS.map((s, i) => {
            const done    = i < step;
            const active  = i === step;
            const StepIcon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background: done  ? 'rgba(74,222,128,0.15)'
                                : active ? 'rgba(245,158,11,0.2)'
                                         : 'rgba(255,255,255,0.05)',
                      border: done  ? '1px solid rgba(74,222,128,0.4)'
                            : active ? '1px solid rgba(245,158,11,0.6)'
                                     : '1px solid rgba(255,255,255,0.08)',
                      color: done ? '#4ade80' : active ? '#f59e0b' : '#475569',
                    }}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4" />
                      : <StepIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest"
                    style={{ color: active ? '#f59e0b' : done ? '#4ade80' : '#334155' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-6 h-px mb-4 transition-all duration-500"
                    style={{ background: i < step ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.07)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 border border-[rgba(0,229,255,0.12)]">

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={isLast ? handleSubmit : (e) => { e.preventDefault(); next(); }}>
            {/* Animated step panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}>
                {panels[step]}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={`flex gap-3 mt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
              {step > 0 && (
                <button type="button" onClick={back}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400
                             hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}

              {isLast ? (
                <button type="submit" disabled={loading}
                  className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Creating account…
                    </>
                  ) : 'Create Account'}
                </button>
              ) : (
                <button type="submit"
                  className="btn-gold flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm ml-auto">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-white/8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f59e0b] font-semibold hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-slate-600 text-xs mt-3">
          Step {step + 1} of {STEPS.length}
        </p>
      </motion.div>
    </div>
  );
}