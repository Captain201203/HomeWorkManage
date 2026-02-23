// src/app/page/student/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { scoreService } from "@/app/service/score/service"
import { IScore } from "@/app/types/score/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, BookOpen, User } from "lucide-react"

export default function StudentDashboard() {
  const [scores, setScores] = useState<IScore[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const studentId = localStorage.getItem("student_session")
    const token = localStorage.getItem("token")

    // Nếu không có session hoặc token, bắt quay lại trang login
    if (!studentId || !token) {
      router.push("/login")
      return
    }

    loadMyScores(studentId)
  }, [])

  const loadMyScores = async (id: string) => {
    try {
      setLoading(true)
      // Sử dụng hàm getAll có sẵn và truyền studentId vào query
      // Backend sẽ nhận query này và Middleware checkStudentOwnData sẽ kiểm tra
      const data = await scoreService.getAll({ studentId: id })
      setScores(data || [])
    } catch (err) {
      console.error("Lỗi tải điểm:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/page/login")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-full text-teal-700">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Cổng Thông Tin Sinh Viên</h2>
              <p className="text-slate-500">Mã SV: {localStorage.getItem("student_session")}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
          </Button>
        </div>

        {/* Scores Table */}
        <Card className="shadow-md border-none overflow-hidden">
          <CardHeader className="bg-white border-b flex flex-row items-center gap-2">
            <BookOpen className="text-teal-600" />
            <CardTitle className="text-teal-700">Kết quả học tập</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Môn Học</TableHead>
                    <TableHead>Học Kỳ</TableHead>
                    <TableHead className="text-center">KT1</TableHead>
                    <TableHead className="text-center">KT2</TableHead>
                    <TableHead className="text-center">Thi</TableHead>
                    <TableHead className="text-center font-bold">Trung Bình</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.length > 0 ? (
                    scores.map((score, index) => (
                      <TableRow key={index} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          {score.subjectName}
                          <div className="text-[10px] text-slate-400 uppercase">{score.subjectId}</div>
                        </TableCell>
                        <TableCell className="text-slate-600">{score.semester}</TableCell>
                        <TableCell className="text-center">{score.ex1Score}</TableCell>
                        <TableCell className="text-center">{score.ex2Score}</TableCell>
                        <TableCell className="text-center">{score.examScore}</TableCell>
                        <TableCell className="text-center font-bold text-teal-700 bg-teal-50/30">
                          {((score.ex1Score + score.ex2Score + score.examScore) / 3).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                        Chưa có dữ liệu điểm.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}