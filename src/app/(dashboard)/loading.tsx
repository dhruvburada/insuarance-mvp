export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-12">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* STATS / BENTO CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-5 w-5 bg-slate-100 rounded-full" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* CONTENT SKELETON */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded-lg" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-12 w-full bg-slate-50 rounded-xl flex items-center px-4 justify-between">
              <div className="h-4 w-1/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/5 bg-slate-100 rounded" />
              <div className="h-4 w-1/6 bg-slate-100 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
