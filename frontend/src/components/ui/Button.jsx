import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  gold: 'btn-gold',
  navy: 'btn-navy',
  danger: 'btn-danger',
  ghost: 'bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 rounded-lg transition-all',
  outline: 'bg-transparent border border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export function Button({
  children,
  variant = 'gold',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  fullWidth = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-gold-500/40',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
