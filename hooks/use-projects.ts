import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'
import type { Project } from '@/types/database.types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchProjects() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      toast({
        title: "Error fetching projects",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function createProject(project: { 
    name: string; 
    owner_id: string; 
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    required_members?: string | null;
  }) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user found')

      const now = new Date().toISOString()
      
      const newProject = {
        name: project.name,
        owner_id: user.id,
        owner_email: user.email || '',
        description: project.description || null,
        created_at: now,
        updated_at: now,
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        required_members: project.required_members || null
      }

      console.log('Creating project with data:', newProject)

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      setProjects(prev => [data, ...prev])
      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      })
      return data
    } catch (error) {
      console.error('Detailed error:', error)
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
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
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
} 