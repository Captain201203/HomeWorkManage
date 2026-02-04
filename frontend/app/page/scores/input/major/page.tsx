"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { majorService } from "@/app/service/major/service"
import { IMajor } from "@/app/types/major/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, ChevronRight, ChevronLeft } from "lucide-react"

export default function SelectMajorPage() {
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
      setMajors(data)
    } catch (error) {
      console.error("Lỗi tải ngành:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (major: IMajor) => {
    const majorName = major.majorName
    router.push(`/page/scores/input/subject?semester=${semester}&major=${majorName}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/page/scores/input/semester" className="text-muted-foreground hover:text-primary">
                1. Học Kì
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">2. Ngành</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">3. Môn</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">4. Lớp</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">6. Nhập Điểm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chọn Ngành</h1>
                <p className="text-muted-foreground">Bước 2: Chọn ngành đào tạo</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push("/page/scores/input/semester")}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay Lại
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Đang tải danh sách ngành...</p>
              </div>
            </div>
          ) : majors.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có ngành nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {majors.map((major) => (
                <Card 
                  key={major._id || major.majorId}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelect(major)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {major.majorName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mã: {major.majorId}
                        </p>
                      </div>
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {major.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {major.description}
                      </p>
                    )}
                    <Button className="w-full" variant="default">
                      Chọn
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
