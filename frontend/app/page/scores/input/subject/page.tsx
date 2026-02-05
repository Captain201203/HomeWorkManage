"use client"

import { useState, useEffect, Suspense } from "react" // Thêm Suspense
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { subjectService } from "@/app/service/subject/service"
import { ISubject } from "@/app/types/subject/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookMarked, ChevronRight, ChevronLeft } from "lucide-react"

// 1. Thành phần chứa logic chính của trang
function SubjectSelectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get("semester")
  const major = searchParams.get("major")

  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!semester || !major) {
      router.push("/page/scores/input/semester")
      return
    }
    loadSubjects()
  }, [semester, major, router])

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const data = await subjectService.getAll() 
      const filtered = Array.isArray(data) 
        ? data.filter(s => s.majorName === major)
        : []
      setSubjects(filtered)
    } catch (error) {
      console.error("Lỗi tải môn học:", error)
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (subject: ISubject) => {
    const subjectRef = subject.subjectId
    router.push(`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subjectRef}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap pb-2">
              <Link href="/page/scores/input/semester" className="hover:text-teal-600 transition-colors">
                1. Học Kỳ
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link href={`/page/scores/input/major?semester=${semester}`} className="hover:text-teal-600 transition-colors">
                2. Ngành
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-teal-600 font-bold">3. Môn Học</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="opacity-50">4. Lớp</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="opacity-50">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="opacity-50">6. Nhập Điểm</span>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Chọn Môn Học</h1>
                <p className="text-muted-foreground mt-1">
                  Đang lọc môn học cho ngành: <span className="font-semibold text-foreground">{major}</span>
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/page/scores/input/major?semester=${semester}`)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay Lại Bước 2
              </Button>
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Đang tìm kiếm môn học...</p>
            </div>
          ) : subjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <BookMarked className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-lg font-medium">Không tìm thấy môn học nào</p>
                <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại ngành học hoặc thêm môn học mới.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card 
                  key={subject.subjectId}
                  className="group cursor-pointer border-2 hover:border-teal-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => handleSelect(subject)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="mb-1 uppercase text-[10px]">
                          Mã: {subject.subjectId}
                        </Badge>
                        <CardTitle className="text-xl group-hover:text-teal-700 transition-colors">
                          {subject.subjectName}
                        </CardTitle>
                      </div>
                      <div className="bg-teal-50 p-2 rounded-full">
                        <BookMarked className="w-5 h-5 text-teal-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        Thuộc: {subject.majorName}
                      </span>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Chọn Môn
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
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

// 2. Export default bọc trong Suspense để vượt qua lỗi Build
export default function SelectSubjectPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-muted-foreground">Đang tải danh sách môn học...</p>
        </div>
      </div>
    }>
      <SubjectSelectionContent />
    </Suspense>
  )
}