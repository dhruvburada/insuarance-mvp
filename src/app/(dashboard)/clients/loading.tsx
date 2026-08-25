export default function ClientsLoading() {
  return (
    <div className="space-y-6 animate-pulse pb-12">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-80 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-lime-400/40 rounded-xl" />
      </div>

      {/* CLIENT TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between">
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="h-3.5 w-20 bg-slate-200 rounded hidden sm:block" />
          <div className="h-3.5 w-24 bg-slate-200 rounded hidden md:block" />
          <div className="h-3.5 w-16 bg-slate-200 rounded hidden sm:block" />
          <div className="h-3.5 w-20 bg-slate-200 rounded hidden lg:block" />
          <div className="h-3.5 w-16 bg-slate-200 rounded" />
        </div>

        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5 w-1/4">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded sm:hidden" />
              </div>

              <div className="space-y-1 w-1/4 hidden sm:block">
                <div className="h-3.5 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-36 bg-slate-100 rounded" />
              </div>

              <div className="w-1/6 hidden md:block">
                <div className="h-4 w-24 bg-slate-200 rounded font-mono" />
              </div>

              <div className="w-1/6 hidden sm:block">
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
              </div>

              <div className="w-1/6 hidden lg:block">
                <div className="h-3.5 w-20 bg-slate-100 rounded" />
              </div>

              <div className="w-28 flex justify-end">
                <div className="h-8 w-24 bg-slate-100 rounded-lg border border-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
