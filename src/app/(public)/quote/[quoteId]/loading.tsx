export default function QuoteLoading() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center antialiased">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border-2 border-pine-950 overflow-hidden animate-pulse">
        {/* HEADER SKELETON */}
        <div className="bg-pine-950 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-lime-400/40 rounded-full" />
            <div className="h-4 w-24 bg-pine-900 rounded" />
          </div>
          <div className="h-8 w-3/4 bg-pine-900/80 rounded-xl" />
          <div className="h-4 w-1/2 bg-pine-900/60 rounded" />
        </div>

        {/* STATUS STRIP SKELETON */}
        <div className="bg-slate-100 p-4 px-6 flex items-center gap-3 border-b border-slate-200">
          <div className="h-9 w-9 rounded-full bg-slate-200" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-44 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-200/60 rounded" />
          </div>
        </div>

        {/* BODY SKELETON */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* COVERAGE & PREMIUM GRID */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-2 text-center">
              <div className="h-3 w-24 bg-slate-200 rounded mx-auto" />
              <div className="h-6 w-28 bg-slate-300 rounded mx-auto" />
            </div>
            <div className="space-y-2 text-center">
              <div className="h-3 w-24 bg-slate-200 rounded mx-auto" />
              <div className="h-6 w-28 bg-emerald-200 rounded mx-auto" />
            </div>
          </div>

          {/* FEATURES LIST */}
          <div className="space-y-2.5">
            <div className="h-3.5 w-40 bg-slate-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
              <div className="h-4 w-4/6 bg-slate-100 rounded" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="h-12 w-full bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
