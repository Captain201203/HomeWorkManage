// src/app/page/dashboard/layout.tsx
import { Sidebar } from "@/app/components/dasboard/sidebar"
import { Header } from "@/app/components/dasboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar tự động phân quyền theo role */}
      <Sidebar /> 
      
      <div className="flex flex-1 flex-col">
        {/* Header chứa các công cụ và nút Logout */}
        <Header />
        
        {/* Nội dung thay đổi theo từng Page (Dashboard, Accounts, Students...) */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}