import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-slate-200 p-8 text-center shadow-xl space-y-4">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-pine-950">Resource Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested client record, proposal document, or insurance policy could not be found or has expired.
        </p>
        <div className="pt-2">
          <Button variant="default" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
