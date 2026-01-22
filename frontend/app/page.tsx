import { Sidebar } from "../app/components/dasboard/sidebar"
import { Header } from "../app/components/dasboard/header"
import { StatCards } from "../app/components/dasboard/stat-cards"
import { RecentActivity } from "../app/components/dasboard/recent-activity"
import { Footer } from "../app/components/dasboard/footer"

export default function DashboardPage() {
  // Get current hour to determine greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 px-8 py-6">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, Alex
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here is what's happening in your school today.
            </p>
          </div>

          {/* Stats Cards */}
          <StatCards />

          {/* Recent Activity */}
          <div className="mt-8">
            <RecentActivity />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
