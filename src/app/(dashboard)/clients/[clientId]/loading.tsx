export default function ClientDetailLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-12">
      {/* BREADCRUMB & HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2.5">
          <div className="h-3 w-32 bg-slate-200 rounded" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-64 bg-slate-200 rounded-xl" />
            <div className="h-6 w-32 bg-lime-400/40 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-slate-100 rounded" />
            <div className="h-4 w-36 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="h-9 w-28 bg-slate-100 rounded-xl border border-slate-200" />
          <div className="h-9 w-44 bg-lime-400/40 rounded-xl" />
        </div>
      </div>

      {/* 4-COLUMN SNAPSHOT BAR SKELETON */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`space-y-2 ${i > 1 ? "pt-4 md:pt-0 md:pl-6" : ""}`}>
            <div className="h-3 w-28 bg-slate-100 rounded" />
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* 3-TAB SELECTOR SKELETON */}
      <div className="space-y-6">
        <div className="h-10 w-full sm:w-96 bg-slate-200/70 rounded-xl p-1 flex gap-1">
          <div className="h-full w-1/3 bg-white rounded-lg shadow-sm" />
          <div className="h-full w-1/3 bg-transparent rounded-lg" />
          <div className="h-full w-1/3 bg-transparent rounded-lg" />
        </div>

        {/* 3-COLUMN POLICY MATCHING CARDS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((card) => (
            <div key={card} className="rounded-2xl p-6 bg-white border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                <div className="h-6 w-20 bg-emerald-100 rounded-full" />
              </div>

              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 rounded" />
                <div className="h-3 w-28 bg-slate-100 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-4/5 bg-slate-100 rounded" />
                <div className="h-3 w-3/5 bg-slate-100 rounded" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <div className="h-9 w-full bg-slate-100 rounded-xl" />
                <div className="h-9 w-full bg-lime-400/40 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
