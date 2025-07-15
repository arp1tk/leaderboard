import { useState, useEffect } from "react"
import { Users, Trophy, History, TrendingUp, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    topUser: null,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      // Fetch users
      const usersResponse = await fetch("http://localhost:5000/api/users/getUser")
      const usersData = await usersResponse.json()

      // Fetch history
      const historyResponse = await fetch("http://localhost:5000/api/users/getHistory")
      const historyData = await historyResponse.json()

      const users = usersData.users || []
      const history = historyData.history || []

      const topUser =
        users.length > 0
          ? users.reduce((prev, current) => (prev.totalPoints > current.totalPoints ? prev : current))
          : null

      setStats({
        totalUsers: users.length,
        totalClaims: history.length,
        topUser,
        recentActivity: history.slice(0, 5),
      })
    } catch (error) {
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Claims",
      value: stats.totalClaims,
      icon: History,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Top Player",
      value: stats.topUser?.name || "None",
      icon: Trophy,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Highest Score",
      value: stats.topUser?.totalPoints || 0,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your points system</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-gray-900 text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            stats.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{activity.userId.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{activity.userId.name}</p>
                    <p className="text-gray-500 text-sm">{new Date(activity.claimedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-green-600 font-bold">+{activity.pointsClaimed}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
