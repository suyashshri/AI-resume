export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          {[1, 2, 3].map((j) => (
            <Skeleton key={j} className="h-14 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ReportSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="card flex gap-8">
        <Skeleton className="w-28 h-28 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="card space-y-3">
        <Skeleton className="h-7 w-32" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    </div>
  );
}
