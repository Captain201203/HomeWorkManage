"use client" // Chuyển sang Client Component để xử lý sự kiện onClick và State

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { studentService } from "../service/student/service"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search, Users, Plus, Mail, GraduationCap, 
  Pencil, Trash2, Loader2, Calendar, LayoutDashboard, Star
} from "lucide-react"

export default function StudentListPage() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch dữ liệu
  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getAll()
      setStudents(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Xử lý xóa
  const handleDelete = async (studentId: string) => {
    if (confirm(`Bạn có chắc muốn xóa sinh viên mã ${studentId}?`)) {
      try {
        await studentService.delete(studentId)
        setStudents(prev => prev.filter(s => s.studentId !== studentId))
        alert("Đã xóa sinh viên thành công")
      } catch (error) {
        alert("Lỗi khi xóa sinh viên")
      }
    }
  }

  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      {/* Sidebar - Giữ nguyên logic */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-background hidden md:flex flex-col">
        <div className="flex items-center gap-2 border-b px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-teal-600">EduFlow</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
            <Link href="/students" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-teal-50 text-teal-700">
                <Users className="h-5 w-5" /> Students
            </Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Students</h1>
              <p className="text-muted-foreground">Quản lý danh sách sinh viên thực tế.</p>
            </div>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/students/new"><Plus className="mr-2 h-4 w-4" /> Add Student</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Tìm theo tên hoặc MSSV..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Badge variant="outline" className="px-3 py-1">Total: {filteredStudents.length}</Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-teal-600" /></div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Card key={student._id} className="overflow-hidden hover:shadow-md transition-all group">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 relative">
                      <Avatar className="h-12 w-12 border">
                        <AvatarFallback className="bg-teal-100 text-teal-700 uppercase">
                          {student.studentName?.substring(0, 2) || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{student.studentName}</CardTitle>
                        <p className="text-xs font-mono text-muted-foreground">{student.studentId}</p>
                      </div>
                      
                      {/* Nhóm nút Action */}
                      <div className="flex gap-1">
                        <Link href={`/students/edit/${student.studentId}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(student.studentId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Class: {student.classId}</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full" asChild>
                        <Link href={`/students/${student.studentId}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
                   <p className="text-muted-foreground">Không tìm thấy sinh viên phù hợp.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}