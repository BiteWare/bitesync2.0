"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { useProjects } from "@/hooks/use-projects"
import { useSupabase } from "@/components/providers/supabase-provider"
import type { Project } from "@/types/database.types"

export function ProjectsList() {
  const { user } = useSupabase()
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects()
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    owner_id: user?.id || '',
    start_date: null,
    end_date: null,
    required_members: null
  })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleAddProject = async () => {
    if (newProject.name && user?.id) {
      try {
        await createProject({
          name: newProject.name,
          owner_id: user.id,
          ...(newProject.description ? { description: newProject.description } : {}),
          ...(newProject.start_date ? { start_date: newProject.start_date } : {}),
          ...(newProject.end_date ? { end_date: newProject.end_date } : {}),
          ...(newProject.required_members ? { required_members: newProject.required_members } : {})
        })
        
        setNewProject({
          name: '',
          description: '',
          owner_id: user.id,
          start_date: null,
          end_date: null,
          required_members: null
        })
        setAddDialogOpen(false)
      } catch (error) {
        console.error('Error creating project:', error)
      }
    }
  }

  const handleEditProject = async () => {
    if (editingProject) {
      await updateProject(editingProject.id, editingProject)
      setEditingProject(null)
      setEditDialogOpen(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              type="text" 
              placeholder="Owner"
              value={user?.email || ''}
              disabled
            />
            <Input 
              type="text" 
              placeholder="Project Title" 
              value={newProject.name || ''}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <Input 
              type="text" 
              placeholder="Description" 
              value={newProject.description || ''}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input 
                  type="date"
                  value={newProject.start_date || ''}
                  onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input 
                  type="date"
                  value={newProject.end_date || ''}
                  onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                />
              </div>
            </div>
            <Input 
              type="text" 
              placeholder="Required Members (comma-separated emails)" 
              value={newProject.required_members || ''}
              onChange={(e) => setNewProject({ ...newProject, required_members: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              type="text" 
              placeholder="Owner"
              value={editingProject?.owner_email || ''}
              disabled
            />
            <Input 
              type="text" 
              placeholder="Project Title" 
              value={editingProject?.name || ''}
              onChange={(e) => setEditingProject(prev => prev ? {...prev, name: e.target.value} : null)}
            />
            <Input 
              type="text" 
              placeholder="Description" 
              value={editingProject?.description || ''}
              onChange={(e) => setEditingProject(prev => prev ? {...prev, description: e.target.value} : null)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input 
                  type="date"
                  value={editingProject?.start_date || ''}
                  onChange={(e) => setEditingProject(prev => prev ? {...prev, start_date: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input 
                  type="date"
                  value={editingProject?.end_date || ''}
                  onChange={(e) => setEditingProject(prev => prev ? {...prev, end_date: e.target.value} : null)}
                />
              </div>
            </div>
            <Input 
              type="text" 
              placeholder="Required Members (comma-separated emails)" 
              value={editingProject?.required_members || ''}
              onChange={(e) => setEditingProject(prev => prev ? {...prev, required_members: e.target.value} : null)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Owner</TableHead>
            <TableHead>Project Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Required Members</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell>{project.owner_email}</TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.start_date}</TableCell>
              <TableCell>{project.end_date}</TableCell>
              <TableCell>{project.required_members}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setEditingProject(project)
                    setEditDialogOpen(true)
                  }}
                  disabled={project.owner_id !== user?.id}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteProject(project.id)}
                  disabled={project.owner_id !== user?.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}