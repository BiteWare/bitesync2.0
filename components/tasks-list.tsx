"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"
import { useSupabase } from "@/components/providers/supabase-provider"
import type { Task } from "@/types/database.types"
import type { TaskCreate } from "@/hooks/use-tasks"
import { BulkImportTasks } from "@/components/bulk-import-tasks"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export function TasksList() {
  const { user } = useSupabase()
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const { projects } = useProjects()
  const { toast } = useToast()
  
  const [newTask, setNewTask] = useState<Partial<TaskCreate>>({
    project_id: null,
    title: '',
    assigned_to: null,
    duration: 0,
    order_index: 0
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const handleAddTask = async () => {
    if (!user?.id) return

    try {
      await createTask({
        project_id: newTask.project_id || null,
        title: newTask.title || '',
        duration: Number(newTask.duration) || 0,
        order_index: Number(newTask.order_index) || 0,
        assigned_to: newTask.assigned_to || null,
        auth_id: user.id
      })
      
      setNewTask({
        project_id: null,
        title: '',
        assigned_to: null,
        duration: 0,
        order_index: 0
      })
      setAddDialogOpen(false)
    } catch (error) {
      console.error('Error in handleAddTask:', error)
    }
  }

  const handleEditTask = async () => {
    if (editingTask) {
      await updateTask(editingTask.id, editingTask)
      setEditingTask(null)
      setEditDialogOpen(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
  }

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedTasks) {
        await deleteTask(id)
      }
      setSelectedTasks([])
    } catch (error) {
      console.error('Error deleting tasks:', error)
    }
  }

  const handleBulkImport = async (importedTasks: Omit<TaskCreate, 'auth_id'>[]) => {
    try {
      console.log('Starting import of tasks:', importedTasks)
      
      if (!user?.id) {
        throw new Error('No user ID available')
      }

      for (const task of importedTasks) {
        console.log('Creating task:', task)
        try {
          await createTask({
            ...task,
            auth_id: user.id,
            assigned_to: user.id
          })
        } catch (taskError) {
          console.error('Error creating individual task:', taskError)
          throw taskError
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Error importing tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
    }
  }

  if (!user) {
    return <div>Please log in to view tasks</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="add-task-description">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription id="add-task-description">
                  Fill in the details to create a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select 
                  value={newTask.project_id ?? ''} 
                  onValueChange={(value) => setNewTask({ ...newTask, project_id: value || null })}
                >
                  <SelectTrigger aria-label="Select Project">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  type="text" 
                  placeholder="Task Title"
                  value={newTask.title || ''}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  aria-label="Task Title"
                />
                <textarea
                  className="flex h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Assigned To"
                  value={newTask.assigned_to || ''}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  aria-label="Assigned To"
                  rows={2}
                />
                <Input 
                  type="number" 
                  placeholder="Duration (hours)"
                  value={newTask.duration || ''}
                  onChange={(e) => setNewTask({ ...newTask, duration: Number(e.target.value) })}
                  aria-label="Duration"
                />
                <Input 
                  type="number" 
                  placeholder="Order"
                  value={newTask.order_index || ''}
                  onChange={(e) => setNewTask({ ...newTask, order_index: Number(e.target.value) })}
                  aria-label="Order"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <BulkImportTasks 
            onImport={handleBulkImport} 
            projects={projects}
          />
        </div>

        {selectedTasks?.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedTasks.length})
          </Button>
        )}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent aria-describedby="edit-task-description">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription id="edit-task-description">
              Modify the task details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select 
              value={editingTask?.project_id ?? ''} 
              onValueChange={(value) => setEditingTask(prev => prev ? {...prev, project_id: value || null} : null)}
            >
              <SelectTrigger aria-label="Select Project">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              placeholder="Task Title"
              value={editingTask?.title || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, title: e.target.value} : null)}
              aria-label="Task Title"
            />
            <textarea
              className="flex h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Assigned To (email addresses)"
              value={editingTask?.assigned_to || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, assigned_to: e.target.value} : null)}
              aria-label="Assigned To"
              rows={2}
            />
            <Input 
              type="number" 
              placeholder="Duration (hours)"
              value={editingTask?.duration || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, duration: Number(e.target.value)} : null)}
              aria-label="Duration"
            />
            <Input 
              type="number" 
              placeholder="Order"
              value={editingTask?.order_index || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, order_index: Number(e.target.value)} : null)}
              aria-label="Order"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent aria-describedby="view-task-description">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription id="view-task-description">
              View task information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Project:</div>
              <div className="col-span-2">{(selectedTask as any)?.projects?.name || 'Unknown Project'}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Title:</div>
              <div className="col-span-2">{selectedTask?.title}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Assigned To:</div>
              <div className="col-span-2">{selectedTask?.assigned_to}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Duration:</div>
              <div className="col-span-2">{selectedTask?.duration} hours</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Order:</div>
              <div className="col-span-2">{selectedTask?.order_index}</div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingTask(selectedTask)
                setViewDialogOpen(false)
                setEditDialogOpen(true)
              }}
            >
              Edit Task
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                onCheckedChange={checked => {
                  if (checked) {
                    setSelectedTasks(tasks.map(t => t.id))
                  } else {
                    setSelectedTasks([])
                  }
                }}
              />
            </TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => (
            <TableRow 
              key={task.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                setSelectedTask(task)
                setViewDialogOpen(true)
              }}
            >
              <TableCell onClick={e => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTasks(prev => [...prev, task.id])
                    } else {
                      setSelectedTasks(prev => prev.filter(id => id !== task.id))
                    }
                  }}
                />
              </TableCell>
              <TableCell>{task.projects?.name || 'Unassigned'}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{(task as any).assigned_user?.email || 'Unassigned'}</TableCell>
              <TableCell>{task.duration} {task.duration === 1 ? 'hour' : 'hours'}</TableCell>
              <TableCell>{task.order_index}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingTask(task)
                    setEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTask(task.id)
                  }}
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