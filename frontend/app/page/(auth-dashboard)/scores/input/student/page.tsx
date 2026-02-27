"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { studentService } from "@/app/service/student/service"
import { IStudent } from "@/app/types/student/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, UserCheck, ChevronRight, ChevronLeft, Users } from "lucide-react"

// 1. Thành phần chứa logic chính
function StudentSelectionContent() {
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
      setLoading(true);
      
      // Gọi API. Lưu ý: Nếu Server trả về rỗng, có thể do classId này là ObjectId 
      // trong khi Server mong đợi mã lớp (22DTHG3).
      const data = await studentService.getByClass(classId!);
      
      console.log("Dữ liệu SV từ API:", data);

      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        // Trường hợp API trả về object có bọc data
        const studentData = (data as any).data || data;
        setStudents(Array.isArray(studentData) ? studentData : []);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách sinh viên:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (student: IStudent) => {
    const studentId =  student.studentId
    router.push(
      `/page/scores/input/form?semester=${semester}&major=${major}&subject=${subject}&class=${classId}&student=${studentId}`
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap pb-2">
              <Link href="/page/scores/input/semester" className="hover:text-teal-600">1. Học Kỳ</Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link href={`/page/scores/input/major?semester=${semester}`} className="hover:text-teal-600">2. Ngành</Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link href={`/page/scores/input/subject?semester=${semester}&major=${major}`} className="hover:text-teal-600">3. Môn</Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link href={`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subject}`} className="hover:text-teal-600">4. Lớp</Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-teal-600 font-bold">5. Sinh Viên</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="opacity-50">6. Nhập Điểm</span>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Chọn Sinh Viên</h1>
                <p className="text-muted-foreground mt-1">
                  Đang xem danh sách lớp: <span className="font-semibold text-foreground">{classId}</span>
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subject}`)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay Lại Bước 4
              </Button>
            </div>
          </div>

          <hr className="mb-8 opacity-50" />

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Đang tải danh sách sinh viên...</p>
            </div>
          ) : students.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-lg font-medium">Lớp học này chưa có sinh viên</p>
                <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại dữ liệu phân lớp.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {students.map((student) => (
                <Card 
                  key={student._id || student.studentId}
                  className="group cursor-pointer border-2 hover:border-teal-600 transition-all duration-200 shadow-sm"
                  onClick={() => handleSelect(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback className="bg-teal-50 text-teal-700 font-bold">
                            {student.studentName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg group-hover:text-teal-700 transition-colors">
                            {student.studentName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            MSSV: <span className="font-mono">{student.studentId}</span>
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Chọn
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

// 2. Export default bọc trong Suspense để sửa lỗi Build
export default function SelectStudentPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-muted-foreground">Đang chuẩn bị danh sách...</p>
        </div>
      </div>
    }>
      <StudentSelectionContent />
    </Suspense>
  )
}