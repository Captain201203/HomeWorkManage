"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { studentService } from "@/app/service/student/service"
import { classService } from "@/app/service/class/service" 
import { IClass } from "@/app/types/class/type.js"
import { cn } from "@/lib/utils"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, ChevronRight } from "lucide-react"

export default function StudentFormPage() {
  const router = useRouter()
  const params = useParams()
  const studentIdParam = params?.id as string // Lấy studentId từ URL nếu có

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(false)
  
  const [classes, setClasses] = useState<IClass[]>([])

  // Khởi tạo state khớp với Model Backend
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    dateOfBirth: "",
    email: "",
    classId: "",
  })

  // 1. Fetch danh sách lớp học
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

  // 2. Fetch dữ liệu sinh viên cũ nếu là chế độ Sửa (Edit Mode)
  useEffect(() => {
    if (studentIdParam) {
      const fetchStudentDetail = async () => {
        try {
          setIsLoadingData(true)
          const data = await studentService.getById(studentIdParam)
          
          // Định dạng lại ngày sinh để hiển thị trong input[type="date"]
          const formattedDate = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : ""
          
          setFormData({
            studentId: data.studentId,
            studentName: data.studentName,
            dateOfBirth: formattedDate,
            email: data.email,
            classId: data.classId,
          })
        } catch (error) {
          alert("Không thể tải thông tin sinh viên.")
        } finally {
          setIsLoadingData(false)
        }
      }
      fetchStudentDetail()
    }
  }, [studentIdParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth)
      }

      if (studentIdParam) {
        // Chế độ CẬP NHẬT
        await studentService.update(studentIdParam, payload)
        alert("Thành công: Đã cập nhật thông tin sinh viên!")
      } else {
        // Chế độ THÊM MỚI
        await studentService.create(payload)
        alert("Thành công: Đã thêm sinh viên mới!")
      }

      router.push("/students")
      router.refresh()
    } catch (error: any) {
      alert("Lỗi: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/students" className="hover:text-foreground">Students</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            {studentIdParam ? "Edit Student" : "Add New Student"}
          </span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {studentIdParam ? "Chỉnh sửa sinh viên" : "Student Enrollment"}
          </h1>
          <p className="text-muted-foreground">
            {studentIdParam ? `Cập nhật thông tin cho mã sinh viên: ${studentIdParam}` : "Nhập thông tin chi tiết để đăng ký sinh viên vào hệ thống."}
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-sm">
            <CardContent className="p-8 space-y-8">
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
                    disabled={isSubmitting || !!studentIdParam} // Khóa mã MSSV khi đang sửa
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="SV2024001"
                  />
                </div>
              </div>

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
                      <SelectValue placeholder={isLoadingClasses ? "Đang tải lớp..." : "Chọn lớp học"} />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((item) => (
                        <SelectItem key={item._id} value={item.classId}>
                          {item.classId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground italic">(*) Bắt buộc điền.</p>
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> {studentIdParam ? "Cập nhật sinh viên" : "Lưu sinh viên"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}