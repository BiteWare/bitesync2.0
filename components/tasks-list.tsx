"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

interface Task {
  id: string
  project: string
  title: string
  assignedTo: string
  duration: number
  order: number
}

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      project: 'website', 
      title: 'Design System', 
      assignedTo: 'jack', 
      duration: 8, 
      order: 1 
    }
  ])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    project: '',
    title: '',
    assignedTo: '',
    duration: 0,
    order: 0
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleAddTask = () => {
    console.log('New Task:', newTask) // For debugging
    if (newTask.project && newTask.title && newTask.assignedTo && newTask.duration && newTask.order) {
      const task: Task = {
        id: Date.now().toString(),
        project: newTask.project,
        title: newTask.title,
        assignedTo: newTask.assignedTo,
        duration: Number(newTask.duration),
        order: Number(newTask.order)
      }
      setTasks(prev => [...prev, task])
      setNewTask({
        project: '',
        title: '',
        assignedTo: '',
        duration: 0,
        order: 0
      })
      setAddDialogOpen(false)
    } else {
      console.log('Missing required fields') // For debugging
    }
  }

  const handleEditTask = () => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? editingTask : task
      ))
      setEditingTask(null)
      setEditDialogOpen(false)
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return (
    <div className="space-y-4">
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={(value) => setNewTask({ ...newTask, project: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website Redesign</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              placeholder="Task Title"
              value={newTask.title || ''}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Select onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jack">Jack Horton</SelectItem>
                <SelectItem value="sarah">Sarah Smith</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              placeholder="Duration (hours)"
              value={newTask.duration || ''}
              onChange={(e) => setNewTask({ ...newTask, duration: Number(e.target.value) })}
            />
            <Input 
              type="number" 
              placeholder="Order"
              value={newTask.order || ''}
              onChange={(e) => setNewTask({ ...newTask, order: Number(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select 
              value={editingTask?.project} 
              onValueChange={(value) => setEditingTask(prev => prev ? {...prev, project: value} : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website Redesign</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              placeholder="Task Title"
              value={editingTask?.title || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, title: e.target.value} : null)}
            />
            <Select 
              value={editingTask?.assignedTo}
              onValueChange={(value) => setEditingTask(prev => prev ? {...prev, assignedTo: value} : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jack">Jack Horton</SelectItem>
                <SelectItem value="sarah">Sarah Smith</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              placeholder="Duration (hours)"
              value={editingTask?.duration || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, duration: Number(e.target.value)} : null)}
            />
            <Input 
              type="number" 
              placeholder="Order"
              value={editingTask?.order || ''}
              onChange={(e) => setEditingTask(prev => prev ? {...prev, order: Number(e.target.value)} : null)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={task.id}>
              <TableCell>{task.project}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>{task.duration} hours</TableCell>
              <TableCell>{task.order}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setEditingTask(task)
                    setEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
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