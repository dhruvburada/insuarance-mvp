import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Agent } from "@/types/product.types";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-lime-400 selection:text-pine-950">
      <header className="bg-pine-950 text-white border-b border-pine-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-lime-400 text-pine-950 flex items-center justify-center font-extrabold text-lg shadow-sm">
                🛡️
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Insure<span className="text-lime-400">Agent</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              <Link href="/" className="hover:text-lime-400 transition-colors">
                Overview
              </Link>
              <Link href="/clients" className="hover:text-lime-400 transition-colors">
                Clients
              </Link>
              <Link href="/products" className="hover:text-lime-400 transition-colors">
                Catalog
              </Link>
              <Link href="/payments" className="hover:text-lime-400 transition-colors">
                Payments
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
              Agent: <strong className="text-white">{agent?.full_name || user.email}</strong>
            </span>
            <form action="/auth/signout" method="post">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="bg-pine-900 hover:bg-pine-800 border-pine-800 text-slate-200 hover:text-white"
              >
                Sign Out
              </Button>
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
