export default function ClientNewLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse pb-12">
      {/* HEADER SKELETON */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="h-3 w-28 bg-slate-200 rounded" />
        <div className="h-8 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-96 bg-slate-100 rounded-lg" />
      </div>

      {/* FORM CARD SKELETON */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm space-y-8">
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="space-y-4">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-20 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* SECTION 2: FINANCIAL & UNDERWRITING */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="h-5 w-52 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <div className="h-11 w-44 bg-lime-400/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
