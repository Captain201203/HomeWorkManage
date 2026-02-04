"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { semesterService } from "../../service/semester/service"
import { ISemester } from "../../types/semester/type"

import { Sidebar } from "../../components/dasboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SemesterListPage() {
  const router = useRouter()
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const loadSemesters = async () => {
    try {
      setLoading(true)
      const data = await semesterService.getAll()
      setSemesters(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách học kì:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSemesters()
  }, [])

  const handleDelete = async (semesterId: string) => {
    if (confirm(`Bạn có chắc muốn xóa học kì mã ${semesterId}?`)) {
      try {
        await semesterService.delete(semesterId)
        setSemesters(prev => prev.filter(s => s.semesterId !== semesterId))
        alert("Xóa thành công!")
      } catch (error: any) {
        alert("Lỗi: " + error.message)
      }
    }
  }

  const filteredSemesters = semesters.filter(s =>
    s.semesterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.semesterId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quản Lý Học Kì</h1>
              <p className="text-muted-foreground">Tổng số: {semesters.length} học kì</p>
            </div>
            <Link href="/page/semesters/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm Học Kì
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã hoặc tên học kì..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Đang tải...</p>
              </div>
            </div>
          ) : filteredSemesters.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có học kì nào</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã Học Kì</TableHead>
                        <TableHead>Tên Học Kì</TableHead>
                        <TableHead>Năm Học</TableHead>
                        <TableHead>Ngày Bắt Đầu</TableHead>
                        <TableHead>Ngày Kết Thúc</TableHead>
                        <TableHead className="text-right">Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSemesters.map((semester) => (
                        <TableRow key={semester._id || semester.semesterId}>
                          <TableCell>
                            <Badge variant="outline">{semester.semesterId}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{semester.semesterName}</TableCell>
                          <TableCell>{semester.academicYear}</TableCell>
                          <TableCell>{semester.startDate ? new Date(semester.startDate).toLocaleDateString('vi-VN') : '-'}</TableCell>
                          <TableCell>{semester.endDate ? new Date(semester.endDate).toLocaleDateString('vi-VN') : '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/page/semesters/edit/${semester._id || semester.semesterId}`}>
                                <Button variant="outline" size="sm">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(semester._id || semester.semesterId)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
