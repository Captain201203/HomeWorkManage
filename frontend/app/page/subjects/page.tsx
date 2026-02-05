"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { subjectService } from "../../service/subject/service"
import { ISubject } from "../../types/subject/type"

import { Sidebar } from "../../components/dasboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2, Loader2, BookMarked } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SubjectListPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const data = await subjectService.getAll()
      setSubjects(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách môn học:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleDelete = async (subjectId: string) => {
    if (confirm(`Bạn có chắc muốn xóa môn học mã ${subjectId}?`)) {
      try {
        await subjectService.delete(subjectId)
        setSubjects(prev => prev.filter(s => s.subjectId !== subjectId))
        alert("Xóa thành công!")
      } catch (error: any) {
        alert("Lỗi: " + error.message)
      }
    }
  }

  const filteredSubjects = subjects.filter(s =>
    s.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subjectId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.majorName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quản Lý Môn Học</h1>
              <p className="text-muted-foreground">Tổng số: {subjects.length} môn học</p>
            </div>
            <Link href="/page/subjects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm Môn Học
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, tên môn hoặc ngành..."
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
          ) : filteredSubjects.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <BookMarked className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không có môn học nào</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã Môn</TableHead>
                        <TableHead>Tên Môn</TableHead>
                        <TableHead>Ngành</TableHead>
                        <TableHead className="text-right">Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubjects.map((subject) => (
                        <TableRow key={subject._id || subject.subjectId}>
                          <TableCell>
                            <Badge variant="outline">{subject.subjectId}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{subject.subjectName}</TableCell>
                          <TableCell>{subject.majorName || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/page/subjects/edit/${subject._id || subject.subjectId}`}>
                                <Button variant="outline" size="sm">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(subject._id || subject.subjectId)}
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
