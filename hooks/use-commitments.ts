import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useToast } from '@/hooks/use-toast'
import { Commitment, DbCommitment } from '@/types/custom'
import { supabase } from '@/lib/supabaseClient'

export function useCommitments() {
  const { user } = useSupabase()
  const { toast } = useToast()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchCommitments()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  async function fetchCommitments() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) return setCommitments([])

      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .eq('auth_id', user.id)

      if (error) throw error

      const transformedData: Commitment[] = (data || []).map(item => ({
        id: item.id,
        owner: user.email || '',
        type: item.type,
        flexibility: item.flexibility,
        title: item.title,
        startDate: item.start_date,
        endDate: item.end_date,
        startTime: item.start_time,
        endTime: item.end_time
      }))

      setCommitments(transformedData)
    } catch (error) {
      console.error('Error fetching commitments:', error)
      throw error
    }
  }

  async function addCommitment(commitment: Omit<Commitment, 'id'>) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user found')

      const dbCommitment = {
        user_id: user.id,
        auth_id: user.id,
        owner: commitment.owner || user.email || '',
        type: commitment.type,
        flexibility: commitment.flexibility,
        title: commitment.title,
        start_date: commitment.startDate,
        end_date: commitment.endDate,
        start_time: commitment.startTime,
        end_time: commitment.endTime,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('commitments')
        .insert(dbCommitment)

      if (error) throw error

      await fetchCommitments()

      toast({
        title: "Success",
        description: "Commitment created successfully"
      })
    } catch (error) {
      console.error('Error adding commitment:', error)
      toast({
        title: "Error creating commitment",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
      throw error
    }
  }

  async function updateCommitment(commitment: Commitment) {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('commitments')
        .update({
          owner: commitment.owner,
          type: commitment.type,
          flexibility: commitment.flexibility,
          title: commitment.title,
          start_date: commitment.startDate,
          end_date: commitment.endDate,
          start_time: commitment.startTime,
          end_time: commitment.endTime
        })
        .eq('id', commitment.id)
        .eq('user_id', user.id)

      if (error) throw error

      setCommitments(prev => 
        prev.map(c => c.id === commitment.id ? commitment : c)
      )

      toast({
        title: "Success",
        description: "Commitment updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error updating commitment",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    }
  }

  async function deleteCommitment(id: string) {
    if (!user?.id) return
    
    try {
      const { error } = await supabase
        .from('commitments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setCommitments(prev => prev.filter(c => c.id !== id))

      toast({
        title: "Success",
        description: "Commitment deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error deleting commitment",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    }
  }

  async function deleteMultipleCommitments(ids: string[]) {
    if (!user?.id) return
    
    try {
      const { error } = await supabase
        .from('commitments')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id)

      if (error) throw error

      setCommitments(prev => prev.filter(c => !ids.includes(c.id)))

      toast({
        title: "Success",
        description: "Commitments deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error deleting commitments",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    }
  }

  return {
    commitments,
    loading,
    addCommitment,
    updateCommitment,
    deleteCommitment,
    deleteMultipleCommitments
  }
} 