"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { semesterService } from "../../../service/semester/service"
import { ISemester } from "../../../types/semester/type"

import { Sidebar } from "../../../components/dasboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2, Loader2, Calendar, CalendarDays } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export default function SemesterListPage() {
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const loadSemesters = async () => {
    try {
      setLoading(true)
      const data = await semesterService.getAll()
      // Đảm bảo data luôn là mảng để tránh lỗi .filter/length
      setSemesters(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Lỗi khi tải danh sách học kì:", error)
      setSemesters([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSemesters()
  }, [])

  const handleDelete = async (semesterId: string) => {
    if (confirm(`Bạn có chắc muốn xóa học kì này?`)) {
      try {
        await semesterService.delete(semesterId)
        setSemesters(prev => prev.filter(s => ( s.semesterId !== semesterId)))
        alert("Xóa thành công!")
      } catch (error: any) {
        alert("Lỗi: " + error.message)
      }
    }
  }

  // Lọc theo mã gộp hoặc tên học kỳ
  const filteredSemesters = semesters.filter(s =>
    s.semesterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.semesterId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string | Date) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString('vi-VN')
  }

  return (
    <div className="flex min-h-screen bg-background">
     
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Quản Lý Học Kỳ</h1>
              <p className="text-muted-foreground">
                Quản lý danh sách học kỳ và thời gian nhập điểm.
              </p>
            </div>
            <Link href="/page/semesters/new">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Học Kỳ
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã (VD: HK1-2025)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              Tổng số: {filteredSemesters.length}
            </Badge>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Đang tải dữ liệu học kỳ...</p>
            </div>
          ) : filteredSemesters.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">Không tìm thấy học kỳ nào phù hợp</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">Mã Học Kỳ (Gộp)</TableHead>
                    <TableHead>Tên Học Kỳ</TableHead>
                    <TableHead>Ngày Bắt Đầu</TableHead>
                    <TableHead>Ngày Kết Thúc</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSemesters.map((semester) => (
                    <TableRow key={ semester.semesterId} className="hover:bg-muted/30">
                      <TableCell>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                          {semester.semesterId}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium">
                        {semester.semesterName}
                      </TableCell>
                      <TableCell>{formatDate(semester.startDate)}</TableCell>
                      <TableCell>{formatDate(semester.endDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/page/semesters/edit/${ semester.semesterId}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete( semester.semesterId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}