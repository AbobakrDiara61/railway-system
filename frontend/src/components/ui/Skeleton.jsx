import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('glass p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={cn('h-4', j === 0 ? 'w-1/4' : 'flex-1')} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="glass p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
