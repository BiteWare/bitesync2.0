export interface UserProfile {
  id: string
  user_id: string
  auth_id: string
  email: string
  full_name: string | null
  primary_role: string | null
  team: string | null
  timezone: string | null
  work_start: string | null
  work_end: string | null
  created_at: string
  updated_at: string
}

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'user_id' | 'auth_id' | 'created_at' | 'updated_at'>> 