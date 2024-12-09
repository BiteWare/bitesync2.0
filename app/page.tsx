"use client"

import { Users, Upload, LogOut } from "lucide-react"
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

        <CollapsibleCard 
          title="Commitments"
          headerContent={
            <BulkImportButton 
              onImport={async (importedCommitments) => {
                try {
                  console.log('Starting import of commitments:', importedCommitments)
                  
                  for (const commitment of importedCommitments) {
                    // Ensure all required fields are present
                    const formattedCommitment = {
                      ...commitment,
                      owner: user?.email || '',
                      type: commitment.type || 'holidays',
                      flexibility: commitment.flexibility || 'firm',
                      startDate: commitment.startDate || new Date().toISOString().split('T')[0],
                      endDate: commitment.endDate || new Date().toISOString().split('T')[0]
                    }
                    
                    await addCommitment(formattedCommitment)
                  }
                } catch (error) {
                  console.error('Import error:', error)
                }
              }}
            />
          }
        >
          <CommitmentsList />
        </CollapsibleCard>

        <CollapsibleCard title="Projects">
          <ProjectsList />
        </CollapsibleCard>

        <CollapsibleCard title="Tasks">
          <TasksList />
        </CollapsibleCard>
      </div>
    </div>
  )
}