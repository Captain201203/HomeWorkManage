"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  GraduationCap, Plus, Pencil, Trash2, ArrowRight, 
  ChevronLeft, ChevronRight, Search, Loader2
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Component dùng chung
import { Sidebar } from "../../components/dasboard/sidebar";

// API Service & Types
import { classService } from "@/app/service/class/service"; 
import { IClass } from "@/app/types/class/type";

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu từ API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // 2. Hàm xử lý xóa lớp học - Sử dụng classId
  const handleDelete = async (classId: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa lớp ${classId}?`)) {
      try {
        await classService.delete(classId); 
        setClasses(prev => prev.filter(c => c.classId !== classId));
        alert("Xóa lớp học thành công!");
      } catch (error: any) {
        alert("Không thể xóa lớp học: " + error.message);
      }
    }
  };

  // 3. Logic lọc tìm kiếm
  const filteredClasses = classes.filter((cls) => {
    const query = searchQuery.toLowerCase();
    return (
      cls.classId?.toLowerCase().includes(query) ||
      cls.majorName?.toLowerCase().includes(query) ||
      cls.teacherName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      {/* Sidebar dùng chung */}
      <Sidebar />

      {/* Main Content - Thêm md:ml-64 để khớp với Sidebar fixed */}
      <main className="flex-1 p-8 md:ml-64">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-600 tracking-tight">Class Management</h1>
            <p className="text-muted-foreground mt-1">Quản lý chuyên ngành và giảng viên phụ trách lớp học.</p>
          </div>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 shadow-md">
            <Link href="/classes/new">
              <Plus className="w-4 h-4 mr-2" /> Create New Class
            </Link>
          </Button>
        </header>

        {/* Search & View Mode */}
        <div className="flex gap-4 mb-6 bg-background p-4 rounded-xl shadow-sm border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm mã lớp, chuyên ngành..." 
              className="pl-10 border-none bg-muted/50 focus-visible:ring-teal-500" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex border rounded-lg overflow-hidden bg-muted/20">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              onClick={() => setViewMode("grid")} 
              className={cn("rounded-none", viewMode === "grid" && "bg-teal-600 hover:bg-teal-700")}
            >
              Grid
            </Button>
            <Button 
              variant={viewMode === "table" ? "default" : "ghost"} 
              onClick={() => setViewMode("table")} 
              className={cn("rounded-none", viewMode === "table" && "bg-teal-600 hover:bg-teal-700")}
            >
              Table
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
            <p className="text-muted-foreground animate-pulse">Đang tải danh sách lớp...</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                  <Card key={cls._id} className="border-none shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">
                          {cls.majorName}
                        </Badge>
                        
                        {/* Nút Action */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/classes/edit/${cls.classId}`}>
                            <Button variant="secondary" size="icon" className="h-8 w-8 hover:text-blue-600 border">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 hover:text-destructive border" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(cls.classId);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-bold text-xl mb-4 group-hover:text-teal-600 transition-colors">
                        {cls.classId}
                      </h3>

                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-dashed">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">
                            {cls.teacherName?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Giảng viên</p>
                          <p className="font-medium text-sm">{cls.teacherName}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex justify-end">
                        <Link href={`/classes/${cls.classId}`} className="text-teal-600 text-sm font-semibold flex items-center gap-1 hover:underline underline-offset-4">
                          Quản lý sinh viên <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-none shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">MÃ LỚP</TableHead>
                      <TableHead className="font-bold">CHUYÊN NGÀNH</TableHead>
                      <TableHead className="font-bold">GIẢNG VIÊN</TableHead>
                      <TableHead className="text-right font-bold">THAO TÁC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls._id} className="hover:bg-muted/20">
                        <TableCell className="font-bold text-teal-700">{cls.classId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{cls.majorName}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{cls.teacherName}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Link href={`/classes/edit/${cls.classId}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8 hover:text-blue-600">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 hover:text-destructive" 
                            onClick={() => handleDelete(cls.classId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
            
            {/* Empty State */}
            {filteredClasses.length === 0 && (
              <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed mt-6">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Không tìm thấy lớp học nào phù hợp.</p>
                <Button variant="link" className="text-teal-600" onClick={() => setSearchQuery("")}>
                  Xóa bộ lọc tìm kiếm
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}