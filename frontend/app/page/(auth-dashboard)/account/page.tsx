"use client"

import { useEffect, useState } from "react"
import { accountService } from "@/app/service/account/service"
import { IAccount } from "@/app/types/account/type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AccountListPage() {
  const [accounts, setAccounts] = useState<IAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAll()
      setAccounts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      await accountService.delete(id)
      loadAccounts()
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-700">DANH SÁCH TÀI KHOẢN</h1>
        <Link href="/page/account/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" /> Thêm tài khoản
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò (Role)</TableHead>
              <TableHead>Mã định danh (ID)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.accountId}>
                <TableCell className="font-medium">{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                   <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 uppercase">
                    {account.role}
                   </span>
                </TableCell>
                <TableCell>{account.accountId}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/page/account/edit/${account.accountId}`}>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(account.accountId)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}