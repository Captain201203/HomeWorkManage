"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronRight,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sidebar } from "@/app/components/dasboard/sidebar";

// API Service & Types
import { teacherService } from "@/app/service/teacher/service"; 
import { ITeacher } from "@/app/types/teacher/type";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherIdParam = params.id as string; // Đây là teacherId từ URL

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Omit<ITeacher, "_id">>({
    teacherId: "",
    teacherName: "",
    teacherEmail: "",
    teacherPhone: "",
  });

  // 1. Fetch dữ liệu giảng viên khi load trang
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherIdParam) return;
      
      try {
        setIsLoadingData(true);
        const response = await teacherService.getById(teacherIdParam);
        
        setFormData({
          teacherId: response.teacherId || "",
          teacherName: response.teacherName || "",
          teacherEmail: response.teacherEmail || "",
          teacherPhone: response.teacherPhone || "",
        });
      } catch (error: any) {
        console.error("Error fetching teacher:", error);
        setErrors({ submit: "Không thể tải dữ liệu giảng viên. Vui lòng thử lại." });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTeacher();
  }, [teacherIdParam]);

  // 2. Validate Form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.teacherName.trim()) {
      newErrors.teacherName = "Tên giảng viên là bắt buộc";
    }

    if (!formData.teacherEmail.trim()) {
      newErrors.teacherEmail = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail)) {
      newErrors.teacherEmail = "Định dạng email không hợp lệ";
    }

    if (!formData.teacherPhone.trim()) {
      newErrors.teacherPhone = "Số điện thoại là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 3. Xử lý Cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await teacherService.update(teacherIdParam, formData);
      alert("Cập nhật thông tin giảng viên thành công!");
      router.push("/teachers");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      setErrors({ submit: error.message || "Lỗi khi cập nhật thông tin giảng viên." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            <p className="text-muted-foreground">Đang tải dữ liệu giảng viên...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/teachers" className="hover:text-teal-600 transition-colors">Giảng viên</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Chỉnh sửa hồ sơ</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 font-tight">
              Edit Profile: <span className="text-teal-600">{formData.teacherName}</span>
            </h1>
          </div>
        </header>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teacherId" className="font-semibold text-gray-700">Mã giảng viên</Label>
                    <Input
                      id="teacherId"
                      value={formData.teacherId}
                      disabled
                      className="bg-gray-100 border-none select-none"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Mã giảng viên không thể thay đổi</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherName" className="font-semibold text-gray-700">
                      Họ và Tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teacherName"
                      placeholder="VD: TS. Nguyễn Văn A"
                      value={formData.teacherName}
                      onChange={(e) => handleChange("teacherName", e.target.value)}
                      className={cn("focus-visible:ring-teal-500", errors.teacherName && "border-red-500")}
                    />
                    {errors.teacherName && <p className="text-red-500 text-xs mt-1">{errors.teacherName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail" className="font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" /> Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    placeholder="name@school.edu.vn"
                    value={formData.teacherEmail}
                    onChange={(e) => handleChange("teacherEmail", e.target.value)}
                    className={cn("focus-visible:ring-teal-500", errors.teacherEmail && "border-red-500")}
                  />
                  {errors.teacherEmail && <p className="text-red-500 text-xs mt-1">{errors.teacherEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherPhone" className="font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" /> Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="teacherPhone"
                    type="tel"
                    placeholder="09xx xxx xxx"
                    value={formData.teacherPhone}
                    onChange={(e) => handleChange("teacherPhone", e.target.value)}
                    className={cn("focus-visible:ring-teal-500", errors.teacherPhone && "border-red-500")}
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
                className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2 min-w-[140px] shadow-lg shadow-teal-600/20"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang cập nhật...</>
                ) : (
                  <><Save className="w-4 h-4" /> Lưu thay đổi</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}