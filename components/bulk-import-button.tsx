import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import { useSupabase } from "@/components/providers/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import type { Commitment } from "@/types/custom"

interface BulkImportButtonProps {
  onImport: (commitments: Omit<Commitment, 'id' | 'owner'>[]) => void;
}

export function BulkImportButton({ onImport }: BulkImportButtonProps) {
  const { user } = useSupabase()
  const { toast } = useToast()

  const formatDate = (dateStr: string) => {
    try {
      // Handle various date formats
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  const transformData = (data: any, mapping: { [key: string]: string }) => {
    return {
      title: data.title || 'Untitled',
      type: data.type || 'holidays',
      flexibility: data.flexibility || 'firm',
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      startTime: null,
      endTime: null
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.email) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedCommitments = results.data
            .map((row: any) => transformData(row, {}))
            .filter(item => item.title)

          if (parsedCommitments.length === 0) {
            toast({
              title: "Import Failed",
              description: "Could not find any valid commitments in the CSV",
              variant: "destructive"
            })
            return
          }

          onImport(parsedCommitments)
          
          toast({
            title: "Success",
            description: `Imported ${parsedCommitments.length} commitments`
          })

          event.target.value = ''
        } catch (error) {
          console.error('Import error:', error)
          toast({
            title: "Import Failed",
            description: "Failed to process CSV file"
          })
        }
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
        id="csv-upload"
      />
      <Button variant="outline" asChild>
        <label htmlFor="csv-upload">
          <Upload className="h-4 w-4 mr-2" />
          Import Commitments
        </label>
      </Button>
    </div>
  )
} 