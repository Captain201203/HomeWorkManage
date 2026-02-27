"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton" // Giả định bạn dùng Shadcn UI
import {
  LayoutDashboard, Users, BookOpen, GraduationCap,
  BarChart3, Settings, PenTool, Calendar, BookMarked, UserCog
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/page/dashboard", icon: LayoutDashboard, roles: ["admin", "teacher"] },
  { title: "Input Scores", href: "/page/scores/input/semester", icon: PenTool, roles: ["admin", "teacher"] },
  { title: "Accounts", href: "/page/account", icon: UserCog, roles: ["admin"] },
  { title: "Students", href: "/page/students", icon: Users, roles: ["admin", "teacher"] },
  { title: "Classes", href: "/page/classes", icon: BookOpen, roles: ["admin", "teacher"] },
  { title: "Teachers", href: "/page/teachers", icon: GraduationCap, roles: ["admin"] },
  { title: "Majors", href: "/page/majors", icon: BookOpen, roles: ["admin"] },
  { title: "Semesters", href: "/page/semesters", icon: Calendar, roles: ["admin"] },
  { title: "Subjects", href: "/page/subjects", icon: BookMarked, roles: ["admin", "teacher"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState({ role: "", username: "" })

  useEffect(() => {
    setMounted(true)
    setUserData({
      role: localStorage.getItem("user_role") || "",
      username: localStorage.getItem("user_username") || "User"
    })
  }, [])

  // Dùng useMemo để tránh tính toán lại mỗi lần re-render
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => item.roles.includes(userData.role))
  }, [userData.role])

  // Tránh lỗi Hydration bằng cách không render gì trước khi mounted
  if (!mounted) return <div className="w-64 border-r h-screen bg-background" />

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card shadow-sm">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg">
                <BookMarked className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-teal-700">EduManage</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredNavItems.length > 0 ? (
          filteredNavItems.map((item) => {
            // Kiểm tra active link thông minh hơn
            const isActive = item.href === "/page/dashboard" 
                ? pathname === item.href 
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                    : "text-muted-foreground hover:bg-teal-50 hover:text-teal-700"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-teal-600")} />
                {item.title}
              </Link>
            )
          })
        ) : (
          <div className="p-4 space-y-3">
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
          </div>
        )}
      </nav>

      <div className="p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-lg border bg-white shadow-sm">
          <Avatar className="h-9 w-9 border-2 border-teal-100">
            <AvatarFallback className="bg-teal-50 text-teal-700 text-xs font-bold uppercase">
              {userData.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-none mb-1">{userData.username.split('@')[0]}</p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{userData.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}