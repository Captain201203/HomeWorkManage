"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Save, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/app/components/dasboard/sidebar"

import { semesterService } from "@/app/service/semester/service"
import { ISemester } from "@/app/types/semester/type"

export default function SemesterFormPage() {
  const router = useRouter()
  const params = useParams()
  const semesterId = params?.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [formData, setFormData] = useState<ISemester>({
    semesterId: "",
    semesterName: "",
    academicYear: "",
    startDate: "",
    endDate: "",
  } as ISemester)

  useEffect(() => {
    if (semesterId) {
      const fetchDetail = async () => {
        try {
          setLoadingData(true)
          const data = await semesterService.getById(semesterId)
          setFormData(data)
        } catch (error) {
          alert("Không thể tải dữ liệu học kì.")
        } finally {
          setLoadingData(false)
        }
      }
      fetchDetail()
    }
  }, [semesterId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (semesterId && semesterId !== "new") {
        await semesterService.update(semesterId, formData)
        alert("Cập nhật thành công!")
      } else {
        await semesterService.create(formData)
        alert("Thêm học kì thành công!")
      }
      router.push("/page/semesters")
      router.refresh()
    } catch (error: any) {
      alert("Lỗi: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData && semesterId !== "new") {
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
            <Link href="/page/semesters">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay Lại
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">
              {semesterId && semesterId !== "new" ? "Cập Nhật Học Kì" : "Thêm Học Kì Mới"}
            </h1>
          </div>

          {/* Form */}
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semesterId">Mã Học Kì *</Label>
                    <Input
                      id="semesterId"
                      value={formData.semesterId || ""}
                      onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                      placeholder="VD: HK1"
                      disabled={isLoading || (semesterId && semesterId !== "new")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semesterName">Tên Học Kì *</Label>
                    <Input
                      id="semesterName"
                      value={formData.semesterName || ""}
                      onChange={(e) => setFormData({ ...formData, semesterName: e.target.value })}
                      placeholder="VD: Học Kì 1"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Năm Học *</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear || ""}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="VD: 2024-2025"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày Bắt Đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate ? formData.startDate.toString().split('T')[0] : ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày Kết Thúc</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate ? formData.endDate.toString().split('T')[0] : ""}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
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
                  <Link href="/page/semesters">
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
