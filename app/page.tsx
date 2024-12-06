"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile } from "@/components/user-profile"
import { CommitmentsList } from "@/components/commitments-list"
import { Commitment } from "@/types/custom"
import { ProjectsList } from "@/components/projects-list"
import { TasksList } from "@/components/tasks-list"
import { Users, Upload, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BulkImportButton } from "@/components/bulk-import-button"
import { useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const { user, signOut } = useSupabase()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">BiteSync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
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
            <BulkImportButton 
              onImport={(importedCommitments) => {
                const newCommitments = importedCommitments.map(commitment => ({
                  ...commitment,
                  id: Date.now().toString(),
                })) as Commitment[];
                setCommitments(prev => [...prev, ...newCommitments]);
              }}
            />
          </CardHeader>
          <CardContent>
            <CommitmentsList onImport={setCommitments} />
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