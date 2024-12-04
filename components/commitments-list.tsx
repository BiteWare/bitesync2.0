"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function CommitmentsList() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="grid grid-cols-5 gap-4 flex-1">
          <Select defaultValue="holidays">
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="holidays">Holidays</SelectItem>
              <SelectItem value="meetings">Meetings</SelectItem>
              <SelectItem value="breaks">Breaks</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="firm">
            <SelectTrigger>
              <SelectValue placeholder="Flexibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firm">Firm</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Title" />
          <Input type="date" />
          <Input type="date" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Flexibility</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Holidays</TableCell>
            <TableCell>Firm</TableCell>
            <TableCell>Thanksgiving</TableCell>
            <TableCell>2024-11-28</TableCell>
            <TableCell>2024-12-01</TableCell>
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