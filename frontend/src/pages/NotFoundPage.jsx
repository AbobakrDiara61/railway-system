import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Train, Home, Search } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full">
        {/* Animated train */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-8"
        >
          <Train className="w-10 h-10 text-black" />
        </motion.div>
        <h1 className="text-8xl font-black text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-3">Station Not Found</h2>
        <p className="text-slate-400 mb-10">This train doesn't stop here. The page you're looking for has left the station or doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/')} className="btn-gold px-8 py-3 text-sm flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </button>
          <button onClick={() => navigate('/trains/search')} className="btn-navy px-8 py-3 text-sm flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Search Trains
          </button>
        </div>
      </motion.div>
    </div>
  );
}
