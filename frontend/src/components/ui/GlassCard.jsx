import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export function GlassCard({ children, className, hover = true, onClick, ...props }) {
  return (
    <motion.div
      className={cn('glass p-6', hover && 'glass-hover cursor-pointer', className)}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlassCardStatic({ children, className, ...props }) {
  return (
    <div className={cn('glass p-6', className)} {...props}>
      {children}
    </div>
  );
}
