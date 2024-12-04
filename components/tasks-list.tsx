"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function TasksList() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="grid grid-cols-6 gap-4 flex-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website Redesign</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Task Title" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jack">Jack Horton</SelectItem>
              <SelectItem value="sarah">Sarah Smith</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Duration (hours)" />
          <Input type="number" placeholder="Order" />
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

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
          <TableRow>
            <TableCell>Website Redesign</TableCell>
            <TableCell>Design System</TableCell>
            <TableCell>Jack Horton</TableCell>
            <TableCell>8 hours</TableCell>
            <TableCell>1</TableCell>
            <TableCell className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}