import { Database } from "@/types/supabase.types";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./supabaseConfig";

export const getSupabaseAdminClient = () => {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (serviceRoleKey && url) {
    return createClient<Database>(url, serviceRoleKey);
  }
};
