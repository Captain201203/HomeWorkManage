"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { classService } from "@/app/service/class/service"
import { IClass } from "@/app/types/class/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, ChevronRight, ChevronLeft } from "lucide-react"

export default function SelectClassPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get("semester")
  const major = searchParams.get("major")
  const subject = searchParams.get("subject")

  const [classes, setClasses] = useState<IClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!semester || !major || !subject) {
      router.push("/page/scores/input/semester")
      return
    }
    loadClasses()
  }, [semester, major, subject, router])

  const loadClasses = async () => {
    try {
      setLoading(true)
      const data = await classService.getAll()
      setClasses(data)
    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (cls: IClass) => {
    const classId = cls._id || cls.classId
    router.push(`/page/scores/input/student?semester=${semester}&major=${major}&subject=${subject}&class=${classId}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto pb-2">
              <Link href="/page/scores/input/semester" className="text-muted-foreground hover:text-primary">
                1. Học Kì
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link href={`/page/scores/input/major?semester=${semester}`} className="text-muted-foreground hover:text-primary">
                2. Ngành
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link href={`/page/scores/input/subject?semester=${semester}&major=${major}`} className="text-muted-foreground hover:text-primary">
                3. Môn
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-primary font-medium flex-shrink-0">4. Lớp</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-muted-foreground flex-shrink-0">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-muted-foreground flex-shrink-0">6. Nhập Điểm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chọn Lớp Học</h1>
                <p className="text-muted-foreground">Bước 4: Chọn lớp học</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/page/scores/input/subject?semester=${semester}&major=${major}`)}
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
                <p>Đang tải danh sách lớp...</p>
              </div>
            </div>
          ) : classes.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có lớp nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card 
                  key={cls._id || cls.classId}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelect(cls)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {cls.className}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mã: {cls.classId}
                        </p>
                      </div>
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cls.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {cls.description}
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
