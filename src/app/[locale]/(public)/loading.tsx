export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Skeleton header */}
        <div className="w-full max-w-2xl px-6 space-y-4">
          <div className="h-10 w-3/4 bg-neutral-200 animate-pulse rounded" />
          <div className="h-5 w-1/2 bg-neutral-100 animate-pulse rounded" />
        </div>

        {/* Skeleton content blocks */}
        <div className="w-full max-w-2xl px-6 space-y-3 mt-4">
          <div className="h-4 w-full bg-neutral-100 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-neutral-100 animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-neutral-100 animate-pulse rounded" />
        </div>

        {/* Skeleton cards grid */}
        <div className="w-full max-w-6xl px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-sm p-4 space-y-3">
              <div className="aspect-video bg-neutral-200 animate-pulse rounded" />
              <div className="h-5 w-3/4 bg-neutral-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-neutral-100 animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-neutral-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
