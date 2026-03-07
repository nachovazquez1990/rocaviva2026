export default function AdminLoading() {
  return (
    <div className="p-8 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded" />
        <div className="h-4 w-72 bg-neutral-100 animate-pulse rounded" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-neutral-100 space-y-2">
            <div className="h-4 w-20 bg-neutral-100 animate-pulse rounded" />
            <div className="h-8 w-16 bg-neutral-200 animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-neutral-100 p-4 mt-4 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-10 w-10 bg-neutral-200 animate-pulse rounded" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-2/3 bg-neutral-100 animate-pulse rounded" />
              <div className="h-3 w-1/3 bg-neutral-50 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
