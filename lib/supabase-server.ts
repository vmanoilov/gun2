import { createClient } from "@supabase/supabase-js";

// Check if Supabase is configured
const hasSupabaseConfig = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServerClient = hasSupabaseConfig
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : createClient(
      "https://placeholder.supabase.co",
      "placeholder-service-role-key"
    );
