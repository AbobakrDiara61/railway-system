import { motion } from 'framer-motion';
import { Train, Search, FileX } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

const icons = {
  train: Train,
  search: Search,
  empty: FileX,
};

export function EmptyState({
  icon = 'empty',
  title = 'Nothing here yet',
  description = 'No data available.',
  action,
  actionLabel,
  className,
}) {
  const Icon = icons[icon] || icons.empty;
  return (
    <motion.div
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">{description}</p>
      {action && (
        <Button onClick={action} variant="gold" size="sm">
          {actionLabel || 'Take Action'}
        </Button>
      )}
    </motion.div>
  );
}
