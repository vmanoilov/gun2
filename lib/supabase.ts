import { createBrowserClient } from "@supabase/ssr";

// Check if Supabase is configured
const hasSupabaseConfig = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseBrowserClient = hasSupabaseConfig
  ? createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key"
    );
