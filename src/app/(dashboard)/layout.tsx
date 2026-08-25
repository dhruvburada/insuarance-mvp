import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Agent } from "@/types/product.types";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: agentData } = await supabase
    .from("agents")
    .select("*")
    .eq("id", user.id)
    .single();

  const agent = agentData as Agent | null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-primary">🛡️</span> InsureAgent
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-primary transition-colors">Overview</Link>
              <Link href="/clients" className="hover:text-primary transition-colors">Clients</Link>
              <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
              <Link href="/payments" className="hover:text-primary transition-colors">Payments</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm text-slate-600 font-medium hidden sm:inline-block">
              {agent?.full_name || user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
