import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Project } from '@/types/database.types'
import { useSupabase } from '@/components/providers/supabase-provider'

type ProjectCreate = {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  required_members?: string
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

  const addProject = async (project: ProjectCreate) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user found')

      const { error } = await supabase
        .from('projects')
        .insert({
          ...project,
          owner_id: user.id,
          owner_email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      await fetchProjects()

      toast({
        title: "Success",
        description: "Project created successfully"
      })
    } catch (error) {
      console.error('Error adding project:', error)
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      })
      throw error
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setProjects(prev => prev.map(p => 
        p.id === id ? data : p
      ))
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      })
      return data
    } catch (error) {
      toast({
        title: "Error updating project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProjects(prev => prev.filter(p => p.id !== id))
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    if (session && user?.id) {
      fetchProjects()
    } else {
      setLoading(false)
    }
  }, [session, user?.id])

  return {
    projects,
    loading,
    createProject: addProject,
    updateProject,
    deleteProject,
  }
} 