import { Database } from "./supabase.types";

export type ServiceUser = Database["public"]["Tables"]["service_users"]["Row"];
export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type ReadingList = Database["public"]["Tables"]["reading_lists"]["Row"];
export type Topic = Database["public"]["Tables"]["topics"]["Row"];
export type ReadingListVisibility =
  Database["public"]["Enums"]["reading_list_visibility"];
