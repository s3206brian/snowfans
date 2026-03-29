import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ResortVisit = Database['public']['Tables']['resort_visits']['Row']
export type Resort = Database['public']['Tables']['resorts']['Row']
export type Equipment = Database['public']['Tables']['equipment']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']

export type TripStatus = 'teaching' | 'learning' | 'finding_buddy'

export type PrivacyLevel = 'public' | 'followers' | 'private'

export type PrivacySettings = {
  resort_visits: PrivacyLevel
  equipment: PrivacyLevel
  trip_status: PrivacyLevel
}

export type ProfileWithDetails = Profile & {
  resort_visits: (ResortVisit & { resort: Resort })[]
  equipment: Equipment[]
  tags: Tag[]
}
