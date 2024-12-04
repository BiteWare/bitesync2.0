"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

interface Project {
  id: string
  name: string
  priority: string
}

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Website Redesign', priority: 'high' }
  ])
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    priority: 'high'
  })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleAddProject = () => {
    console.log('New Project:', newProject) // For debugging
    if (newProject.name && newProject.priority) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        priority: newProject.priority
      }
      setProjects(prev => [...prev, project])
      setNewProject({
        name: '',
        priority: 'high'
      })
      setAddDialogOpen(false)
    } else {
      console.log('Missing required fields') // For debugging
    }
  }

  const handleEditProject = () => {
    if (editingProject) {
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id ? editingProject : project
      ))
      setEditingProject(null)
      setEditDialogOpen(false)
    }
  }

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id))
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
              placeholder="Project Name" 
              value={newProject.name || ''}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <Select onValueChange={(value) => setNewProject({ ...newProject, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
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
              placeholder="Project Name" 
              value={editingProject?.name || ''}
              onChange={(e) => setEditingProject(prev => prev ? {...prev, name: e.target.value} : null)}
            />
            <Select 
              value={editingProject?.priority}
              onValueChange={(value) => setEditingProject(prev => prev ? {...prev, priority: value} : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.priority}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setEditingProject(project)
                    setEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteProject(project.id)}
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