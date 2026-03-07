export default function CommunicationLoading() {
  return (
    <section className="bg-neutral-50 min-h-screen">
      {/* Page header skeleton */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
          <div className="h-12 w-64 bg-neutral-200 animate-pulse rounded" />
          <div className="h-5 w-80 bg-neutral-100 animate-pulse rounded mt-4" />
        </div>
      </div>

      {/* News grid skeleton */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-10 sm:py-14 md:py-16">
        {/* Filter skeleton */}
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 bg-neutral-200 animate-pulse rounded-full" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white p-4 space-y-3">
              <div className="aspect-video bg-neutral-200 animate-pulse rounded" />
              <div className="h-3 w-20 bg-neutral-100 animate-pulse rounded" />
              <div className="h-5 w-3/4 bg-neutral-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-neutral-100 animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-neutral-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
