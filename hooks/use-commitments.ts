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
    if (!user?.id) return
    
    try {
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true })

      if (error) throw error
      
      setCommitments((data as DbCommitment[]).map(item => ({
        id: item.id,
        userId: item.user_id,
        type: item.type,
        flexibility: item.flexibility,
        title: item.title,
        startDate: item.start_date,
        endDate: item.end_date,
        startTime: item.start_time,
        endTime: item.end_time
      })))
    } catch (error) {
      console.error('Error fetching commitments:', error)
      toast({
        title: "Error fetching commitments",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function addCommitment(commitment: Omit<Commitment, 'id' | 'userId'>) {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('commitments')
        .insert({
          user_id: user.id,
          type: commitment.type,
          flexibility: commitment.flexibility,
          title: commitment.title,
          start_date: commitment.startDate,
          end_date: commitment.endDate,
          start_time: commitment.startTime,
          end_time: commitment.endTime
        })
        .select()
        .single()

      if (error) throw error

      const newCommitment: Commitment = {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        flexibility: data.flexibility,
        title: data.title,
        startDate: data.start_date,
        endDate: data.end_date,
        startTime: data.start_time,
        endTime: data.end_time
      }

      setCommitments(prev => [...prev, newCommitment])

      toast({
        title: "Success",
        description: "Commitment added successfully"
      })
    } catch (error) {
      toast({
        title: "Error adding commitment",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
    }
  }

  async function updateCommitment(commitment: Commitment) {
    try {
      if (commitment.userId !== user?.id) {
        throw new Error("You can only edit your own commitments")
      }

      const { error } = await supabase
        .from('commitments')
        .update({
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
      const commitment = commitments.find(c => c.id === id)
      if (commitment?.userId !== user.id) {
        throw new Error("You can only delete your own commitments")
      }

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
      const selectedCommitments = commitments.filter(c => ids.includes(c.id))
      if (!selectedCommitments.every(c => c.userId === user.id)) {
        throw new Error("You can only delete your own commitments")
      }

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