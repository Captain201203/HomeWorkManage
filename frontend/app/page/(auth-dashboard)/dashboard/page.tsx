// src/app/page/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../../../components/dasboard/sidebar"
import { Header } from "../../../components/dasboard/header"
import { StatCards } from "../../../components/dasboard/stat-cards"
import { RecentActivity } from "../../../components/dasboard/recent-activity"
import { Footer } from "../../../components/dasboard/footer"

export default function DashboardPage() {
  const [username, setUsername] = useState("User")

  useEffect(() => {
    // Lấy tên người dùng hoặc email từ session đã lưu khi login
    const storedUser = localStorage.getItem("user_username") 
    if (storedUser) {
      // Tách lấy phần tên trước @ nếu là email
      setUsername(storedUser.split('@')[0])
    }
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      
      <div className="flex flex-1 flex-col">
        
        <main className="flex-1 px-8 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground capitalize">
              {getGreeting()}, {username}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Đây là những gì đang diễn ra trong hệ thống của bạn hôm nay.
            </p>
          </div>
          <StatCards />
          <div className="mt-8">
            <RecentActivity />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}