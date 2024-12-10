import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Task } from '@/types/database.types'
import { useSupabase } from '@/components/providers/supabase-provider'

export type TaskCreate = {
  project_id: string
  title: string
  duration: number
  order_index: number
  assigned_to: string
  auth_id: string
}

// Define the shape of raw data from Supabase
type RawTaskWithProject = {
  id: string
  project_id: string
  title: string
  assigned_to: string
  auth_id: string
  duration: number
  order_index: number
  created_at: string
  updated_at: string
  projects: {
    name: string
  } | null
}

export function useTasks() {
  const { user, session } = useSupabase()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchTasks() {
    try {
      if (!session || !user?.id) {
        setTasks([])
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          project_id,
          title, 
          assigned_to,
          duration,
          order_index,
          created_at,
          updated_at,
          projects!tasks_project_id_fkey (
            name
          )
        `)
        .eq('assigned_to', user.id) as { data: RawTaskWithProject[] | null; error: any }

      if (error) throw error
      
      const formattedTasks: Task[] = (data || []).map(task => ({
        ...task,
        projects: [{ name: task.projects?.name || 'Unknown Project' }]
      }))

      setTasks(formattedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error fetching tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function createTask(task: TaskCreate) {
    if (!user?.id) return

    try {
      const newTask = {
        project_id: task.project_id,
        title: task.title,
        duration: task.duration,
        order_index: task.order_index,
        assigned_to: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select(`
          id,
          project_id,
          title, 
          assigned_to,
          duration,
          order_index,
          created_at,
          updated_at,
          projects!tasks_project_id_fkey (
            name
          )
        `)
        .single() as { data: RawTaskWithProject | null; error: any }

      if (error) throw error

      await fetchTasks()

      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      })

      return data
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: "Error creating task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('assigned_to', user.id)
        .select(`
          id,
          project_id,
          title, 
          assigned_to,
          duration,
          order_index,
          created_at,
          updated_at,
          projects!tasks_project_id_fkey (
            name
          )
        `)
        .single() as { data: RawTaskWithProject | null; error: any }

      if (error) throw error

      const updatedTask: Task = {
        ...data!,
        projects: [{ name: data?.projects?.name || 'Unknown Project' }]
      }

      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })
      return updatedTask
    } catch (error) {
      toast({
        title: "Error updating task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  async function deleteTask(id: string) {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('assigned_to', user.id)

      if (error) throw error

      setTasks(prev => prev.filter(t => t.id !== id))
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    if (session && user?.id) {
      fetchTasks()
    } else {
      setLoading(false)
    }
  }, [session, user?.id])

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
} 