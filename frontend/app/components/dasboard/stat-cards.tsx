import { Card } from "@/components/ui/card"
import { Users, CalendarCheck, UserPlus, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "TOTAL STUDENTS",
    value: "1,240",
    change: "+5%",
    subtitle: "Updated 10 mins ago",
    icon: Users,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    changeColor: "text-teal-600",
  },
  {
    title: "ACTIVE CLASSES",
    value: "48",
    status: "Ongoing",
    subtitle: "6 ending in next hour",
    icon: CalendarCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    statusColor: "text-amber-600",
  },
  {
    title: "NEW ENROLLMENTS",
    value: "24",
    change: "+12%",
    subtitle: "Since last Monday",
    icon: UserPlus,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    changeColor: "text-teal-600",
  },
]

export function StatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium tracking-wider text-muted-foreground">
              {stat.title}
            </p>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {stat.value}
              </span>
              {stat.change && (
                <span className={`flex items-center text-sm font-medium ${stat.changeColor}`}>
                  <TrendingUp className="mr-0.5 h-3 w-3" />
                  {stat.change}
                </span>
              )}
              {stat.status && (
                <span className={`text-sm font-medium ${stat.statusColor}`}>
                  {stat.status}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-teal-600">{stat.subtitle}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
