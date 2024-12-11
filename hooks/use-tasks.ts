import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Task } from '@/types/database.types'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useProjects } from '@/hooks/use-projects'

export type TaskCreate = {
  project_id: string | null
  title: string
  duration: number
  order_index: number
  assigned_to: string | null
  auth_id: string
}

type TaskResponse = {
  id: string
  project_id: string | null
  title: string
  assigned_to: string | null
  duration: number
  order_index: number
  created_at: string
  updated_at: string
  projects: {
    name: string
    owner_id: string
  } | null
}

export function useTasks() {
  const { user, session } = useSupabase()
  const { projects } = useProjects()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchTasks() {
    try {
      if (!session || !user?.id) {
        console.log('No session or user ID')
        setTasks([])
        return
      }

      console.log('Fetching tasks for user:', user.id)
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:projects!tasks_project_id_fkey (
            name,
            owner_id
          )
        `)
        .or(`assigned_to.eq.${user.id},assigned_to.is.null`) as { data: TaskResponse[] | null, error: any }

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Raw task data:', data)
      
      const formattedTasks = (data || []).map(task => {
        console.log('Formatting task:', task)
        return {
          ...task,
          project_id: task.project_id || null,
          assigned_to: task.assigned_to || null,
          auth_id: user.id,
          projects: task.projects ? {
            name: task.projects.name,
            owner_id: task.projects.owner_id
          } : null
        }
      }) as Task[]

      console.log('Formatted tasks:', formattedTasks)
      setTasks(formattedTasks)
    } catch (error) {
      console.error('Detailed fetch error:', error)
      toast({
        title: "Error fetching tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function createTask(taskData: TaskCreate) {
    if (!user?.id) {
      throw new Error('No authenticated user')
    }

    try {
      const newTask = {
        project_id: taskData.project_id,
        title: taskData.title,
        duration: Number(taskData.duration),
        order_index: Number(taskData.order_index),
        assigned_to: taskData.assigned_to,
        auth_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single()

      if (error) throw error

      await fetchTasks()
      return data
    } catch (error) {
      console.error('Error in createTask:', error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchTasks()
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error updating task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error deleting task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user?.id])

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}