import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type ActivityStatus = "pending" | "completed"

interface Activity {
  id: number
  title: string
  description: string
  user: string
  userInitials: string
  time: string
  status: ActivityStatus
}

const activities: Activity[] = [
  {
    id: 1,
    title: "New Student Registered",
    description: "Profile verification pending",
    user: "Marcus Chen",
    userInitials: "MC",
    time: "2 mins ago",
    status: "pending",
  },
  {
    id: 2,
    title: "Grade Report Released",
    description: "Section A - Mathematics",
    user: "Sarah Miller",
    userInitials: "SM",
    time: "45 mins ago",
    status: "completed",
  },
  {
    id: 3,
    title: "Class Rescheduled",
    description: "History 101 moved to Hall B",
    user: "Admin System",
    userInitials: "AS",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    title: "Payment Processed",
    description: "Tuition fee - Invoice #8821",
    user: "Liam Wilson",
    userInitials: "LW",
    time: "3 hours ago",
    status: "completed",
  },
]

const statusStyles: Record<ActivityStatus, string> = {
  pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  completed: "bg-teal-100 text-teal-700 hover:bg-teal-100",
}

export function RecentActivity() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Link
          href="/activity"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          View All
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Activity
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Time
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="py-4">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-teal-600">
                      {activity.description}
                    </p>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={activity.user} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {activity.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{activity.user}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm text-teal-600">{activity.time}</span>
                </td>
                <td className="py-4">
                  <Badge
                    className={`rounded-full uppercase ${statusStyles[activity.status]}`}
                  >
                    {activity.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
