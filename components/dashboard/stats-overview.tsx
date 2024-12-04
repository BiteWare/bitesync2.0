"use client"

import { StatsCard } from "./stats-card"

export function StatsOverview() {
  const stats = [
    { title: "Total Projects", value: 12 },
    { title: "Active Tasks", value: 24 },
    { title: "Team Members", value: 8 },
    { title: "Hours Scheduled", value: 164 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}