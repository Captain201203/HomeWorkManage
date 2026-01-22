"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-8 py-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students, classes, or reports..."
          className="h-10 w-full rounded-lg border-border bg-muted/50 pl-10 focus-visible:ring-teal-500"
        />
      </div>

      {/* Notification */}
      <Button variant="ghost" size="icon" className="relative ml-4">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-600" />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  )
}
