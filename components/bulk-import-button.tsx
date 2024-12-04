import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Papa from 'papaparse';
import { Upload } from 'lucide-react';

interface Commitment {
  id: string;
  type: string;
  flexibility: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface BulkImportButtonProps {
  onImport: (commitments: Partial<Commitment>[]) => void;
}

export function BulkImportButton({ onImport }: BulkImportButtonProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const parsedCommitments = results.data.map((item: any) => ({
            type: item.type || 'holidays',
            flexibility: item.flexibility || 'firm',
            title: item.title || '',
            startDate: item.startDate || '',
            endDate: item.endDate || ''
          }));
          onImport(parsedCommitments);
        },
        header: true,
      });
    }
  };

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
  );
} 