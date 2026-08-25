export default function DashboardOverviewLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-12">
      {/* HERO BANNER SKELETON */}
      <div className="bg-pine-950/90 rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-pine-900 space-y-4">
        <div className="h-4 w-28 bg-pine-900 rounded-full" />
        <div className="space-y-2">
          <div className="h-9 w-3/4 sm:w-2/3 bg-pine-900/80 rounded-xl" />
          <div className="h-9 w-1/2 bg-pine-900/80 rounded-xl" />
        </div>
        <div className="h-4 w-full sm:w-1/2 bg-pine-900/60 rounded-lg" />
        <div className="pt-2 flex gap-3">
          <div className="h-10 w-44 bg-lime-400/40 rounded-xl" />
          <div className="h-10 w-48 bg-pine-900 rounded-xl border border-pine-800" />
        </div>
      </div>

      {/* METRIC BENTO CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-4 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-28 bg-slate-200 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* SHORTCUT CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="space-y-2 w-2/3">
              <div className="h-5 w-36 bg-slate-200 rounded-lg" />
              <div className="h-3.5 w-full bg-slate-100 rounded" />
            </div>
            <div className="h-9 w-28 bg-slate-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
