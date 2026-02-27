"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { majorService } from "@/app/service/major/service"
import { IMajor } from "@/app/types/major/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, ChevronRight, ChevronLeft } from "lucide-react"

// 1. Thành phần chứa logic chính
function MajorSelectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get("semester")

  const [majors, setMajors] = useState<IMajor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!semester) {
      router.push("/page/scores/input/semester")
      return
    }
    loadMajors()
  }, [semester, router])

  const loadMajors = async () => {
    try {
      setLoading(true)
      const data = await majorService.getAll()
      setMajors(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Lỗi tải ngành:", error)
      setMajors([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (major: IMajor) => {
    const majorName = encodeURIComponent(major.majorName)
    router.push(`/page/scores/input/subject?semester=${semester}&major=${majorName}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/page/scores/input/semester" className="hover:text-teal-600 transition-colors">
                1. Học Kỳ
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-teal-600 font-bold">2. Ngành</span>
              <ChevronRight className="w-4 h-4" />
              <span className="opacity-50">3. Môn Học</span>
              <ChevronRight className="w-4 h-4" />
              <span className="opacity-50">4. Lớp</span>
              <ChevronRight className="w-4 h-4" />
              <span className="opacity-50">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4" />
              <span className="opacity-50">6. Nhập Điểm</span>
            </nav>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Chọn Ngành</h1>
                <p className="text-muted-foreground mt-1">
                  Bước 2: Lọc môn học theo ngành đào tạo
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/page/scores/input/semester")}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay Lại Bước 1
              </Button>
            </div>
          </div>

          <hr className="mb-8 opacity-50" />

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Đang tải danh sách ngành đào tạo...</p>
            </div>
          ) : majors.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-lg font-medium">Hiện chưa có ngành nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majors.map((major) => (
                <Card 
                  key={major.majorId}
                  className="group cursor-pointer border-2 hover:border-teal-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => handleSelect(major)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          Mã: {major.majorId}
                        </Badge>
                        <CardTitle className="text-xl group-hover:text-teal-700 transition-colors pt-1">
                          {major.majorName}
                        </CardTitle>
                      </div>
                      <div className="bg-teal-50 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-teal-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" variant="default">
                      Tiếp Tục
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

// 2. Export default bọc trong Suspense để sửa lỗi Build
export default function SelectMajorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-muted-foreground">Đang khởi tạo danh mục ngành...</p>
        </div>
      </div>
    }>
      <MajorSelectionContent />
    </Suspense>
  )
}