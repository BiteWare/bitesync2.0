"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useState } from "react"
import { UserProfileUpdate } from "@/types/user.types"
import { useToast } from "@/hooks/use-toast"

export function UserProfile() {
  const { profile, loading, updateProfile } = useUserProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.target as HTMLFormElement)
    const updates: UserProfileUpdate = {
      full_name: formData.get('fullName') as string,
      primary_role: formData.get('role') as 'developer' | 'designer' | 'manager',
      team: formData.get('team') as 'engineering' | 'design' | 'product',
      timezone: formData.get('timezone') as string,
      work_start: formData.get('workStart') as string,
      work_end: formData.get('workEnd') as string,
    }

    try {
      await updateProfile(updates)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            name="fullName"
            defaultValue={profile?.full_name || ''} 
            key={profile?.full_name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Primary Role</Label>
          <Select name="role" defaultValue={profile?.primary_role || 'developer'}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Select name="team" defaultValue={profile?.team || 'engineering'}>
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select name="timezone" defaultValue={profile?.timezone || 'pt'}>
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
        <div className="space-y-2">
          <Label htmlFor="workStart">Work Hours Start</Label>
          <Input 
            type="time" 
            id="workStart" 
            name="workStart"
            defaultValue={profile?.work_start || '09:00'} 
            key={profile?.work_start}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workEnd">Work Hours End</Label>
          <Input 
            type="time" 
            id="workEnd" 
            name="workEnd"
            defaultValue={profile?.work_end || '17:00'} 
            key={profile?.work_end}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  )
}