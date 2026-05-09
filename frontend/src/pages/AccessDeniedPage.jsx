import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';

export function AccessDeniedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-2xl text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">403</h1>
        <h2 className="text-xl font-semibold text-white mb-3">Access Denied</h2>
        <p className="text-slate-400 mb-8">You don't have permission to access this page. Please contact an administrator if you believe this is an error.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate(-1)} className="btn-navy flex-1 py-3 text-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
