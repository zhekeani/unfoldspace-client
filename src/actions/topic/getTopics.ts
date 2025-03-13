"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ExtendedTopic, Topic } from "@/types/database.types";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to fetch all topics and structure them into a hierarchical format
 */
export async function getTopicsHierarchy(): Promise<
  ActionResponse<{ topics: ExtendedTopic[] }>
> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: topics, error: fetchError } = await supabase
      .from("topics")
      .select("*");

    if (fetchError || !topics) {
      return {
        success: false,
        error: `Failed to fetch topics. ${fetchError?.message}`,
      };
    }

    const buildTopicTree = (flatTopics: Topic[]) => {
      const topicMap = new Map<string, ExtendedTopic>();

      flatTopics.forEach((topic) => {
        topicMap.set(topic.id, { ...topic, children: [] });
      });

      const rootTopics: ExtendedTopic[] = [];

      flatTopics.forEach((topic) => {
        if (topic.parent_id) {
          const parent = topicMap.get(topic.parent_id);
          if (parent) {
            parent.children.push(topicMap.get(topic.id)!);
          }
        } else {
          rootTopics.push(topicMap.get(topic.id)!);
        }
      });

      return rootTopics;
    };

    const structuredTopics = buildTopicTree(topics);

    return {
      success: true,
      data: { topics: structuredTopics },
    };
  } catch (error) {
    console.error("Error in getTopicsHierarchy:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
