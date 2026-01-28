"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users, GraduationCap, Search, Plus, Grid3X3, List,
  Pencil, Trash2, ChevronLeft, ChevronRight, Mail, Phone, Loader2
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/app/components/dasboard/sidebar";

// API Service & Types
import { teacherService } from "@/app/service/teacher/service";
import { ITeacher } from "@/app/types/teacher/type";

export default function TeachersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Fetch dữ liệu từ API
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 2. Logic Xóa giảng viên (Sử dụng teacherId)
  const handleDelete = async (teacherId: string) => {
    if (confirm(`Bạn có chắc muốn xóa giảng viên có mã ${teacherId}?`)) {
      try {
        await teacherService.delete(teacherId);
        setTeachers((prev) => prev.filter((t) => t.teacherId !== teacherId));
        alert("Xóa giảng viên thành công!");
      } catch (error: any) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  // 3. Logic Tìm kiếm & Phân trang
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "??";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-foreground">
      {/* Sidebar dùng chung */}
      <Sidebar />

      <main className="flex-1 md:ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-600 tracking-tight">Teachers</h1>
            <p className="text-muted-foreground mt-1">Quản lý hồ sơ và thông tin liên lạc của giảng viên.</p>
          </div>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 shadow-md">
            <Link href="/page/teachers/new">
              <Plus className="w-4 h-4 mr-2" /> Add Teacher
            </Link>
          </Button>
        </header>

        {/* Search & Filters */}
        <Card className="mb-6 border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên, mã số hoặc email..."
                  className="pl-10 border-none bg-gray-100 focus-visible:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex border rounded-lg overflow-hidden bg-white">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode("grid")}
                  className={cn("rounded-none", viewMode === "grid" && "bg-teal-600 hover:bg-teal-700")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === "table" ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode("table")}
                  className={cn("rounded-none", viewMode === "table" && "bg-teal-600 hover:bg-teal-700")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
            <p className="text-muted-foreground animate-pulse">Đang tải danh sách giảng viên...</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTeachers.map((teacher) => (
                  <Card key={teacher._id} className="hover:shadow-md transition-all group relative overflow-hidden border-none shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4 border-2 border-teal-50">
                          <AvatarFallback className="bg-teal-50 text-teal-600 text-xl font-bold">
                            {getInitials(teacher.teacherName)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                          {teacher.teacherName}
                        </h3>
                        <p className="text-xs font-mono text-muted-foreground mb-4">{teacher.teacherId}</p>

                        <div className="w-full space-y-2 mb-6 text-sm">
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-teal-600" />
                            <span className="truncate max-w-[200px]">{teacher.teacherEmail}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-teal-600" />
                            <span>{teacher.teacherPhone}</span>
                          </div>
                        </div>

                        <div className="w-full flex gap-2 pt-4 border-t">
                          <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-blue-50 hover:text-blue-600 border-blue-100" asChild>
                            <Link href={`/teachers/edit/${teacher.teacherId}`}>
                              <Pencil className="w-4 h-4" /> Edit
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 gap-2 hover:bg-red-50 hover:text-red-600 border-red-100"
                            onClick={() => handleDelete(teacher.teacherId)}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <Card className="border-none shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="font-bold">MÃ GV</TableHead>
                      <TableHead className="font-bold">HỌ VÀ TÊN</TableHead>
                      <TableHead className="font-bold">EMAIL</TableHead>
                      <TableHead className="font-bold">SỐ ĐIỆN THOẠI</TableHead>
                      <TableHead className="text-right font-bold">THAO TÁC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTeachers.map((teacher) => (
                      <TableRow key={teacher._id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-teal-600">{teacher.teacherId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 border">
                              <AvatarFallback className="bg-teal-50 text-teal-700 text-[10px] font-bold">
                                {getInitials(teacher.teacherName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{teacher.teacherName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.teacherEmail}</TableCell>
                        <TableCell>{teacher.teacherPhone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/teachers/edit/${teacher.teacherId}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(teacher.teacherId)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(currentPage === page && "bg-teal-600 hover:bg-teal-700")}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && filteredTeachers.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed mt-6">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Không tìm thấy giảng viên phù hợp.</p>
            <Button variant="link" className="text-teal-600" onClick={() => setSearchTerm("")}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}