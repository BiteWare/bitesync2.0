import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { UserProfileType, UserProfileUpdate } from '@/types/user.types'
import { useToast } from '@/hooks/use-toast'

type DatabaseUser = {
  id: string
  auth_id: string
  email: string
  full_name: string | null
  primary_role: string | null
  team: string | null
  timezone: string | null
  work_start: string | null
  work_end: string | null
  working_days?: string[]
  created_at: string
  updated_at: string
}

export function useUserProfile() {
  const [profiles, setProfiles] = useState<UserProfileType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) return setProfiles([])

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id) as { data: DatabaseUser[] | null, error: any }

      if (error) throw error

      if (!data) return setProfiles([])

      const transformedData = data.map(profile => ({
        ...profile,
        user_id: profile.id,
        working_days: profile.working_days || [],
        primary_role: (profile.primary_role as UserProfileType['primary_role']) || 'developer',
        team: (profile.team as UserProfileType['team']) || 'engineering',
        timezone: profile.timezone || 'pt',
        work_start: profile.work_start || '09:00',
        work_end: profile.work_end || '17:00'
      })) as UserProfileType[]

      setProfiles(transformedData)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const addProfile = async (profile: UserProfileUpdate) => {
    try {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user found')
      if (!user.email) throw new Error('User email is required')

      console.log('Current user:', user)

      const newProfile = {
        auth_id: user.id,
        email: user.email,
        full_name: profile.full_name || '',
        primary_role: profile.primary_role || 'developer',
        team: profile.team || 'engineering',
        timezone: profile.timezone || 'pt',
        work_start: profile.work_start || '09:00',
        work_end: profile.work_end || '17:00',
        working_days: profile.working_days || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Inserting profile:', newProfile)

      const { data, error } = await supabase
        .from('users')
        .insert(newProfile)
        .select()

      if (error) {
        console.error('Insert error:', error)
        throw error
      }

      console.log('Insert response:', data)

      await fetchProfiles()
    } catch (error) {
      console.error('Error adding profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userId: string, updates: UserProfileUpdate) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error

      await fetchProfiles()
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteProfile = async (userId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Delete error:', error)
        throw error
      }

      await fetchProfiles()
    } catch (error) {
      console.error('Error deleting profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    profiles,
    loading,
    addProfile,
    updateProfile,
    deleteProfile,
    refreshProfiles: fetchProfiles,
  }
} 