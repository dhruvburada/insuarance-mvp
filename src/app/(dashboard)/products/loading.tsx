export default function ProductsLoading() {
  return (
    <div className="space-y-10 animate-pulse pb-12">
      {/* HEADER WITH SEARCH & CATEGORY PILLS */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-2">
            <div className="h-3 w-40 bg-slate-200 rounded" />
            <div className="flex items-center gap-3">
              <div className="h-9 w-72 bg-slate-200 rounded-xl" />
              <div className="h-6 w-28 bg-lime-400/40 rounded-full" />
            </div>
            <div className="h-4 w-96 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-lime-400/40 rounded-xl" />
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-11 w-full sm:w-80 bg-slate-100 rounded-xl border border-slate-200" />
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-9 w-28 bg-pine-950/80 rounded-xl" />
            <div className="h-9 w-20 bg-slate-100 rounded-xl" />
            <div className="h-9 w-24 bg-slate-100 rounded-xl" />
            <div className="h-9 w-28 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>

      {/* PRODUCTS BENTO GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-7 flex flex-col justify-between bg-white border-2 border-slate-200 shadow-sm space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-slate-100" />
              <div className="h-10 w-10 rounded-full bg-slate-100" />
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <div className="h-4 w-28 bg-lime-100 rounded-full" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-48 bg-slate-200 rounded-lg" />
              <div className="h-3.5 w-full bg-slate-100 rounded" />
              <div className="h-3.5 w-4/5 bg-slate-100 rounded" />

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-5 w-24 bg-slate-200 rounded font-mono" />
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-4 w-28 bg-emerald-100 rounded font-mono" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <div className="h-9 w-full bg-slate-100 rounded-xl" />
              <div className="h-9 w-28 bg-slate-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
