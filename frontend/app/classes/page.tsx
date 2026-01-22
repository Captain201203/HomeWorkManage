"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutGrid, Users, GraduationCap, Building2, Settings, Search, Plus,
  Grid3X3, List, Pencil, Trash2, ArrowRight, ChevronLeft, ChevronRight, X, Loader2
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// API Service & Types
import { classService } from "@/app/service/class/service"; // Đảm bảo đúng đường dẫn file của bạn
import { IClass } from "@/app/types/class/type";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/", active: false },
  { icon: GraduationCap, label: "Classes", href: "/classes", active: true },
  { icon: Users, label: "Students", href: "/students", active: false },
  { icon: Users, label: "Teachers", href: "/teachers", active: false },
];

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu từ API khi component mount
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

  // 2. Hàm xử lý xóa lớp học
    const handleDelete = async (classId: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa lớp ${classId}?`)) {
        try {
        // Gọi service với đúng biến classId
        await classService.delete(classId); 
        
        // Cập nhật state để mất dòng đó trên giao diện
        setClasses(classes.filter(c => c.classId !== classId));
        alert("Xóa lớp học thành công!");
        } catch (error: any) {
        console.error(error);
        alert("Không thể xóa lớp học: " + error.message);
        }
    }
    };

  // 3. Logic lọc tìm kiếm
  const filteredClasses = classes.filter((cls) => {
    const query = searchQuery.toLowerCase();
    return (
      cls.classId.toLowerCase().includes(query) ||
      cls.majorName.toLowerCase().includes(query) ||
      cls.teacherName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50 text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 border-b">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-gray-900">EduAdmin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.label} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all", item.active ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:bg-gray-100")}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Class Management</h1>
            <p className="text-muted-foreground">Quản lý chuyên ngành và giảng viên hướng dẫn.</p>
          </div>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/classes/new"><Plus className="w-4 h-4 mr-2" /> Create New Class</Link>
          </Button>
        </header>

        {/* Search & View Mode */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by ID, Major or Teacher..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex border rounded-lg overflow-hidden bg-white">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-teal-600" : ""}>Grid</Button>
            <Button variant={viewMode === "table" ? "default" : "ghost"} onClick={() => setViewMode("table")} className={viewMode === "table" ? "bg-teal-600" : ""}>Table</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-teal-600" /></div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                  <Card key={cls._id} className="hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">{cls.majorName}</Badge>
                        <div className="flex gap-1">
                            <Link href={`/classes/edit/${cls.classId}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                                
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => {e.preventDefault(); handleDelete(cls.classId);;}} ><Trash2 className="w-4 h-4" /> </Button> 

                           
                                
                           
 
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-1 text-gray-900">{cls.classId}</h3>
                      <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback className="bg-teal-100 text-teal-700">{cls.teacherName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Giảng viên</p>
                          <p className="font-medium text-sm">{cls.teacherName}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/classes/${cls.classId}`} className="text-teal-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                          Chi tiết <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MÃ LỚP</TableHead>
                      <TableHead>CHUYÊN NGÀNH</TableHead>
                      <TableHead>GIẢNG VIÊN</TableHead>
                      <TableHead className="text-right">THAO TÁC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="font-bold text-teal-700">{cls.classId}</TableCell>
                        <TableCell><Badge variant="secondary">{cls.majorName}</Badge></TableCell>
                        <TableCell>{cls.teacherName}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cls._id!)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Helper function để gộp class
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}