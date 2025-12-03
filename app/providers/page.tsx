import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProvidersClient from "./ProvidersClient";

// Force dynamic rendering to avoid static generation at build time
export const dynamic = 'force-dynamic';

export default async function ProvidersPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Load providers server-side
  const { data: providers, error: providersError } = await supabase
    .from("model_providers")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (providersError) {
    throw new Error("Failed to load providers");
  }

  return <ProvidersClient initialProviders={providers || []} userId={user.id} />;
}
