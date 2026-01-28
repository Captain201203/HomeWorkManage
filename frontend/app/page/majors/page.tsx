"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BookOpen, Plus, Pencil, Trash2, Search, Loader2, Grid3X3, List, ChevronLeft, ChevronRight
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/app/components/dasboard/sidebar";

// Service & Types
import { majorService } from "@/app/service/major/service"; 
import { IMajor } from "@/app/types/major/type";

export default function MajorsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [majors, setMajors] = useState<IMajor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMajors = async () => {
    try {
      setLoading(true);
      const data = await majorService.getAll();
      setMajors(data);
    } catch (error) {
      console.error("Failed to fetch majors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMajors(); }, []);

  const handleDelete = async (majorId: string) => {
    if (confirm(`Xóa chuyên ngành ${majorId}? Hành động này không thể hoàn tác.`)) {
      try {
        await majorService.delete(majorId);
        setMajors(prev => prev.filter(m => m.majorId !== majorId));
        alert("Xóa thành công!");
      } catch (error: any) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  const filteredMajors = majors.filter(m => 
    m.majorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.majorId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-foreground">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-600">Majors</h1>
            <p className="text-muted-foreground">Quản lý danh mục các chuyên ngành đào tạo.</p>
          </div>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 shadow-md">
            <Link href="/page/majors/new"><Plus className="w-4 h-4 mr-2" /> Add Major</Link>
          </Button>
        </header>

        <Card className="mb-6 border-none shadow-sm">
          <CardContent className="pt-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Tìm mã hoặc tên chuyên ngành..." 
                className="pl-10 border-none bg-gray-100" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex border rounded-lg overflow-hidden bg-white">
              <Button variant="ghost" onClick={() => setViewMode("grid")} className={cn("rounded-none", viewMode === "grid" && "bg-teal-600 text-white")}><Grid3X3 className="w-4 h-4" /></Button>
              <Button variant="ghost" onClick={() => setViewMode("table")} className={cn("rounded-none", viewMode === "table" && "bg-teal-600 text-white")}><List className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-teal-600" /></div>
        ) : (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMajors.map((m) => (
                <Card key={m.majorId} className="border-none shadow-sm group hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/page/majors/edit/${m.majorId}`}>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600"><Pencil className="w-3 h-3" /></Button>
                        </Link>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(m.majorId)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-1">{m.majorName}</h3>
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{m.majorId}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">MÃ NGÀNH</TableHead>
                    <TableHead className="font-bold">TÊN CHUYÊN NGÀNH</TableHead>
                    <TableHead className="text-right font-bold">THAO TÁC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMajors.map((m) => (
                    <TableRow key={m.majorId}>
                      <TableCell className="font-mono font-bold text-teal-600">{m.majorId}</TableCell>
                      <TableCell className="font-medium">{m.majorName}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/page/majors/edit/${m.majorId}`}>
                          <Button variant="ghost" size="icon" className="text-blue-600"><Pencil className="w-4 h-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(m.majorId)}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )
        )}
      </main>
    </div>
  );
}