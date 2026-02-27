"use client"

import { useState, useEffect, Suspense } from "react" // Thêm Suspense
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { semesterService } from "@/app/service/semester/service"
import { ISemester } from "@/app/types/semester/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, ChevronRight } from "lucide-react"

// 1. Tách logic vào component Content
function SelectSemesterContent() {
  const router = useRouter()
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSemesters()
  }, [])

  const loadSemesters = async () => {
    try {
      setLoading(true)
      const data = await semesterService.getAll()
      
      // SỬA LỖI TẠI ĐÂY: Kiểm tra nếu data là mảng, nếu không gán mảng rỗng
      setSemesters(Array.isArray(data) ? data : [])
      
    } catch (error) {
      console.error("Lỗi tải học kì:", error)
      setSemesters([]) // Đảm bảo luôn là mảng khi có lỗi
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (semester: ISemester) => {
    const semesterId = semester.semesterId
    router.push(`/page/scores/input/major?semester=${semesterId}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
    
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="text-teal-600 font-bold">1. Học Kỳ</span>
              <ChevronRight className="w-4 h-4" />
              <span className="opacity-50">2. Ngành</span>
              {/* ... các bước khác ... */}
            </div>
            <h1 className="text-3xl font-bold mb-2">Nhập Điểm Sinh Viên</h1>
            <p className="text-muted-foreground">Bước 1: Chọn học kỳ để bắt đầu</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p>Đang tải danh sách học kỳ...</p>
            </div>
          ) : (!semesters || semesters.length === 0) ? ( // Kiểm tra an toàn thêm một lần nữa
            <Card>
              <CardContent className="pt-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có học kỳ nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semesters.map((semester) => (
                <Card 
                  key={ semester.semesterId}
                  className="group cursor-pointer border-2 hover:border-teal-600 transition-all shadow-sm"
                  onClick={() => handleSelect(semester)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-teal-700">
                          {semester.semesterName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 font-mono">
                          Mã: {semester.semesterId}
                        </p>
                      </div>
                      <Calendar className="w-5 h-5 text-teal-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                        {semester.semesterId.split('-').slice(1).join('-') || "Học kỳ"}
                      </Badge>
                    </div>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Chọn Học Kỳ
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// 2. Export default bọc trong Suspense
export default function SelectSemesterPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    }>
      <SelectSemesterContent />
    </Suspense>
  )
}