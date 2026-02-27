"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { studentService } from "@/app/service/student/service"
import { cn } from "@/lib/utils"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, Camera, Upload, ChevronRight, Users, LayoutDashboard, Calendar, Star } from "lucide-react"
import { IClass } from "@/app/types/class/type.js"
import { classService } from "@/app/service/class/service" 
import { useEffect } from "react"


export default function NewStudentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [classes, setClasses] = useState<IClass[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)

  // Khởi tạo state khớp với Model Backend
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    dateOfBirth: "",
    email: "",
    classId: "", // Trường bổ sung nếu cần
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Gọi API POST qua service
      await studentService.create({
        ...formData,
        // Đảm bảo dateOfBirth được gửi đúng định dạng Date cho MongoDB
        dateOfBirth: new Date(formData.dateOfBirth)
      })

      alert("Thành công: Đã thêm sinh viên mới!")
      router.push("/students") // Chuyển hướng về trang danh sách
      router.refresh()        // Làm mới dữ liệu Server Components
    } catch (error: any) {
      alert("Lỗi: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true)
        const data = await classService.getAll()
        setClasses(data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp:", error)
      } finally {
        setIsLoadingClasses(false)
      }
    }
    fetchClasses()
  }, [])

  

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/students" className="hover:text-foreground">Students</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Add New Student</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Enrollment</h1>
          <p className="text-muted-foreground">Nhập thông tin chi tiết để đăng ký sinh viên vào hệ thống.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-sm">
            <CardContent className="p-8 space-y-8">
              {/* Section 1: Thông tin định danh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Họ và Tên <span className="text-red-500">*</span></Label>
                  <Input
                    id="studentName"
                    required
                    disabled={isSubmitting}
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Mã Số Sinh Viên (MSSV) <span className="text-red-500">*</span></Label>
                  <Input
                    id="studentId"
                    required
                    disabled={isSubmitting}
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="SV2024001"
                  />
                </div>
              </div>

              {/* Section 2: Thông tin cá nhân & Lớp */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày Sinh <span className="text-red-500">*</span></Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    required
                    disabled={isSubmitting}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="classId">Lớp Học <span className="text-red-500">*</span></Label>
                <Select
                  disabled={isSubmitting || isLoadingClasses}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  value={formData.classId}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={isLoadingClasses ? "Đang tải danh sách lớp..." : "Chọn lớp học chuyên ngành"} 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 2. Duyệt qua mảng classes để hiển thị danh sách động */}
                    {classes.length > 0 ? (
                      classes.map((item) => (
                        <SelectItem key={item._id} value={item.classId}>
                          {item.classId}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">
                        Không có lớp học nào
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {/* Hiển thị thông báo nhỏ nếu đang tải */}
                {isLoadingClasses && <p className="text-[10px] text-teal-600 animate-pulse">Đang cập nhật dữ liệu từ máy chủ...</p>}
              </div>
              </div>

              {/* Section 3: Liên hệ */}
              <div className="space-y-6 pt-4 border-t">
                <h3 className="font-medium">Thông tin liên hệ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@student.edu.vn"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground italic">
              Vui lòng kiểm tra kỹ MSSV và Email trước khi lưu.
            </p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 min-w-[140px]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu sinh viên
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}