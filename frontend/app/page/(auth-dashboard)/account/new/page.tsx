"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { accountService } from "@/app/service/account/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function NewAccountPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // Mặc định là student, có thể sửa bằng TextField
    accountId: ""
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Bây giờ formData đã có đủ email và username nên sẽ không còn lỗi
      await accountService.create(formData)
      router.push("/page/account")
    } catch (err) {
      alert("Lỗi khi tạo tài khoản: Đảm bảo MSSV/Email không bị trùng")
    }
  }

  return (
    <div className="p-10 flex justify-center bg-slate-50 min-h-screen">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="border-b mb-4">
          <CardTitle className="text-teal-700">TẠO TÀI KHOẢN MỚI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input required value={formData.username} placeholder="vuan01" onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input required type="email" value={formData.email} placeholder="vuan@gmail.com" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Mã định danh (MSSV/GV ID)</Label>
              <Input required value={formData.accountId} placeholder="2280600161" onChange={e => setFormData({...formData, accountId: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Vai trò (Role)</Label>
              <Input required value={formData.role} placeholder="admin, teacher, hoặc student" onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>

            <div className="flex gap-4 pt-4">
               <Button type="button" variant="outline" className="w-1/2" onClick={() => router.back()}>Hủy</Button>
               <Button type="submit" className="w-1/2 bg-teal-600">Lưu tài khoản</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}