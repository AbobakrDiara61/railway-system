import { Outlet } from 'react-router-dom';
import { Train } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-32 h-32 border border-white/5 rounded-full" />
        <div className="absolute bottom-10 left-10 w-48 h-48 border border-white/5 rounded-full" />
      </div>

      <div className="w-full relative z-10">
        {/* Brand header */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-11 h-11 rounded-2xl gradient-gold flex items-center justify-center">
            <Train className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-white font-bold text-xl leading-none">Egypt Railways</div>
            <div className="text-gold-400 text-xs">Booking Portal</div>
          </div>
        </motion.div>

        <Outlet />
      </div>
    </div>
  );
}
