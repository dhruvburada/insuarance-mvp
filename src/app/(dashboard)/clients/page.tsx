import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";
import { Client } from "@/types/product.types";

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
          <h1 className="text-2xl font-bold text-slate-900">Client Portfolio</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your client profiles, matched insurance products, and quotes
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
        >
          + Onboard Client
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">👥</span>
            <h3 className="text-lg font-semibold text-slate-900 mt-3">No clients onboarded yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Start by creating your first client profile to match them with applicable insurance policies.
            </p>
            <Link
              href="/clients/new"
              className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Onboard first client →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Client Name</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Annual Income</th>
                  <th className="px-6 py-3.5">Smoker</th>
                  <th className="px-6 py-3.5">Onboarded</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <Link href={`/clients/${client.id}`} className="hover:text-primary">
                        {client.first_name} {client.last_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>{client.phone}</div>
                      <div className="text-xs text-slate-400">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrencyINR(Number(client.annual_income))}
                    </td>
                    <td className="px-6 py-4">
                      {client.is_smoker ? (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Yes</span>
                      ) : (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(client.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/clients/${client.id}`}
                        className="text-xs font-semibold text-primary hover:underline bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-md transition-colors"
                      >
                        View & Match →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
