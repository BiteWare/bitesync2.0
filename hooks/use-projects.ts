import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Project } from '@/types/database.types'
import { useSupabase } from '@/components/providers/supabase-provider'

type ProjectCreate = {
  name: string
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  required_members?: string | null
  priority?: string
  owner_id?: string
  owner_email?: string
}

export function useProjects() {
  const { user, session } = useSupabase()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchProjects() {
    try {
      if (!session || !user?.id) {
        setProjects([])
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: "Error fetching projects",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (projectData: ProjectCreate) => {
    try {
      if (!user?.id) throw new Error('User not authenticated')
      
      const newProject = {
        ...projectData,
        owner_id: user.id,
        owner_email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single()

      if (error) throw error

      setProjects(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...data } : project
      ))
      return data
    } catch (error) {
      console.error('Error updating project:', error)
      toast({
        title: "Error updating project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [user?.id])

  return {
    projects,
    loading,
    createProject: addProject,
    updateProject,
    deleteProject,
  }
}