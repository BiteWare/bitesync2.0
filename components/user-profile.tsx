"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { UserProfileType, UserProfileUpdate, UserRole, TeamType } from "@/types/user.types"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { WeekPicker } from "@/components/ui/week-picker"
import { WEEKDAYS } from "@/components/ui/week-picker"

export function UserProfile() {
  const { profiles, loading, addProfile, updateProfile, deleteProfile } = useUserProfile()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const { toast } = useToast()
  const [newUser, setNewUser] = useState<UserProfileUpdate>({
    full_name: '',
    primary_role: 'developer',
    team: 'engineering',
    timezone: 'pt',
    work_start: '09:00',
    work_end: '17:00',
    working_days: []
  })
  const [editingUser, setEditingUser] = useState<UserProfileType | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingDays, setEditingDays] = useState<number[]>([])

  const handleSubmit = async () => {
    try {
      await addProfile({
        ...newUser,
        working_days: selectedDays.map(day => day.toString())
      })
      setIsDialogOpen(false)
      setNewUser({
        full_name: '',
        primary_role: 'developer',
        team: 'engineering',
        timezone: 'pt',
        work_start: '09:00',
        work_end: '17:00',
        working_days: []
      })
      setSelectedDays([])
      toast({
        title: "User Added",
        description: "New user has been successfully added.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Failed to Add User",
        description: "There was a problem adding the user.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleEdit = async () => {
    if (!editingUser) return

    try {
      await updateProfile(editingUser.user_id, {
        full_name: editingUser.full_name || '',
        primary_role: editingUser.primary_role,
        team: editingUser.team,
        timezone: editingUser.timezone,
        work_start: editingUser.work_start,
        work_end: editingUser.work_end,
        working_days: editingDays.map(day => day.toString())
      })
      setEditDialogOpen(false)
      setEditingUser(null)
      setEditingDays([])
      toast({
        title: "User Updated",
        description: "User has been successfully updated.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Failed to Update User",
        description: "There was a problem updating the user.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Role</label>
                <Select
                  value={newUser.primary_role}
                  onValueChange={(value: UserRole) => 
                    setNewUser({ ...newUser, primary_role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Project Manager</SelectItem>
                    <SelectItem value="product_manager">Product Manager</SelectItem>
                    <SelectItem value="data_analyst">Data Analyst</SelectItem>
                    <SelectItem value="qa_engineer">QA Engineer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                    <SelectItem value="marketing">Marketing Specialist</SelectItem>
                    <SelectItem value="sales">Sales Representative</SelectItem>
                    <SelectItem value="hr">HR Specialist</SelectItem>
                    <SelectItem value="finance">Financial Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Team</label>
                <Select
                  value={newUser.team}
                  onValueChange={(value: TeamType) => 
                    setNewUser({ ...newUser, team: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="data">Data & Analytics</SelectItem>
                    <SelectItem value="qa">Quality Assurance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="customer_success">Customer Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Select
                  value={newUser.timezone}
                  onValueChange={(value) => setNewUser({ ...newUser, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Pacific Time (PT)</SelectItem>
                    <SelectItem value="et">Eastern Time (ET)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Hours Start</label>
                  <Input
                    type="time"
                    value={newUser.work_start}
                    onChange={(e) => setNewUser({ ...newUser, work_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Hours End</label>
                  <Input
                    type="time"
                    value={newUser.work_end}
                    onChange={(e) => setNewUser({ ...newUser, work_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Working Days</label>
                <WeekPicker
                  selected={selectedDays}
                  onSelect={setSelectedDays}
                  className="rounded-md border p-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Timezone</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Working Days</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.user_id}>
              <TableCell>{profile.full_name}</TableCell>
              <TableCell>{profile.primary_role}</TableCell>
              <TableCell>{profile.team}</TableCell>
              <TableCell>{profile.timezone}</TableCell>
              <TableCell>{`${profile.work_start} - ${profile.work_end}`}</TableCell>
              <TableCell>
                {profile.working_days
                  .map((day: string) => WEEKDAYS[parseInt(day)].long)
                  .join(', ')}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingUser(profile)
                    setEditingDays(profile.working_days.map((day: string) => parseInt(day)))
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
                    deleteProfile(profile.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={editingUser?.full_name || ''}
                onChange={(e) => setEditingUser((prev: UserProfileType | null) => 
                  prev ? { ...prev, full_name: e.target.value } : null
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Role</label>
              <Select
                value={editingUser?.primary_role}
                onValueChange={(value: UserRole) => 
                  setEditingUser((prev: UserProfileType | null) => prev ? { ...prev, primary_role: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Project Manager</SelectItem>
                  <SelectItem value="product_manager">Product Manager</SelectItem>
                  <SelectItem value="data_analyst">Data Analyst</SelectItem>
                  <SelectItem value="qa_engineer">QA Engineer</SelectItem>
                  <SelectItem value="devops">DevOps Engineer</SelectItem>
                  <SelectItem value="marketing">Marketing Specialist</SelectItem>
                  <SelectItem value="sales">Sales Representative</SelectItem>
                  <SelectItem value="hr">HR Specialist</SelectItem>
                  <SelectItem value="finance">Financial Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Team</label>
              <Select
                value={editingUser?.team}
                onValueChange={(value: TeamType) => 
                  setEditingUser((prev: UserProfileType | null) => prev ? { ...prev, team: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="data">Data & Analytics</SelectItem>
                  <SelectItem value="qa">Quality Assurance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="customer_success">Customer Success</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select
                value={editingUser?.timezone}
                onValueChange={(value) => 
                  setEditingUser((prev: UserProfileType | null) => prev ? { ...prev, timezone: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Pacific Time (PT)</SelectItem>
                  <SelectItem value="et">Eastern Time (ET)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Hours Start</label>
                <Input
                  type="time"
                  value={editingUser?.work_start}
                  onChange={(e) => setEditingUser((prev: UserProfileType | null) => 
                    prev ? { ...prev, work_start: e.target.value } : null
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Hours End</label>
                <Input
                  type="time"
                  value={editingUser?.work_end}
                  onChange={(e) => setEditingUser((prev: UserProfileType | null) => 
                    prev ? { ...prev, work_end: e.target.value } : null
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Working Days</label>
              <WeekPicker
                selected={editingDays}
                onSelect={setEditingDays}
                className="rounded-md border p-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}