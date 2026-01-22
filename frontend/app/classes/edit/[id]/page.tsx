"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutGrid, Users, GraduationCap, 
  ChevronRight, Save, Loader2
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

export default function ClassFormPage() {
  const router = useRouter();
  const params = useParams(); 
  // classIdParam này chính là _id trong MongoDB mà bạn truyền qua URL
  const classIdParam = params?.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [formData, setFormData] = useState<IClass>({
    classId: "",
    majorName: "",
    teacherName: "",
  });

  // 1. Logic Fill dữ liệu khi Load Form
  useEffect(() => {
    if (classIdParam) {
      const fetchDetail = async () => {
        try {
          setLoadingData(true);
          // Gọi API lấy chi tiết theo ID
          const data = await classService.getById(classIdParam);
          
          if (data) {
            setFormData({
              classId: data.classId || "",
              majorName: data.majorName || "",
              teacherName: data.teacherName || "",
            });
          }
        } catch (error) {
          console.error("Error fetching class detail:", error);
          alert("Không thể tải thông tin lớp học để chỉnh sửa.");
        } finally {
          setLoadingData(false);
        }
      };
      fetchDetail();
    }
  }, [classIdParam]);

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

  // Hiển thị vòng xoay khi đang đợi dữ liệu đổ vào form
  if (loadingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-teal-600 w-12 h-12" />
          <p className="text-sm font-medium text-gray-500">Đang tải dữ liệu lớp học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-foreground">
      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <Link href="/classes" className="hover:text-teal-600 transition-colors">Lớp học</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">
            {classIdParam ? "Sửa lớp học" : "Thêm lớp học mới"}
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {classIdParam ? `Chỉnh sửa lớp: ${formData.classId}` : "Tạo lớp học mới"}
          </h1>
          <p className="text-gray-500 mt-1">
            {classIdParam ? "Cập nhật lại thông tin chuyên ngành và giảng viên." : "Thiết lập lớp học mới vào hệ thống."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b bg-white/50">
                <CardTitle className="text-lg font-semibold text-teal-700">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="classId" className="text-sm font-semibold">Mã lớp học <span className="text-red-500">*</span></Label>
                    <Input
                      id="classId"
                      placeholder="VD: DTH21-01"
                      value={formData.classId} // Liên kết giá trị để fill dữ liệu
                      onChange={(e) => handleChange("classId", e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="focus-visible:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="majorName" className="text-sm font-semibold">Chuyên ngành <span className="text-red-500">*</span></Label>
                    <Input
                      id="majorName"
                      placeholder="VD: Kỹ thuật phần mềm"
                      value={formData.majorName} // Liên kết giá trị để fill dữ liệu
                      onChange={(e) => handleChange("majorName", e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="focus-visible:ring-teal-500"
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

          {/* Form Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground italic">
              (*) Vui lòng điền đầy đủ các thông tin bắt buộc.
            </p>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()} 
                disabled={isSubmitting}
                className="hover:bg-gray-100"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 min-w-[160px] shadow-lg shadow-teal-600/20" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> {classIdParam ? "Cập nhật lớp" : "Lưu lớp học"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}