import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { Story, Topic } from "@/types/database.types";

export const fetchMainSidebarData = async (): Promise<{
  stories: Story[];
  topics: Topic[];
  lastSavedStories: Story[];
} | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const [storiesRes, topicsRes, lastSavedStories] = await Promise.all([
      supabase
        .from("stories")
        .select("*")
        .eq("user_id", "ec37a113-9d04-42a1-a662-fe36b2e4d4cf")
        .order("published_at", { ascending: false })
        .limit(3),
      supabase.from("topics").select("*").eq("depth_level", 1),
      supabase.rpc("get_active_user_last_saved_stories"),
    ]);

    if (storiesRes.error || !storiesRes.data) {
      console.error(storiesRes.error);
      throw new Error("Failed to fetch sidebar recommended stories.");
    }
    if (topicsRes.error || !topicsRes.data) {
      console.error(topicsRes.error);
      throw new Error("Failed to fetch sidebar recommended topics.");
    }
    if (lastSavedStories.error) {
      console.error(lastSavedStories.error);
      throw new Error("Failed to fetch last saved stories.");
    }

    return {
      stories: storiesRes.data,
      topics: topicsRes.data,
      lastSavedStories: lastSavedStories.data,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
