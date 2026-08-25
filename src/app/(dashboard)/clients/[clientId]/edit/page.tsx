import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Client } from "@/types/product.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ClientEditView from "./client-edit-view";

export const dynamic = "force-dynamic";

export default async function ClientEditPage({
  params,
}: {
  params: { clientId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: clientData, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.clientId)
    .eq("agent_id", user.id)
    .single();

  if (error || !clientData) {
    notFound();
  }

  const client = clientData as Client;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5">
            <Link href="/clients" className="hover:text-pine-950 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Clients
            </Link>
            <span>/</span>
            <Link
              href={`/clients/${client.id}`}
              className="hover:text-pine-950"
            >
              {client.first_name} {client.last_name}
            </Link>
            <span>/</span>
            <span className="text-pine-950 font-bold">Edit Dossier</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight">
            Edit Dossier: {client.first_name} {client.last_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update underwriting details, income brackets, or disclosed conditions to recalculate policy matches
          </p>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/clients/${client.id}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Dossier
          </Link>
        </Button>
      </div>

      <ClientEditView client={client} />
    </div>
  );
}
