import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Task } from '@/types/database.types'
import { useSupabase } from '@/components/providers/supabase-provider'

export function useTasks() {
  const { user } = useSupabase()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchTasks() {
    if (!user?.id) return
    
    try {
      setLoading(true)
      console.log('Fetching tasks...')

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
        .eq('assigned_to', user.id)
        .order('order_index', { ascending: true })

      if (error) throw error

      const formattedData: Task[] = data.map((task) => ({
        ...task,
        projects: task.projects?.[0] || { name: 'Unknown Project' }
      }))

      console.log('Tasks fetched:', formattedData)
      setTasks(formattedData)
    } catch (error) {
      console.error('Error in fetchTasks:', error)
      toast({
        title: "Error fetching tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function createTask(taskData: {
    project_id: string
    title: string
    duration: number
    order_index: number
  }) {
    if (!user?.id) return

    try {
      const newTask = {
        ...taskData,
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
        .single()

      if (error) throw error

      const formattedTask: Task = {
        ...data,
        projects: data.projects?.[0] || { name: 'Unknown Project' }
      }

      setTasks(prev => [formattedTask, ...prev])
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      })
      return formattedTask
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
        .single()

      if (error) throw error

      const updatedTask: Task = {
        ...data,
        projects: data.projects?.[0] || { name: 'Unknown Project' }
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
    if (user?.id) {
      fetchTasks()
    }
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