"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export interface Commitment {
  id: string
  type: string
  flexibility: string
  title: string
  startDate: string
  endDate: string
}

export function CommitmentsList({ onImport }: { onImport: (commitments: Commitment[]) => void }) {
  const [commitments, setCommitments] = useState<Commitment[]>([
    {
      id: '1',
      type: 'holidays',
      flexibility: 'firm',
      title: 'Thanksgiving',
      startDate: '2024-11-28',
      endDate: '2024-12-01'
    }
  ])
  const [newCommitment, setNewCommitment] = useState<Partial<Commitment>>({
    type: 'holidays',
    flexibility: 'firm',
    title: '',
    startDate: '',
    endDate: ''
  })
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>([])

  useEffect(() => {
    onImport(commitments);
  }, [commitments]);

  const handleAddCommitment = () => {
    console.log('New Commitment:', newCommitment) // For debugging
    if (newCommitment.type && newCommitment.flexibility && newCommitment.title && 
        newCommitment.startDate && newCommitment.endDate) {
      const commitment: Commitment = {
        id: Date.now().toString(),
        type: newCommitment.type,
        flexibility: newCommitment.flexibility,
        title: newCommitment.title,
        startDate: newCommitment.startDate,
        endDate: newCommitment.endDate
      }
      setCommitments(prev => [...prev, commitment])
      setNewCommitment({
        type: 'holidays',
        flexibility: 'firm',
        title: '',
        startDate: '',
        endDate: ''
      })
      setAddDialogOpen(false)
    } else {
      console.log('Missing required fields') // For debugging
    }
  }

  const handleDeleteCommitment = (id: string) => {
    setCommitments(prev => prev.filter(commitment => commitment.id !== id))
  }

  const handleEditCommitment = () => {
    if (editingCommitment) {
      setCommitments(prev => prev.map(commitment => 
        commitment.id === editingCommitment.id ? editingCommitment : commitment
      ))
      setEditingCommitment(null)
      setEditDialogOpen(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommitments(commitments.map(c => c.id))
    } else {
      setSelectedCommitments([])
    }
  }

  const handleSelectCommitment = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCommitments(prev => [...prev, id])
    } else {
      setSelectedCommitments(prev => prev.filter(cId => cId !== id))
    }
  }

  const handleBulkDelete = () => {
    setCommitments(prev => prev.filter(commitment => !selectedCommitments.includes(commitment.id)))
    setSelectedCommitments([])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Commitment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Commitment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select 
                defaultValue="holidays"
                onValueChange={(value) => setNewCommitment({ ...newCommitment, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holidays">Holidays</SelectItem>
                  <SelectItem value="meetings">Meetings</SelectItem>
                  <SelectItem value="breaks">Breaks</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                defaultValue="firm"
                onValueChange={(value) => setNewCommitment({ ...newCommitment, flexibility: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Flexibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firm">Firm</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="text" 
                placeholder="Title"
                value={newCommitment.title}
                onChange={(e) => setNewCommitment({ ...newCommitment, title: e.target.value })}
              />
              <Input 
                type="date"
                value={newCommitment.startDate}
                onChange={(e) => setNewCommitment({ ...newCommitment, startDate: e.target.value })}
              />
              <Input 
                type="date"
                value={newCommitment.endDate}
                onChange={(e) => setNewCommitment({ ...newCommitment, endDate: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddCommitment}>Add Commitment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedCommitments.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedCommitments.length})
          </Button>
        )}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commitment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select 
              value={editingCommitment?.type}
              onValueChange={(value) => setEditingCommitment(prev => prev ? {...prev, type: value} : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="holidays">Holidays</SelectItem>
                <SelectItem value="meetings">Meetings</SelectItem>
                <SelectItem value="breaks">Breaks</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={editingCommitment?.flexibility}
              onValueChange={(value) => setEditingCommitment(prev => prev ? {...prev, flexibility: value} : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Flexibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firm">Firm</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              placeholder="Title"
              value={editingCommitment?.title || ''}
              onChange={(e) => setEditingCommitment(prev => prev ? {...prev, title: e.target.value} : null)}
            />
            <Input 
              type="date"
              value={editingCommitment?.startDate || ''}
              onChange={(e) => setEditingCommitment(prev => prev ? {...prev, startDate: e.target.value} : null)}
            />
            <Input 
              type="date"
              value={editingCommitment?.endDate || ''}
              onChange={(e) => setEditingCommitment(prev => prev ? {...prev, endDate: e.target.value} : null)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditCommitment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={commitments.length > 0 && selectedCommitments.length === commitments.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Flexibility</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commitments.map(commitment => (
            <TableRow key={commitment.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedCommitments.includes(commitment.id)}
                  onCheckedChange={(checked) => handleSelectCommitment(commitment.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>{commitment.type}</TableCell>
              <TableCell>{commitment.flexibility}</TableCell>
              <TableCell>{commitment.title}</TableCell>
              <TableCell>{commitment.startDate}</TableCell>
              <TableCell>{commitment.endDate}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setEditingCommitment(commitment)
                    setEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteCommitment(commitment.id)}
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