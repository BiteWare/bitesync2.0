"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile } from "@/components/user-profile"
import { CommitmentsList } from "@/components/commitments-list"
import { ProjectsList } from "@/components/projects-list"
import { TasksList } from "@/components/tasks-list"
import { Users, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">BiteSync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">jack@bitewire.dev</span>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users & Availability</CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Users
            </Button>
          </CardHeader>
          <CardContent>
            <UserProfile />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Commitments</CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Commitments
            </Button>
          </CardHeader>
          <CardContent>
            <CommitmentsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}