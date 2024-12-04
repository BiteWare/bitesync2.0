"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, FolderKanban, Clock } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: CalendarDays,
      active: pathname === "/dashboard",
    },
    {
      href: "/users",
      label: "Users",
      icon: Users,
      active: pathname === "/users",
    },
    {
      href: "/projects",
      label: "Projects",
      icon: FolderKanban,
      active: pathname === "/projects",
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: Clock,
      active: pathname === "/schedule",
    },
  ]

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-2xl mr-8">
          BiteSync
        </Link>
        <div className="flex gap-6">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}