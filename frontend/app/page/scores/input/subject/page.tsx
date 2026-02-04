"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { subjectService } from "@/app/service/subject/service"
import { ISubject } from "@/app/types/subject/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookMarked, ChevronRight, ChevronLeft } from "lucide-react"

export default function SelectSubjectPage() {
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
      if (major) {
        const data = await subjectService.getByMajor(major)
        setSubjects(data)
      }
    } catch (error) {
      console.error("Lỗi tải môn học:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (subject: ISubject) => {
    const subjectId = subject._id || subject.subjectId
    router.push(`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subjectId}`)
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
              <Link href={`/page/scores/input/major?semester=${semester}`} className="text-muted-foreground hover:text-primary">
                2. Ngành
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">3. Môn</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">4. Lớp</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-muted-foreground">6. Nhập Điểm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chọn Môn Học</h1>
                <p className="text-muted-foreground">Bước 3: Chọn môn học (Ngành: {major})</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/page/scores/input/major?semester=${semester}`)}
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
                <p>Đang tải danh sách môn học...</p>
              </div>
            </div>
          ) : subjects.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <BookMarked className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có môn học nào cho ngành này</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card 
                  key={subject._id || subject.subjectId}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelect(subject)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {subject.subjectName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mã: {subject.subjectId}
                        </p>
                      </div>
                      <BookMarked className="w-5 h-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {subject.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {subject.description}
                      </p>
                    )}
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline">Tín chỉ</Badge>
                      <Badge>{subject.credits || 3}</Badge>
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
