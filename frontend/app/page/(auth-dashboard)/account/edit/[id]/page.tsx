"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { accountService } from "@/app/service/account/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function EditAccountPage() {
  const params = useParams()
  const accountId = params.id as string
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchAccount = async () => {
      const data = await accountService.getById(accountId)
      setUsername(data.username)
      setRole(data.role)
    }
    fetchAccount()
  }, [accountId])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await accountService.update(accountId, { username, role: role as any })
      router.push("/page/account")
    } catch (err) {
      alert("Cập nhật thất bại")
    }
  }

  return (
    <div className="p-10 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>Chỉnh sửa tài khoản: {accountId}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Username (Email)</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Vai trò (Hiện tại: {role})</Label>
              <Input disabled value={role} />
              <p className="text-xs text-muted-foreground italic">* Vai trò không nên thay đổi để tránh lỗi phân quyền hệ thống</p>
            </div>
            <Button type="submit" className="w-full bg-blue-600">Cập nhật thông tin</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}