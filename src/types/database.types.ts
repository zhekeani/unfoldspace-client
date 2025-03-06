import { Database } from "./supabase.types";

export type ServiceUser = Database["public"]["Tables"]["service_users"]["Row"];
export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type Topic = Database["public"]["Tables"]["topics"]["Row"];
