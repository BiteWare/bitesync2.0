import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { UserProfile, UserProfileUpdate } from '@/types/user.types'
import { useToast } from '@/hooks/use-toast'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user found')

      // Try to fetch the user's profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([
              {
                auth_id: user.id,
                user_id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || null,
                primary_role: 'developer',
                team: 'engineering',
                timezone: 'pt',
                work_start: '09:00',
                work_end: '17:00',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
            throw createError
          }
          
          setProfile(newProfile as UserProfile)
          return
        }
        throw error
      }

      setProfile(data as UserProfile)
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: UserProfileUpdate) => {
    try {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user found')

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', user.id)

      if (error) throw error

      await fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: fetchProfile,
  }
} 