export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Project = Database['public']['Tables']['projects']['Row']

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
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
        Insert: {
          id?: string
          auth_id: string
          email: string
          full_name?: string | null
          primary_role?: string | null
          team?: string | null
          timezone?: string | null
          work_start?: string | null
          work_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          email?: string
          full_name?: string | null
          primary_role?: string | null
          team?: string | null
          timezone?: string | null
          work_start?: string | null
          work_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          owner_id: string
          owner_email: string
          start_date: string | null
          end_date: string | null
          required_members: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          owner_id: string
          owner_email?: string
          start_date?: string | null
          end_date?: string | null
          required_members?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          owner_id?: string
          owner_email?: string
          start_date?: string | null
          end_date?: string | null
          required_members?: string | null
        }
      }
      commitments: {
        Row: {
          id: string
          user_id: string
          type: string
          flexibility: string
          title: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          start_time: string | null
          end_time: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          flexibility: string
          title: string
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
          start_time?: string | null
          end_time?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          flexibility?: string
          title?: string
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
          start_time?: string | null
          end_time?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 