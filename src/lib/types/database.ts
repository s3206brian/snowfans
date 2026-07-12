// Auto-generated from Supabase — run `npx supabase gen types typescript` to update

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          short_link: string
          trip_status: 'teaching' | 'learning' | 'finding_buddy' | null
          board_type: 'snowboard' | 'ski' | 'both' | null
          years_experience: number | null
          instructor_cert: boolean
          is_public: boolean
          privacy_settings: Json
          eula_accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          short_link: string
          trip_status?: 'teaching' | 'learning' | 'finding_buddy' | null
          board_type?: 'snowboard' | 'ski' | 'both' | null
          years_experience?: number | null
          instructor_cert?: boolean
          privacy_settings?: Json
          eula_accepted_at?: string | null
        }
        Update: {
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          short_link?: string
          trip_status?: 'teaching' | 'learning' | 'finding_buddy' | null
          board_type?: 'snowboard' | 'ski' | 'both' | null
          years_experience?: number | null
          instructor_cert?: boolean
          is_public?: boolean
          privacy_settings?: Json
          eula_accepted_at?: string | null
        }
        Relationships: []
      }
      resort_visits: {
        Row: {
          id: string
          profile_id: string
          resort_id: string
          visited_at: string | null
          visited_end: string | null
          notes: string | null
          snow_condition: 'powder' | 'groomed' | 'icy' | 'wet' | 'variable' | null
          created_at: string
        }
        Insert: {
          profile_id: string
          resort_id: string
          visited_at?: string | null
          visited_end?: string | null
          notes?: string | null
          snow_condition?: 'powder' | 'groomed' | 'icy' | 'wet' | 'variable' | null
        }
        Update: {
          profile_id?: string
          resort_id?: string
          visited_at?: string | null
          visited_end?: string | null
          notes?: string | null
          snow_condition?: 'powder' | 'groomed' | 'icy' | 'wet' | 'variable' | null
        }
        Relationships: [
          {
            foreignKeyName: "resort_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resort_visits_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      resorts: {
        Row: {
          id: string
          name: string
          name_zh: string | null
          country: string
          region: string | null
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          name: string
          name_zh?: string | null
          country: string
          region?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          name?: string
          name_zh?: string | null
          country?: string
          region?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          id: string
          profile_id: string
          category: 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other'
          brand: string | null
          model: string | null
          year: number | null
          notes: string | null
          image_urls: string[]
          for_sale: boolean
          sale_price: number | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          profile_id: string
          category: 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other'
          brand?: string | null
          model?: string | null
          year?: number | null
          notes?: string | null
          image_urls?: string[]
          for_sale?: boolean
          sale_price?: number | null
          is_public?: boolean
        }
        Update: {
          category?: 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other'
          brand?: string | null
          model?: string | null
          year?: number | null
          notes?: string | null
          image_urls?: string[]
          for_sale?: boolean
          sale_price?: number | null
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "equipment_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          category: 'skill' | 'style' | 'resort' | 'general'
        }
        Insert: {
          name: string
          category: 'skill' | 'style' | 'resort' | 'general'
        }
        Update: {
          name?: string
          category?: 'skill' | 'style' | 'resort' | 'general'
        }
        Relationships: []
      }
      profile_tags: {
        Row: {
          profile_id: string
          tag_id: string
        }
        Insert: {
          profile_id: string
          tag_id: string
        }
        Update: {
          profile_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_tags_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_runs: {
        Row: {
          id: string
          visit_id: string
          osm_id: string
          run_name: string | null
          difficulty: string | null
          created_at: string
        }
        Insert: {
          visit_id: string
          osm_id: string
          run_name?: string | null
          difficulty?: string | null
        }
        Update: {
          run_name?: string | null
          difficulty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visit_runs_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "resort_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          id: string
          profile_id: string
          resort_id: string | null
          title: string | null
          content: string | null
          image_urls: string[]
          is_public: boolean
          created_at: string
        }
        Insert: {
          profile_id: string
          resort_id?: string | null
          title?: string | null
          content?: string | null
          image_urls?: string[]
          is_public?: boolean
        }
        Update: {
          title?: string | null
          content?: string | null
          image_urls?: string[]
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          id: string
          profile_id: string
          resort_id: string | null
          resort_name: string | null
          start_date: string
          end_date: string | null
          status: 'teaching' | 'finding_buddy' | 'learning'
          description: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          profile_id: string
          resort_id?: string | null
          resort_name?: string | null
          start_date: string
          end_date?: string | null
          status: 'teaching' | 'finding_buddy' | 'learning'
          description?: string | null
          is_public?: boolean
        }
        Update: {
          resort_id?: string | null
          resort_name?: string | null
          start_date?: string
          end_date?: string | null
          status?: 'teaching' | 'finding_buddy' | 'learning'
          description?: string | null
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "trips_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          user_a: string
          user_b: string
          created_at: string
        }
        Insert: {
          user_a: string
          user_b: string
        }
        Update: {
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          body: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          conversation_id: string
          sender_id: string
          body: string
          read_at?: string | null
        }
        Update: {
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_users: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          blocker_id: string
          blocked_id: string
        }
        Update: {
          blocker_id?: string
          blocked_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_id: string | null
          content_type: 'profile' | 'trip' | 'equipment' | 'message'
          content_id: string | null
          reason: 'inappropriate_content' | 'harassment' | 'spam' | 'other'
          details: string | null
          status: 'open' | 'reviewing' | 'resolved' | 'dismissed'
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          reporter_id: string
          reported_id?: string | null
          content_type?: 'profile' | 'trip' | 'equipment' | 'message'
          content_id?: string | null
          reason: 'inappropriate_content' | 'harassment' | 'spam' | 'other'
          details?: string | null
        }
        Update: {
          status?: 'open' | 'reviewing' | 'resolved' | 'dismissed'
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
        }
        Update: {
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      delete_current_user: {
        Args: Record<string, never>
        Returns: undefined
      }
      blocked_between: {
        Args: { a: string; b: string }
        Returns: boolean
      }
      can_view_section: {
        Args: { owner_id: string; section: string }
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
