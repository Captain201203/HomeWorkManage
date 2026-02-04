"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { semesterService } from "@/app/service/semester/service"
import { ISemester } from "@/app/types/semester/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, ChevronRight } from "lucide-react"

export default function SelectSemesterPage() {
  const router = useRouter()
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    loadSemesters()
  }, [])

  const loadSemesters = async () => {
    try {
      setLoading(true)
      const data = await semesterService.getAll()
      setSemesters(data)
    } catch (error) {
      console.error("Lỗi tải học kì:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (semester: ISemester) => {
    const semesterId = semester._id || semester.semesterId
    router.push(`/page/scores/input/major?semester=${semesterId}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/page/scores/input/semester" className="text-primary font-medium">
                1. Học Kì
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">2. Ngành</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">3. Môn</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">4. Lớp</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">6. Nhập Điểm</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Nhập Điểm Sinh Viên</h1>
            <p className="text-muted-foreground">Bước 1: Chọn học kì để bắt đầu</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Đang tải danh sách học kì...</p>
              </div>
            </div>
          ) : semesters.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có học kì nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semesters.map((semester) => (
                <Card 
                  key={semester._id || semester.semesterId}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelect(semester)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {semester.semesterName || "Học kì"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mã: {semester.semesterId}
                        </p>
                      </div>
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline">Năm học</Badge>
                      <Badge>{semester.academicYear}</Badge>
                    </div>
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
