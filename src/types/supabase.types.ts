export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      claps: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claps_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      following: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "following_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "following_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_list_claps: {
        Row: {
          created_at: string
          id: string
          reading_list_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reading_list_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reading_list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_claps_reading_list_id_fkey"
            columns: ["reading_list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_list_claps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_list_items: {
        Row: {
          created_at: string
          id: string
          note: string | null
          reading_list_id: string
          story_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          reading_list_id: string
          story_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          reading_list_id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_items_reading_list_id_fkey"
            columns: ["reading_list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_list_items_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_list_response_claps: {
        Row: {
          created_at: string
          id: string
          response_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_response_claps_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "reading_list_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_list_response_claps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_list_responses: {
        Row: {
          author_name: string | null
          author_profile_picture: string | null
          author_username: string | null
          claps_count: number
          content: string
          created_at: string
          id: string
          reading_list_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string | null
          author_profile_picture?: string | null
          author_username?: string | null
          claps_count?: number
          content: string
          created_at?: string
          id?: string
          reading_list_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string | null
          author_profile_picture?: string | null
          author_username?: string | null
          claps_count?: number
          content?: string
          created_at?: string
          id?: string
          reading_list_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_responses_reading_list_id_fkey"
            columns: ["reading_list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_list_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_lists: {
        Row: {
          claps_count: number
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          owner_name: string | null
          owner_profile_picture: string | null
          owner_username: string | null
          recent_story_covers: Json | null
          responses_count: number
          stories_count: number | null
          title: string
          updated_at: string
          user_id: string
          visibility: Database["public"]["Enums"]["reading_list_visibility"]
        }
        Insert: {
          claps_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          owner_name?: string | null
          owner_profile_picture?: string | null
          owner_username?: string | null
          recent_story_covers?: Json | null
          responses_count?: number
          stories_count?: number | null
          title: string
          updated_at?: string
          user_id: string
          visibility: Database["public"]["Enums"]["reading_list_visibility"]
        }
        Update: {
          claps_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          owner_name?: string | null
          owner_profile_picture?: string | null
          owner_username?: string | null
          recent_story_covers?: Json | null
          responses_count?: number
          stories_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: Database["public"]["Enums"]["reading_list_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "reading_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      response_claps: {
        Row: {
          created_at: string
          id: string
          response_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_claps_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_claps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          author_name: string | null
          author_profile_picture: string | null
          author_username: string | null
          claps_count: number | null
          created_at: string
          edited_at: string | null
          html_content: string
          id: string
          json_content: Json
          parent_id: string | null
          story_id: string
          total_replies: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string | null
          author_profile_picture?: string | null
          author_username?: string | null
          claps_count?: number | null
          created_at?: string
          edited_at?: string | null
          html_content: string
          id?: string
          json_content: Json
          parent_id?: string | null
          story_id: string
          total_replies?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string | null
          author_profile_picture?: string | null
          author_username?: string | null
          claps_count?: number | null
          created_at?: string
          edited_at?: string | null
          html_content?: string
          id?: string
          json_content?: Json
          parent_id?: string | null
          story_id?: string
          total_replies?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_reading_lists: {
        Row: {
          created_at: string
          id: string
          reading_list_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reading_list_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reading_list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reading_lists_reading_list_id_fkey"
            columns: ["reading_list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_reading_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_users: {
        Row: {
          bio: Json | null
          created_at: string
          default_reading_list_id: string | null
          email: string
          followers_count: number | null
          following_count: number | null
          id: string
          is_verified: boolean | null
          name: string
          profile_picture: string | null
          pronouns: string | null
          reading_lists_count: number | null
          short_bio: string | null
          social_links: Json | null
          stories_count: number | null
          supabase_user_id: string
          username: string
        }
        Insert: {
          bio?: Json | null
          created_at?: string
          default_reading_list_id?: string | null
          email: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          name: string
          profile_picture?: string | null
          pronouns?: string | null
          reading_lists_count?: number | null
          short_bio?: string | null
          social_links?: Json | null
          stories_count?: number | null
          supabase_user_id: string
          username: string
        }
        Update: {
          bio?: Json | null
          created_at?: string
          default_reading_list_id?: string | null
          email?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          name?: string
          profile_picture?: string | null
          pronouns?: string | null
          reading_lists_count?: number | null
          short_bio?: string | null
          social_links?: Json | null
          stories_count?: number | null
          supabase_user_id?: string
          username?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_name: string | null
          author_profile_picture: string | null
          author_username: string | null
          claps_count: number
          cover_image: string | null
          created_at: string
          description: string | null
          html_content: string | null
          id: string
          json_content: Json
          published_at: string | null
          recent_top_response_ids: Json | null
          responses_count: number
          title: string
          topic_ids: Json | null
          updated_at: string
          user_id: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          words_count: number
        }
        Insert: {
          author_name?: string | null
          author_profile_picture?: string | null
          author_username?: string | null
          claps_count?: number
          cover_image?: string | null
          created_at?: string
          description?: string | null
          html_content?: string | null
          id?: string
          json_content: Json
          published_at?: string | null
          recent_top_response_ids?: Json | null
          responses_count?: number
          title: string
          topic_ids?: Json | null
          updated_at?: string
          user_id: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          words_count?: number
        }
        Update: {
          author_name?: string | null
          author_profile_picture?: string | null
          author_username?: string | null
          claps_count?: number
          cover_image?: string | null
          created_at?: string
          description?: string | null
          html_content?: string | null
          id?: string
          json_content?: Json
          published_at?: string | null
          recent_top_response_ids?: Json | null
          responses_count?: number
          title?: string
          topic_ids?: Json | null
          updated_at?: string
          user_id?: string
          visibility?: Database["public"]["Enums"]["story_visibility"]
          words_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
      story_topics: {
        Row: {
          created_at: string
          id: string
          story_id: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_topics_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          depth_level: number | null
          description: string
          id: string
          name: string
          parent_id: string | null
          total_stories: number | null
        }
        Insert: {
          depth_level?: number | null
          description: string
          id?: string
          name: string
          parent_id?: string | null
          total_stories?: number | null
        }
        Update: {
          depth_level?: number | null
          description?: string
          id?: string
          name?: string
          parent_id?: string | null
          total_stories?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_topics: {
        Row: {
          created_at: string
          id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_topics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "service_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_default_reading_list_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_active_service_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          supabase_user_id: string
          username: string
          profile_picture: string
          name: string
          pronouns: string
          short_bio: string
          bio: Json
          social_links: Json
          is_verified: boolean
          email: string
          following_count: number
          followers_count: number
          reading_lists_count: number
          stories_count: number
          default_reading_list_id: string
        }[]
      }
      get_active_service_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_active_user_last_saved_stories: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          cover_image: string
          claps_count: number
          responses_count: number
          title: string
          description: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          published_at: string
          words_count: number
          html_content: string
          json_content: Json
          author_name: string
          author_profile_picture: string
          recent_top_response_ids: Json
          topic_ids: Json
          author_username: string
        }[]
      }
      get_reading_list_detail: {
        Args: {
          list_id_param: string
          active_user: string
        }
        Returns: {
          id: string
          created_at: string
          user_id: string
          title: string
          visibility: Database["public"]["Enums"]["reading_list_visibility"]
          is_default: boolean
          updated_at: string
          description: string
          claps_count: number
          responses_count: number
          owner_name: string
          owner_profile_picture: string
          recent_story_covers: Json
          stories_count: number
          owner_username: string
          is_saved: boolean
          has_clapped: boolean
          has_responded: boolean
        }[]
      }
      get_reading_list_items: {
        Args: {
          list_id_param: string
        }
        Returns: {
          id: string
          created_at: string
          reading_list_id: string
          story_id: string
          note: string
          story_created_at: string
          story_updated_at: string
          story_user_id: string
          cover_image: string
          claps_count: number
          responses_count: number
          title: string
          description: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          published_at: string
          words_count: number
          html_content: string
          json_content: Json
          author_name: string
          author_profile_picture: string
          recent_top_response_ids: Json
          topic_ids: Json
          author_username: string
        }[]
      }
      get_response_by_id: {
        Args: {
          response_id_param: string
          active_user: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          story_id: string
          parent_id: string
          author_name: string
          author_username: string
          author_profile_picture: string
          html_content: string
          json_content: Json
          claps_count: number
          total_replies: number
          edited_at: string
          has_clapped: boolean
        }[]
      }
      get_response_replies: {
        Args: {
          parent_id_param: string
          active_user: string
          limit_param?: number
          offset_param?: number
          cursor?: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          story_id: string
          parent_id: string
          author_name: string
          author_username: string
          author_profile_picture: string
          html_content: string
          json_content: Json
          claps_count: number
          total_replies: number
          edited_at: string
          has_clapped: boolean
        }[]
      }
      get_service_user_with_follow_status: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          created_at: string
          supabase_user_id: string
          username: string
          profile_picture: string
          name: string
          pronouns: string
          short_bio: string
          bio: Json
          social_links: Json
          is_verified: boolean
          email: string
          following_count: number
          followers_count: number
          reading_lists_count: number
          stories_count: number
          default_reading_list_id: string
          has_followed: boolean
        }[]
      }
      get_stories_by_topic: {
        Args: {
          topic_name?: string
          limit_param?: number
          offset_param?: number
          cursor?: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          cover_image: string
          claps_count: number
          responses_count: number
          title: string
          description: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          published_at: string
          words_count: number
          html_content: string
          json_content: Json
          author_name: string
          author_profile_picture: string
          recent_top_response_ids: Json
          topic_ids: Json
          author_username: string
          is_saved: boolean
        }[]
      }
      get_story_by_id: {
        Args: {
          story_id: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          cover_image: string
          claps_count: number
          responses_count: number
          title: string
          description: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          published_at: string
          words_count: number
          html_content: string
          json_content: Json
          author_name: string
          author_profile_picture: string
          recent_top_response_ids: Json
          topic_ids: Json
          author_username: string
          is_saved: boolean
        }[]
      }
      get_story_detail: {
        Args: {
          story_id_param: string
          active_user: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          cover_image: string
          claps_count: number
          responses_count: number
          title: string
          description: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          published_at: string
          words_count: number
          html_content: string
          json_content: Json
          author_name: string
          author_profile_picture: string
          recent_top_response_ids: Json
          topic_ids: Json
          author_username: string
          is_saved: boolean
          has_clapped: boolean
          has_responded: boolean
        }[]
      }
      get_story_responses: {
        Args: {
          story_id_param: string
          active_user: string
          limit_param?: number
          offset_param?: number
          cursor?: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          story_id: string
          parent_id: string
          author_name: string
          author_username: string
          author_profile_picture: string
          html_content: string
          json_content: Json
          claps_count: number
          total_replies: number
          edited_at: string
          has_clapped: boolean
        }[]
      }
      get_topics_hierarchy: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_reading_lists: {
        Args: {
          target_user: string
          active_user: string
        }
        Returns: {
          id: string
          created_at: string
          user_id: string
          title: string
          visibility: Database["public"]["Enums"]["reading_list_visibility"]
          is_default: boolean
          updated_at: string
          description: string
          claps_count: number
          responses_count: number
          owner_name: string
          owner_profile_picture: string
          recent_story_covers: Json
          stories_count: number
          owner_username: string
          is_saved: boolean
          has_clapped: boolean
          has_responded: boolean
        }[]
      }
      get_user_reading_lists_with_saved_status: {
        Args: {
          story_id_param: string
        }
        Returns: {
          id: string
          title: string
          is_saved: boolean
          is_default: boolean
          visibility: Database["public"]["Enums"]["reading_list_visibility"]
        }[]
      }
      get_user_stories: {
        Args: {
          target_user: string
          active_user: string
          limit_param?: number
          offset_param?: number
          cursor?: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          cover_image: string
          claps_count: number
          responses_count: number
          title: string
          description: string
          visibility: Database["public"]["Enums"]["story_visibility"]
          published_at: string
          words_count: number
          html_content: string
          json_content: Json
          author_name: string
          author_profile_picture: string
          recent_top_response_ids: Json
          topic_ids: Json
          author_username: string
          is_saved: boolean
        }[]
      }
      update_story_topics: {
        Args: {
          p_story_id: string
          p_new_topic_ids: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      reading_list_visibility: "private" | "public"
      story_visibility: "draft" | "private" | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

