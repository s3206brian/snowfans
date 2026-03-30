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
          privacy_settings?: Json
        }
        Relationships: []
      }
      resort_visits: {
        Row: {
          id: string
          profile_id: string
          resort_id: string
          visited_at: string | null
          notes: string | null
          snow_condition: 'powder' | 'groomed' | 'icy' | 'wet' | 'variable' | null
          created_at: string
        }
        Insert: {
          profile_id: string
          resort_id: string
          visited_at?: string | null
          notes?: string | null
        }
        Update: {
          profile_id?: string
          resort_id?: string
          visited_at?: string | null
          notes?: string | null
        }
        Relationships: []
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
          is_public?: boolean
        }
        Update: {
          category?: 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other'
          brand?: string | null
          model?: string | null
          year?: number | null
          notes?: string | null
          is_public?: boolean
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
