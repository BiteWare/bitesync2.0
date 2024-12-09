import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export const WEEKDAYS = [
  { short: 'Su', long: 'Sunday' },
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
]

interface WeekPickerProps {
  selected: number[]
  onSelect: (days: number[]) => void
  className?: string
}

export function WeekPicker({ selected, onSelect, className }: WeekPickerProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {WEEKDAYS.map((day, index) => (
        <Button
          key={day.short}
          variant={selected.includes(index) ? "default" : "outline"}
          className="w-12 h-12"
          onClick={() => {
            if (selected.includes(index)) {
              onSelect(selected.filter(d => d !== index))
            } else {
              onSelect([...selected, index])
            }
          }}
          title={day.long}
        >
          {day.short}
        </Button>
      ))}
    </div>
  )
} 