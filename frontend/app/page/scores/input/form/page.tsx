"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { scoreService } from "@/app/service/score/service"
import { studentService } from "@/app/service/student/service"
import { subjectService } from "@/app/service/subject/service"
import { IStudent } from "@/app/types/student/type"
import { ISubject } from "@/app/types/subject/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, ChevronLeft } from "lucide-react"

export default function ScoreInputFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get("semester")
  const major = searchParams.get("major")
  const subject = searchParams.get("subject")
  const classId = searchParams.get("class")
  const studentId = searchParams.get("student")

  const [student, setStudent] = useState<IStudent | null>(null)
  const [subjectData, setSubjectData] = useState<ISubject | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [ex1Score, setEx1Score] = useState("")
  const [ex2Score, setEx2Score] = useState("")
  const [examScore, setExamScore] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!semester || !major || !subject || !classId || !studentId) {
      router.push("/page/scores/input/semester")
      return
    }
    loadData()
  }, [semester, major, subject, classId, studentId, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [studentData, subjectDataResult] = await Promise.all([
        studentService.getById(studentId!),
        subjectService.getById(subject!),
      ])
      setStudent(studentData)
      setSubjectData(subjectDataResult)
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err)
      setError("Không thể tải thông tin sinh viên hoặc môn học")
    } finally {
      setLoading(false)
    }
  }

  const validateScores = () => {
    const ex1 = parseFloat(ex1Score)
    const ex2 = parseFloat(ex2Score)
    const exam = parseFloat(examScore)

    if (isNaN(ex1) || isNaN(ex2) || isNaN(exam)) {
      setError("Vui lòng nhập tất cả các điểm")
      return false
    }

    if (ex1 < 0 || ex1 > 10 || ex2 < 0 || ex2 > 10 || exam < 0 || exam > 10) {
      setError("Điểm phải nằm trong khoảng 0-10")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateScores()) return

    setSubmitting(true)

    try {
      const scoreData = {
        studentId: student?._id || student?.studentId,
        subjectId: subject,
        subjectName: subjectData?.subjectName,
        className: classId,
        semester: semester,
        ex1Score: parseFloat(ex1Score),
        ex2Score: parseFloat(ex2Score),
        examScore: parseFloat(examScore),
      }

      console.log("[v0] Submitting score:", scoreData)

      await scoreService.upsertScore(scoreData)

      alert("Lưu điểm thành công!")
      router.push(`/page/scores/input/student?semester=${semester}&major=${major}&subject=${subject}&class=${classId}`)
    } catch (err) {
      console.error("[v0] Error submitting score:", err)
      setError("Lỗi khi lưu điểm. Vui lòng thử lại!")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
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
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto pb-2">
              <Link href="/page/scores/input/semester" className="text-muted-foreground hover:text-primary">
                1. Học Kì
              </Link>
              <span className="text-muted-foreground flex-shrink-0">→</span>
              <Link href={`/page/scores/input/major?semester=${semester}`} className="text-muted-foreground hover:text-primary">
                2. Ngành
              </Link>
              <span className="text-muted-foreground flex-shrink-0">→</span>
              <Link href={`/page/scores/input/subject?semester=${semester}&major=${major}`} className="text-muted-foreground hover:text-primary">
                3. Môn
              </Link>
              <span className="text-muted-foreground flex-shrink-0">→</span>
              <Link href={`/page/scores/input/class?semester=${semester}&major=${major}&subject=${subject}`} className="text-muted-foreground hover:text-primary">
                4. Lớp
              </Link>
              <span className="text-muted-foreground flex-shrink-0">→</span>
              <Link href={`/page/scores/input/student?semester=${semester}&major=${major}&subject=${subject}&class=${classId}`} className="text-muted-foreground hover:text-primary">
                5. Sinh Viên
              </Link>
              <span className="text-muted-foreground flex-shrink-0">→</span>
              <span className="text-primary font-medium flex-shrink-0">6. Nhập Điểm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Nhập Điểm Sinh Viên</h1>
                <p className="text-muted-foreground">Bước 6: Điền điểm cho sinh viên</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/page/scores/input/student?semester=${semester}&major=${major}&subject=${subject}&class=${classId}`)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay Lại
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sinh Viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">{student?.studentName}</p>
                  <p className="text-sm text-muted-foreground">Mã: {student?.studentId}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Môn Học</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">{subjectData?.subjectName}</p>
                  <p className="text-sm text-muted-foreground">Mã: {subjectData?.subjectId}</p>
                </CardContent>
              </Card>
            </div>

            {/* Score Input Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nhập Điểm</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="ex1" className="text-base font-medium">
                        Điểm Kiểm Tra 1
                      </Label>
                      <Input
                        id="ex1"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        placeholder="0-10"
                        value={ex1Score}
                        onChange={(e) => setEx1Score(e.target.value)}
                        disabled={submitting}
                      />
                      <p className="text-xs text-muted-foreground">Nhập giá trị từ 0 đến 10</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ex2" className="text-base font-medium">
                        Điểm Kiểm Tra 2
                      </Label>
                      <Input
                        id="ex2"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        placeholder="0-10"
                        value={ex2Score}
                        onChange={(e) => setEx2Score(e.target.value)}
                        disabled={submitting}
                      />
                      <p className="text-xs text-muted-foreground">Nhập giá trị từ 0 đến 10</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exam" className="text-base font-medium">
                        Điểm Thi
                      </Label>
                      <Input
                        id="exam"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        placeholder="0-10"
                        value={examScore}
                        onChange={(e) => setExamScore(e.target.value)}
                        disabled={submitting}
                      />
                      <p className="text-xs text-muted-foreground">Nhập giá trị từ 0 đến 10</p>
                    </div>

                    <div className="bg-muted/50 rounded-md p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Ghi chú:</strong> Điểm trung bình = (Kiểm Tra 1 + Kiểm Tra 2 + Thi) / 3
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Lưu Điểm
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/page/scores/input/student?semester=${semester}&major=${major}&subject=${subject}&class=${classId}`)}
                        disabled={submitting}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
