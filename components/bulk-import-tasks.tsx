import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import { useSupabase } from "@/components/providers/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import type { TaskCreate } from "@/hooks/use-tasks"

interface BulkImportTasksProps {
  onImport: (tasks: Omit<TaskCreate, 'auth_id'>[]) => void;
  projects: { id: string; name: string }[];
}

export function BulkImportTasks({ onImport, projects }: BulkImportTasksProps) {
  const { user } = useSupabase()
  const { toast } = useToast()

  const transformData = (data: any, index: number): Omit<TaskCreate, 'auth_id'> => {
    // Project matching is now optional
    const matchedProject = projects.find(p => p.name.toLowerCase() === data.Project?.trim().toLowerCase());
    const projectId = data.Project?.trim() ? matchedProject?.id ?? null : null;

    return {
      project_id: projectId,
      title: data.Title?.trim() || '',
      duration: Number(data.Duration) || 0,
      order_index: Number(data.Order) || index,
      assigned_to: data['Assigned To']?.trim() || null
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) {
      toast({
        title: "Import Failed",
        description: "Please log in to import tasks",
        variant: "destructive"
      })
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        return header.trim();
      },
      complete: (results) => {
        try {
          const parsedTasks = results.data
            .map((row: any, index: number) => transformData(row, index))
            .filter((task): task is Omit<TaskCreate, 'auth_id'> => 
              // Only title is required now
              task.title !== ''
            );

          if (parsedTasks.length === 0) {
            toast({
              title: "Import Failed",
              description: "No valid tasks found in the CSV file",
              variant: "destructive"
            })
            return
          }
          
          onImport(parsedTasks)
          
          toast({
            title: "Success",
            description: `Imported ${parsedTasks.length} tasks`
          })

          event.target.value = ''
        } catch (error) {
          console.error('Import error:', error)
          toast({
            title: "Import Failed",
            description: "Failed to process CSV file",
            variant: "destructive"
          })
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast({
          title: "Import Failed",
          description: "Failed to parse CSV file",
          variant: "destructive"
        })
      }
    })
  }

  return (
    <div>
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="task-csv-upload"
      />
      <Button variant="outline" asChild>
        <label htmlFor="task-csv-upload">
          <Upload className="h-4 w-4 mr-2" />
          Import Tasks
        </label>
      </Button>
    </div>
  )
}