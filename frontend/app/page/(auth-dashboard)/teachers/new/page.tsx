"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sidebar } from "@/app/components/dasboard/sidebar"; // Đảm bảo đúng đường dẫn

// API Service & Types
import { teacherService } from "@/app/service/teacher/service";
import { ITeacher } from "@/app/types/teacher/type";
import { cn } from "@/lib/utils";

export default function NewTeacherPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Khởi tạo form trống, mã ID sẽ do Backend tạo hoặc nhập tay tùy logic của bạn
  const [formData, setFormData] = useState<Omit<ITeacher, "_id">>({
    teacherId: "",
    teacherName: "",
    teacherEmail: "",
    teacherPhone: "",
  });

  // 1. Logic Kiểm tra Form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.teacherId.trim()) {
        newErrors.teacherId = "Mã giảng viên là bắt buộc";
    }
    if (!formData.teacherName.trim()) {
      newErrors.teacherName = "Tên giảng viên là bắt buộc";
    }
    if (!formData.teacherEmail.trim()) {
      newErrors.teacherEmail = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail)) {
      newErrors.teacherEmail = "Email không đúng định dạng";
    }
    if (!formData.teacherPhone.trim()) {
      newErrors.teacherPhone = "Số điện thoại là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 2. Xử lý Gửi dữ liệu (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await teacherService.create(formData);
      alert("Thêm giảng viên mới thành công!");
      router.push("/page/teachers");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating teacher:", error);
      setErrors({ submit: error.message || "Lỗi khi tạo giảng viên. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar dùng chung */}
      <Sidebar />

      <main className="flex-1 md:ml-64">
        {/* Sticky Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/teachers" className="hover:text-teal-600 transition-colors">Giảng viên</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Thêm giảng viên mới</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Teacher</h1>
            <p className="text-muted-foreground mt-1">Đăng ký tài khoản và hồ sơ giảng viên vào hệ thống quản lý.</p>
          </div>
        </header>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            {errors.submit && (
              <Alert variant="destructive" className="shadow-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg text-teal-700">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teacherId" className="font-semibold">
                      Mã giảng viên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teacherId"
                      placeholder="VD: GV202601"
                      value={formData.teacherId}
                      onChange={(e) => handleChange("teacherId", e.target.value)}
                      className={cn("focus-visible:ring-teal-500", errors.teacherId && "border-red-500")}
                      disabled={isLoading}
                    />
                    {errors.teacherId && <p className="text-red-500 text-xs mt-1">{errors.teacherId}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherName" className="font-semibold">
                      Họ và Tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teacherName"
                      placeholder="VD: TS. Nguyễn Văn A"
                      value={formData.teacherName}
                      onChange={(e) => handleChange("teacherName", e.target.value)}
                      className={cn("focus-visible:ring-teal-500", errors.teacherName && "border-red-500")}
                      disabled={isLoading}
                    />
                    {errors.teacherName && <p className="text-red-500 text-xs mt-1">{errors.teacherName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg text-teal-700">Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail" className="font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" /> Email chính thức <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    placeholder="tengv@school.edu.vn"
                    value={formData.teacherEmail}
                    onChange={(e) => handleChange("teacherEmail", e.target.value)}
                    className={cn("focus-visible:ring-teal-500", errors.teacherEmail && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.teacherEmail && <p className="text-red-500 text-xs mt-1">{errors.teacherEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherPhone" className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" /> Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="teacherPhone"
                    type="tel"
                    placeholder="09xx xxx xxx"
                    value={formData.teacherPhone}
                    onChange={(e) => handleChange("teacherPhone", e.target.value)}
                    className={cn("focus-visible:ring-teal-500", errors.teacherPhone && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.teacherPhone && <p className="text-red-500 text-xs mt-1">{errors.teacherPhone}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" /> Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700 min-w-[160px] shadow-lg shadow-teal-600/20 gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo...</>
                ) : (
                  <><Save className="w-4 h-4" /> Lưu giảng viên</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}