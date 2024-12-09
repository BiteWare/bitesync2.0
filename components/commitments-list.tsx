"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useCommitments } from '@/hooks/use-commitments'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Commitment } from '@/types/custom'

export function CommitmentsList() {
  const { user } = useSupabase()
  const { 
    commitments, 
    loading, 
    addCommitment, 
    updateCommitment, 
    deleteCommitment, 
    deleteMultipleCommitments 
  } = useCommitments()
  
  const [newCommitment, setNewCommitment] = useState<Partial<Commitment>>({
    type: 'holidays',
    flexibility: 'firm',
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  })
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>([])
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null)

  useEffect(() => {
    if (user?.id && !newCommitment.owner) {
      setNewCommitment(prev => ({ ...prev, owner: user.email || '' }))
    }
  }, [user?.id])

  const handleAddCommitment = async () => {
    if (newCommitment.type && newCommitment.flexibility && newCommitment.title && 
        newCommitment.startDate && newCommitment.endDate) {
      await addCommitment(newCommitment as Omit<Commitment, 'id'>)
      setNewCommitment({
        owner: user?.email || '',
        type: 'holidays',
        flexibility: 'firm',
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
      })
      setAddDialogOpen(false)
    }
  }

  const handleEditCommitment = async () => {
    if (editingCommitment) {
      await updateCommitment(editingCommitment)
      setEditingCommitment(null)
      setEditDialogOpen(false)
    }
  }

  const handleDeleteCommitment = async (id: string) => {
    await deleteCommitment(id)
  }

  const handleBulkDelete = async () => {
    await deleteMultipleCommitments(selectedCommitments)
    setSelectedCommitments([])
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
              <Input 
                type="text" 
                placeholder="Owner"
                value={newCommitment.owner || ''}
                onChange={(e) => setNewCommitment({ ...newCommitment, owner: e.target.value })}
              />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input 
                    type="date"
                    value={newCommitment.startDate}
                    onChange={(e) => setNewCommitment({ ...newCommitment, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input 
                    type="time"
                    value={newCommitment.startTime || ''}
                    onChange={(e) => setNewCommitment({ ...newCommitment, startTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input 
                    type="date"
                    value={newCommitment.endDate}
                    onChange={(e) => setNewCommitment({ ...newCommitment, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input 
                    type="time"
                    value={newCommitment.endTime || ''}
                    onChange={(e) => setNewCommitment({ ...newCommitment, endTime: e.target.value })}
                  />
                </div>
              </div>
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
            <Input 
              type="text" 
              placeholder="Owner"
              value={editingCommitment?.owner || ''}
              onChange={(e) => setEditingCommitment(prev => prev ? {...prev, owner: e.target.value} : null)}
            />
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent aria-describedby="view-commitment-description">
          <DialogHeader>
            <DialogTitle>Commitment Details</DialogTitle>
            <DialogDescription id="view-commitment-description">
              View commitment information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Owner:</div>
              <div className="col-span-2">{selectedCommitment?.owner}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Type:</div>
              <div className="col-span-2">{selectedCommitment?.type}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Flexibility:</div>
              <div className="col-span-2">{selectedCommitment?.flexibility}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Title:</div>
              <div className="col-span-2">{selectedCommitment?.title}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">Start:</div>
              <div className="col-span-2">
                {selectedCommitment?.startDate}
                {selectedCommitment?.startTime && ` ${selectedCommitment.startTime}`}
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-semibold">End:</div>
              <div className="col-span-2">
                {selectedCommitment?.endDate}
                {selectedCommitment?.endTime && ` ${selectedCommitment.endTime}`}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingCommitment(selectedCommitment)
                setViewDialogOpen(false)
                setEditDialogOpen(true)
              }}
              disabled={selectedCommitment?.owner !== user?.email}
            >
              Edit Commitment
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
                checked={commitments.length > 0 && selectedCommitments.length === commitments.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Owner</TableHead>
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
            <TableRow 
              key={commitment.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                setSelectedCommitment(commitment)
                setViewDialogOpen(true)
              }}
            >
              <TableCell>
                <Checkbox 
                  checked={selectedCommitments.includes(commitment.id)}
                  onCheckedChange={(checked) => handleSelectCommitment(commitment.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>{commitment.owner}</TableCell>
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
                  disabled={commitment.owner !== user?.email}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteCommitment(commitment.id)}
                  disabled={commitment.owner !== user?.email}
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