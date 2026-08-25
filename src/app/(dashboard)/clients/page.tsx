import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";
import { Client } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, UserPlus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: clientsData } = await supabase
    .from("clients")
    .select("*")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  const clients = (clientsData || []) as Client[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight">
            Client Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your client profiles, matched insurance products, and quotes
          </p>
        </div>
        <Button variant="lime" asChild>
          <Link href="/clients/new">
            <UserPlus className="mr-2 h-4 w-4" /> Onboard Client
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-lime-100 text-pine-950 flex items-center justify-center font-bold text-xl border border-lime-300">
              <Users className="h-6 w-6 text-pine-950" />
            </div>
            <h3 className="text-lg font-extrabold text-pine-950">No clients onboarded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start by creating your first client profile to evaluate deterministic policy eligibility.
            </p>
            <div className="pt-2">
              <Button variant="default" size="sm" asChild>
                <Link href="/clients/new">
                  Onboard First Client →
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Annual Income</th>
                  <th className="px-6 py-4">Smoker</th>
                  <th className="px-6 py-4">Onboarded</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-pine-950">
                      <Link href={`/clients/${client.id}`} className="hover:underline flex items-center gap-2">
                        {client.first_name} {client.last_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{client.phone}</div>
                      <div className="text-xs text-slate-400">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-pine-950">
                      {formatCurrencyINR(Number(client.annual_income))}
                    </td>
                    <td className="px-6 py-4">
                      {client.is_smoker ? (
                        <Badge variant="warning">Smoker</Badge>
                      ) : (
                        <Badge variant="success">Non-Smoker</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      {formatDate(client.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/clients/${client.id}`}>
                          Match Policies <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
