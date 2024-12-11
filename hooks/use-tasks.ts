import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Task } from '@/types/database.types'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useProjects } from '@/hooks/use-projects'

export type TaskCreate = {
  project_id: string
  title: string
  duration: number
  order_index: number
  assigned_to: string
  auth_id: string
}

// Define the shape of raw data from Supabase
type TaskWithProject = {
  id: string;
  project_id: string;
  title: string;
  assigned_to: string;
  auth_id: string;
  duration: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  projects: {
    name: string;
    owner_id: string;
  } | null;
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
        setTasks([])
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:projects!tasks_project_id_fkey (
            name,
            owner_id
          )
        `)
        .or(`assigned_to.eq.${user.id}`) as { data: TaskWithProject[] | null; error: any }

      if (error) {
        console.error('Fetch error:', error)
        throw error
      }
      
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
    if (!user?.id) {
      throw new Error('No authenticated user')
    }

    try {
      console.log('Creating task with data:', task)
      
      // Ensure all required fields have valid values
      const newTask = {
        project_id: task.project_id || projects[0]?.id, // Fallback to first project
        title: task.title,
        duration: Number(task.duration) || 0,
        order_index: Number(task.order_index) || 0,
        assigned_to: task.assigned_to || user.id,
        auth_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Sending to database:', newTask)

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
          updated_at
        `)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Task created successfully:', data)
      await fetchTasks()

      return data
    } catch (error) {
      console.error('Error in createTask:', error)
      throw error
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    if (!user?.id) return

    try {
      // Remove any undefined values and projects array from updates
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && key !== 'projects') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          projects:projects!tasks_project_id_fkey (
            name,
            owner_id
          )
        `)
        .single() as { data: TaskWithProject | null; error: any }

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      const updatedTask: Task = {
        ...data,
        projects: [{ name: data.projects?.name || 'Unknown Project' }]
      }

      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })
      return updatedTask;
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