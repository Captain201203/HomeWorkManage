"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutGrid, Users, GraduationCap, Building2, Settings,
  ChevronRight, Save, ArrowLeft, Loader2
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Service & Types
import { classService } from "@/app/service/class/service"; 
import { IClass } from "@/app/types/class/type";
import { teacherService } from "@/app/service/teacher/service";
import { ITeacher } from "@/app/types/teacher/type";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/", active: false },
  { icon: GraduationCap, label: "Classes", href: "/classes", active: true },
  { icon: Users, label: "Students", href: "/students", active: false },
  { icon: Users, label: "Teachers", href: "/teachers", active: false },
];

export default function ClassFormPage() {
  const router = useRouter();
  const params = useParams(); // Lấy ID nếu là trang Edit (ví dụ: /classes/edit/[id])
  const classIdParam = params?.id as string;


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Khởi tạo formData theo đúng IClass type
  const [formData, setFormData] = useState<IClass>({
    classId: "",
    majorName: "",
    teacherName: "",
  });

  // 1. Nếu có ID, fetch dữ liệu cũ về để sửa (Edit Mode)
  useEffect(() => {
    if (classIdParam) {
      const fetchDetail = async () => {
        try {
          setLoadingData(true);
          const data = await classService.getById(classIdParam);
          setFormData(data);
        } catch (error) {
          alert("Không thể tải thông tin lớp học.");
        } finally {
          setLoadingData(false);
        }
      };
      fetchDetail();
    }
  }, [classIdParam]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const data = await teacherService.getAll();
        setTeachers(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giảng viên:", error);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (field: keyof IClass, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (classIdParam) {
        // Chế độ Cập nhật
        await classService.update(classIdParam, formData);
        alert("Cập nhật lớp học thành công!");
      } else {
        // Chế độ Thêm mới
        await classService.create(formData);
        alert("Tạo lớp học mới thành công!");
      }
      router.push("/classes");
      router.refresh();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-foreground">
      {/* Sidebar - Giữ nguyên */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold">EduAdmin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          {sidebarItems.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 ${item.active ? "bg-teal-50 text-teal-600" : "hover:bg-gray-100"}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <Link href="/classes">Classes</Link>
          <ChevronRight className="w-4 h-4" />
          <span>{classIdParam ? "Edit Class" : "Create New Class"}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{classIdParam ? "Sửa thông tin lớp" : "Tạo lớp học mới"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin lớp học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classId">Mã lớp học (ID) <span className="text-red-500">*</span></Label>
                    <Input
                      id="classId"
                      placeholder="VD: DTH21-01"
                      value={formData.classId}
                      onChange={(e) => handleChange("classId", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="majorName">Chuyên ngành <span className="text-red-500">*</span></Label>
                    <Input
                      id="majorName"
                      placeholder="VD: Kỹ thuật phần mềm"
                      value={formData.majorName}
                      onChange={(e) => handleChange("majorName", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

        <div className="space-y-2">
            <Label htmlFor="teacherName" className="text-sm font-semibold">
                Giảng viên hướng dẫn <span className="text-red-500">*</span>
            </Label>
            <Select
                value={formData.teacherName}
                onValueChange={(value) => handleChange("teacherName", value)}
                disabled={isSubmitting || loadingTeachers}
            >
                <SelectTrigger className="focus:ring-teal-500">
                <SelectValue placeholder={loadingTeachers ? "Đang tải giảng viên..." : "Chọn giảng viên phụ trách"} />
                </SelectTrigger>
                <SelectContent>
                {/* 2. Render danh sách giảng viên động từ API */}
                {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher.teacherName}>
                        {teacher.teacherName}
                    </SelectItem>
                    ))
                ) : (
                    <SelectItem disabled value="none">
                    {loadingTeachers ? "Đang tải..." : "Không có dữ liệu giảng viên"}
                    </SelectItem>
                )}
                </SelectContent>
            </Select>
            </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">(*) Bắt buộc điền thông tin</p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : <><Save className="mr-2 h-4 w-4" /> Lưu dữ liệu</>}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}