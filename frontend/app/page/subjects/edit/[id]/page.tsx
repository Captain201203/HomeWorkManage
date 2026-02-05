"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Save, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sidebar } from "@/app/components/dasboard/sidebar"

import { subjectService } from "@/app/service/subject/service"
import { majorService } from "@/app/service/major/service"
import { ISubject } from "@/app/types/subject/type"
import { IMajor } from "@/app/types/major/type"

export default function SubjectFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string // Đây là _id từ MongoDB hoặc "new"

  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [majors, setMajors] = useState<IMajor[]>([])
  
  // Khởi tạo formData theo đúng Interface ISubject
  const [formData, setFormData] = useState<ISubject>({
    subjectId: "",
    subjectName: "",
    majorName: "",
  })

  const isEditMode = id && id !== "new"

  useEffect(() => {
    fetchInitialData()
  }, [id])

  const fetchInitialData = async () => {
    try {
      setLoadingData(true)
      // Tải danh sách ngành học cho dropdown
      const majorsData = await majorService.getAll()
      setMajors(Array.isArray(majorsData) ? majorsData : [])

      // Nếu là chế độ chỉnh sửa, tải chi tiết môn học
      if (isEditMode) {
        const subjectDetail = await subjectService.getById(id)
        if (subjectDetail) {
          setFormData({
            subjectId: subjectDetail.subjectId,
            subjectName: subjectDetail.subjectName,
            majorName: subjectDetail.majorName,
          })
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditMode) {
        await subjectService.update(id, formData)
        alert("Cập nhật môn học thành công!")
      } else {
        await subjectService.create(formData)
        alert("Thêm môn học mới thành công!")
      }
      router.push("/page/subjects")
      router.refresh()
    } catch (error: any) {
      alert("Có lỗi xảy ra: " + (error.message || "Vui lòng thử lại"))
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header Navigation */}
          <div className="mb-8">
            <Link href="/page/subjects">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay Lại Danh Sách
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditMode ? "Chỉnh Sửa Môn Học" : "Tạo Môn Học Mới"}
            </h1>
          </div>

          <Card className="max-w-xl shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Mã Môn Học */}
                <div className="space-y-2">
                  <Label htmlFor="subjectId">Mã Môn Học (VD: CS101)</Label>
                  <Input
                    id="subjectId"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    placeholder="Nhập mã môn học..."
                    disabled={isEditMode || isLoading} // Thường không cho sửa ID chính
                    required
                  />
                </div>

                {/* Tên Môn Học */}
                <div className="space-y-2">
                  <Label htmlFor="subjectName">Tên Môn Học</Label>
                  <Input
                    id="subjectName"
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    placeholder="Nhập tên môn học..."
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Ngành Học (Dropdown) */}
                <div className="space-y-2">
                  <Label htmlFor="majorName">Thuộc Ngành</Label>
                  <select
                    id="majorName"
                    value={formData.majorName}
                    onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                    disabled={isLoading}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    <option value="">-- Chọn ngành học --</option>
                    {majors.map((major) => (
                      <option key={ major.majorId} value={major.majorName}>
                        {major.majorName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nút Thao Tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isEditMode ? "Cập Nhật" : "Lưu Môn Học"}
                  </Button>
                  <Link href="/page/subjects">
                    <Button type="button" variant="ghost" disabled={isLoading}>
                      Hủy Bỏ
                    </Button>
                  </Link>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}