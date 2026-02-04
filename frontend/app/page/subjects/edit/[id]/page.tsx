"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Save, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/app/components/dasboard/sidebar"

import { subjectService } from "@/app/service/subject/service"
import { majorService } from "@/app/service/major/service"
import { ISubject } from "@/app/types/subject/type"
import { IMajor } from "@/app/types/major/type"

export default function SubjectFormPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params?.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [majors, setMajors] = useState<IMajor[]>([])
  const [formData, setFormData] = useState<ISubject>({
    subjectId: "",
    subjectName: "",
    majorName: "",
    credits: 3,
    description: "",
  } as ISubject)

  useEffect(() => {
    loadMajors()
    if (subjectId && subjectId !== "new") {
      const fetchDetail = async () => {
        try {
          setLoadingData(true)
          const data = await subjectService.getById(subjectId)
          setFormData(data)
        } catch (error) {
          alert("Không thể tải dữ liệu môn học.")
        } finally {
          setLoadingData(false)
        }
      }
      fetchDetail()
    }
  }, [subjectId])

  const loadMajors = async () => {
    try {
      const data = await majorService.getAll()
      setMajors(data)
    } catch (error) {
      console.error("Lỗi tải danh sách ngành:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (subjectId && subjectId !== "new") {
        await subjectService.update(subjectId, formData)
        alert("Cập nhật thành công!")
      } else {
        await subjectService.create(formData)
        alert("Thêm môn học thành công!")
      }
      router.push("/page/subjects")
      router.refresh()
    } catch (error: any) {
      alert("Lỗi: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData && subjectId !== "new") {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Đang tải...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/page/subjects">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay Lại
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">
              {subjectId && subjectId !== "new" ? "Cập Nhật Môn Học" : "Thêm Môn Học Mới"}
            </h1>
          </div>

          {/* Form */}
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectId">Mã Môn Học *</Label>
                    <Input
                      id="subjectId"
                      value={formData.subjectId || ""}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      placeholder="VD: MATH101"
                      disabled={isLoading || (subjectId && subjectId !== "new")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjectName">Tên Môn Học *</Label>
                    <Input
                      id="subjectName"
                      value={formData.subjectName || ""}
                      onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                      placeholder="VD: Toán Cao Cấp"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="majorName">Ngành *</Label>
                    <select
                      id="majorName"
                      value={formData.majorName || ""}
                      onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                      disabled={isLoading}
                      required
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    >
                      <option value="">Chọn ngành...</option>
                      {majors.map((major) => (
                        <option key={major._id || major.majorId} value={major.majorName}>
                          {major.majorName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credits">Tín Chỉ</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.credits || 3}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô Tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả chi tiết về môn học..."
                    disabled={isLoading}
                    rows={5}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </>
                    )}
                  </Button>
                  <Link href="/page/subjects">
                    <Button type="button" variant="outline" disabled={isLoading}>
                      Hủy
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
