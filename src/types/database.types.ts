import { Database } from "./supabase.types";

export type ServiceUser = Database["public"]["Tables"]["service_users"]["Row"];
export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type ReadingList = Database["public"]["Tables"]["reading_lists"]["Row"];
export type Topic = Database["public"]["Tables"]["topics"]["Row"];
export type ReadingListVisibility =
  Database["public"]["Enums"]["reading_list_visibility"];
export type ReadingListItem =
  Database["public"]["Tables"]["reading_list_items"]["Row"];
export type StoryResponse = Database["public"]["Tables"]["responses"]["Row"];
export type ListResponse =
  Database["public"]["Tables"]["reading_list_responses"]["Row"];

export type UserWFollowStatus = ServiceUser & { has_followed: boolean };
export type ReadingListDetail =
  Database["public"]["Functions"]["get_reading_list_detail"]["Returns"][number];
export type StoryDetail =
  Database["public"]["Functions"]["get_story_detail"]["Returns"][number];

export type ExtendedStoryResponse = StoryResponse & { has_clapped: boolean };
export type ExtendedListResponse = ListResponse & { has_clapped: boolean };

export type ExtendedTopic = Topic & { children: ExtendedTopic[] };
