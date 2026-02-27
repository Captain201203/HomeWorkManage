// src/app/components/dashboard/header.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Header() {
  const router = useRouter()

  const handleLogout = () => {
    // 1. Xóa toàn bộ dữ liệu phiên làm việc
    localStorage.removeItem("token")
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_username")
    localStorage.removeItem("student_session") // Dành cho role student

    localStorage.clear();

    // 2. (Tùy chọn) Xóa cookie nếu bạn có sử dụng middleware server-side
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    window.location.href = "/page/login";

    // 3. Điều hướng về trang login ngay lập tức
    router.push("/page/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-8 shadow-sm">
      {/* Thanh tìm kiếm giả định - tăng tính chuyên nghiệp */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Tìm kiếm nhanh..." 
          className="pl-10 bg-muted/50 border-none focus-visible:ring-teal-600"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="h-6 w-px bg-border mx-2" />

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-all shadow-sm"
        >
          <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
          Đăng xuất
        </Button>
      </div>
    </header>
  )
}