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

  const transformData = (data: any, index: number) => {
    // Simply take the raw values from CSV, no transformations
    return {
      project_id: data.Project || '',
      title: data.Title || '',
      duration: data.Duration || 0,
      order_index: data.Order || index,
      assigned_to: data['Assigned To'] || ''
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
        // Normalize headers to match Excel column names
        return header.trim();
      },
      complete: (results) => {
        try {
          const parsedTasks = results.data
            .map((row: any, index: number) => transformData(row, index))
            .filter((task): task is NonNullable<typeof task> => task !== null);

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
            description: "Failed to process CSV file"
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