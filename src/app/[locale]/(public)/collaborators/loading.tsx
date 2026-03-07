export default function CollaboratorsLoading() {
  return (
    <section className="bg-neutral-50 min-h-screen">
      {/* Page header skeleton */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
          <div className="h-12 w-56 bg-neutral-200 animate-pulse rounded" />
          <div className="h-5 w-96 bg-neutral-100 animate-pulse rounded mt-4" />
        </div>
      </div>

      {/* Logo grid skeleton */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-10 sm:py-14 md:py-16">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-white animate-pulse rounded flex items-center justify-center"
            >
              <div className="w-2/3 h-2/3 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
