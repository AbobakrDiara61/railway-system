import { cn } from '../../utils/cn';

const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  gold: 'badge-gold',
  default: 'bg-white/10 text-slate-300 border border-white/10',
};

export function Badge({ children, variant = 'default', className, dot = false }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-green-400': variant === 'success',
          'bg-yellow-400': variant === 'warning',
          'bg-red-400': variant === 'error',
          'bg-blue-400': variant === 'info',
          'bg-gold-500': variant === 'gold',
          'bg-slate-400': variant === 'default',
        })} />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', variant: 'success' },
    confirmed: { label: 'Confirmed', variant: 'success' },
    completed: { label: 'Completed', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    pending: { label: 'Pending', variant: 'warning' },
    delayed: { label: 'Delayed', variant: 'warning' },
    maintenance: { label: 'Maintenance', variant: 'error' },
    'on-time': { label: 'On Time', variant: 'success' },
    upcoming: { label: 'Upcoming', variant: 'gold' },
    admin: { label: 'Admin', variant: 'gold' },
    superAdmin: { label: 'Super Admin', variant: 'error' },
    passenger: { label: 'Passenger', variant: 'info' },
  };
  const config = map[status?.toLowerCase()] || { label: status || 'Unknown', variant: 'default' };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}
