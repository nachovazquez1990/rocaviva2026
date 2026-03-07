export default function BooksLoading() {
  return (
    <section className="bg-neutral-50 min-h-screen">
      {/* Page header skeleton */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
          <div className="h-12 w-40 bg-neutral-200 animate-pulse rounded" />
        </div>
      </div>

      {/* Book skeleton */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-10 sm:py-14 md:py-16">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Book cover */}
          <div className="w-full md:w-80 aspect-[3/4] bg-neutral-200 animate-pulse rounded shrink-0" />
          {/* Book info */}
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-neutral-100 animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 animate-pulse rounded" />
            <div className="h-4 w-4/6 bg-neutral-100 animate-pulse rounded" />
            <div className="h-4 w-full bg-neutral-100 animate-pulse rounded mt-4" />
            <div className="h-4 w-3/4 bg-neutral-100 animate-pulse rounded" />
            <div className="h-12 w-40 bg-neutral-200 animate-pulse rounded mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
