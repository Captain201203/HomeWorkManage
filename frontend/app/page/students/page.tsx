"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { studentService } from "../../service/student/service"

// Component dùng chung
import { Sidebar } from "../../components/dasboard/sidebar"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search, Plus, Mail, GraduationCap, 
  Pencil, Trash2, Loader2, Users
} from "lucide-react"

export default function StudentListPage() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch dữ liệu sinh viên
  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getAll()
      setStudents(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách sinh viên:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Xử lý xóa sinh viên
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

  // Logic lọc tìm kiếm
  const filteredStudents = students.filter(s => 
    s.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      {/* Sidebar dùng chung */}
      <Sidebar />

      {/* Main Content: Thêm md:ml-64 để tránh bị Sidebar đè lên nếu Sidebar là fixed */}
      <main className="flex-1 p-8 md:ml-64">
        <div className="flex flex-col gap-8">
          
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-teal-600">Students</h1>
              <p className="text-muted-foreground">Quản lý và theo dõi danh sách sinh viên trong hệ thống.</p>
            </div>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 shadow-md">
              <Link href="/page/students/new">
                <Plus className="mr-2 h-4 w-4" /> Add Student
              </Link>
            </Button>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4 bg-background p-4 rounded-xl shadow-sm border">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên hoặc mã số sinh viên..." 
                className="pl-9 border-none bg-muted/50 focus-visible:ring-teal-500" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 px-3 py-1">
              Tổng số: {filteredStudents.length}
            </Badge>
          </div>

          {/* Student Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-3">
              <Loader2 className="animate-spin h-10 w-10 text-teal-600" />
              <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Card key={student._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group relative">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                      <Avatar className="h-14 w-14 border-2 border-teal-100">
                        <AvatarFallback className="bg-teal-50 text-teal-700 font-bold uppercase text-lg">
                          {student.studentName?.substring(0, 2) || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-teal-600 transition-colors">
                          {student.studentName}
                        </CardTitle>
                        <p className="text-xs font-mono text-muted-foreground tracking-wider">
                          ID: {student.studentId}
                        </p>
                      </div>
                      
                      {/* Nút hành động nổi trên Card */}
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                        <Link href={`/page/students/edit/${student.studentId}`}>
                          <Button variant="secondary" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 shadow-sm border">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-red-50 hover:text-destructive shadow-sm border"
                          onClick={() => handleDelete(student.studentId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      <div className="grid gap-3 p-3 rounded-lg bg-muted/30 text-sm border border-dashed">
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="mr-2 h-4 w-4 text-teal-600" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <GraduationCap className="mr-2 h-4 w-4 text-teal-600" />
                          <span className="font-medium">Lớp: {student.classId}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full hover:bg-teal-600 hover:text-white border-teal-100 transition-colors" asChild>
                        <Link href={`/students/${student.studentId}`}>Chi tiết hồ sơ</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-24 text-center border-2 border-dashed rounded-3xl bg-background/50">
                   <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                   <p className="text-muted-foreground font-medium">Không tìm thấy sinh viên nào phù hợp với tìm kiếm.</p>
                   <Button variant="link" className="text-teal-600" onClick={() => setSearchQuery("")}>Xóa tìm kiếm</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}