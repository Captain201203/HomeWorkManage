"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { studentService } from "@/app/service/student/service"
import { IStudent } from "@/app/types/student/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, UserCheck, ChevronRight, ChevronLeft } from "lucide-react"

export default function SelectStudentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get("semester")
  const major = searchParams.get("major")
  const subject = searchParams.get("subject")
  const classId = searchParams.get("class")

  const [students, setStudents] = useState<IStudent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!semester || !major || !subject || !classId) {
      router.push("/page/scores/input/semester")
      return
    }
    loadStudents()
  }, [semester, major, subject, classId, router])

  const loadStudents = async () => {
    try {
      setLoading(true)
      if (classId) {
        const data = await studentService.getByClass(classId)
        setStudents(data)
      }
    } catch (error) {
      console.error("Lỗi tải danh sách sinh viên:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (student: IStudent) => {
    const studentId = student._id || student.studentId
    router.push(
      `/page/scores/input/form?semester=${semester}&major=${major}&subject=${subject}&class=${classId}&student=${studentId}`
    )
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
              <Link href={`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subject}`} className="text-muted-foreground hover:text-primary">
                4. Lớp
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-primary font-medium flex-shrink-0">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-muted-foreground flex-shrink-0">6. Nhập Điểm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chọn Sinh Viên</h1>
                <p className="text-muted-foreground">Bước 5: Chọn sinh viên để nhập điểm</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subject}`)}
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
                <p>Đang tải danh sách sinh viên...</p>
              </div>
            </div>
          ) : students.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <UserCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có sinh viên nào trong lớp này</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <Card 
                  key={student._id || student.studentId}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelect(student)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10">
                            {student.studentName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{student.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            Mã: {student.studentId}
                          </p>
                        </div>
                      </div>
                      <Button variant="default" size="sm">
                        Chọn
                        <ChevronRight className="w-4 h-4 ml-2" />
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
