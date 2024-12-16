"use client"

import { Users, Upload, LogOut, WandSparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { UserProfile } from "@/components/user-profile"
import { CommitmentsList } from "@/components/commitments-list"
import { ProjectsList } from "@/components/projects-list"
import { TasksList } from "@/components/tasks-list"
import { BulkImportButton } from "@/components/bulk-import-button"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useCommitments } from "@/hooks/use-commitments"
import type { Commitment } from "@/types/custom"

export default function Home() {
  const { user, signOut } = useSupabase()
  const { commitments, addCommitment } = useCommitments()

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
        <CollapsibleCard title="Users & Availability">
          <UserProfile />
        </CollapsibleCard>

        <CollapsibleCard title="Commitments">
          <CommitmentsList />
        </CollapsibleCard>

        <CollapsibleCard title="Projects">
          <ProjectsList />
        </CollapsibleCard>

        <CollapsibleCard title="Tasks">
          <TasksList />
        </CollapsibleCard>
      </div>

      <div className="flex justify-center">
        <Button className="bg-[#FF3B9A] hover:bg-[#FF3B9A]/90 text-white gap-2">
          <WandSparkles className="h-5 w-5" />
          Optimize Schedule
        </Button>
      </div>
    </div>
  )
}