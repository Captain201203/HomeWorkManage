import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { studentService } from "../service/student/service"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  Star,
  Plus,
  MoreVertical,
  Mail,
  GraduationCap
} from "lucide-react"

const sidebarItems = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: Users, active: true },
  { title: "Attendance", href: "/attendance", icon: Calendar },
  { title: "Grades", href: "/grades", icon: Star },
]

export default async function StudentListPage() {
  // Lấy dữ liệu từ API
  let students: any[] = [];
  try {
    students = await studentService.getAll();
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar - Cố định */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-background hidden md:flex flex-col">
        <div className="flex items-center gap-2 border-b px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-teal-600">EduFlow</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                item.active ? "bg-teal-50 text-teal-700" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Students</h1>
              <p className="text-muted-foreground">Quản lý danh sách sinh viên trong hệ thống.</p>
            </div>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/students/new">
                <Plus className="mr-2 h-4 w-4" /> Add Student
              </Link>
            </Button>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9" />
            </div>
            <Badge variant="outline" className="px-3 py-1">Total: {students.length}</Badge>
          </div>

          {/* Student Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {students.length > 0 ? (
              students.map((student) => (
                <Card key={student._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarFallback className="bg-teal-100 text-teal-700 uppercase">
                        {student.studentName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{student.studentName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Class: {student.classId}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Born: {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t flex justify-between gap-2">
                       <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/students/${student._id}`}>View Profile</Link>
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Chưa có dữ liệu sinh viên nào.</p>
                <Button variant="link" asChild>
                   <Link href="/students/new">Thêm sinh viên ngay</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}