import { useState, useEffect } from "react"
import { Crown, Medal, Award, RefreshCw, Trophy, AlertTriangle, RotateCcw, X } from "lucide-react"
import { toast } from "sonner"

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showResetWarning, setShowResetWarning] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://leaderboard-khp8.onrender.com/api/users/getUser")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error("Failed to fetch leaderboard data")
    } finally {
      setLoading(false)
    }
  }

  const resetAllPoints = async () => {
    setResetLoading(true)
    try {
      const response = await fetch("https://leaderboard-khp8.onrender.com/api/users/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast.success("All points have been reset to zero!")
        fetchUsers()
        setShowResetWarning(false)
      } else {
        toast.error("Failed to reset points")
      }
    } catch (error) {
      toast.error("Failed to reset points")
    } finally {
      setResetLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints)
  const topThree = sortedUsers.slice(0, 3)
  const remainingUsers = sortedUsers.slice(3)

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 3:
        return <Award className="h-8 w-8 text-orange-400" />
      default:
        return null
    }
  }

  const getRankBadge = (rank) => {
    const colors = {
      1: "bg-yellow-500 text-white",
      2: "bg-gray-400 text-white",
      3: "bg-orange-500 text-white",
    }
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${colors[rank]}`}>
        {rank}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Top performers and rankings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowResetWarning(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Points
          </button>
        </div>
      </div>

      {showResetWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900">Reset All Points</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all user points to zero? This action cannot be undone and will permanently
              remove all accumulated points from every user.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetWarning(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetAllPoints}
                disabled={resetLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {resetLoading ? "Resetting..." : "Reset All Points"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Podium - Top 3 Users */}
      {topThree.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-end justify-center gap-8 max-w-4xl mx-auto">
            {topThree[1] && (
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{topThree[1].name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -top-2 -right-2">{getRankBadge(2)}</div>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">{topThree[1].name}</h3>
                  <div className="flex items-center justify-center mb-2">{getRankIcon(2)}</div>
                  <div className="text-gray-600 text-sm mb-1">Earn {topThree[1].totalPoints} points</div>
                  <div className="text-2xl font-bold text-gray-900">{topThree[1].totalPoints.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">Points</div>
                </div>
                <div className="w-24 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
              </div>
            )}

     
            {topThree[0] && (
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="relative mb-3">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center ring-4 ring-yellow-300">
                      <span className="text-white font-bold text-2xl">{topThree[0].name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -top-2 -right-2">{getRankBadge(1)}</div>
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-1">{topThree[0].name}</h3>
                  <div className="flex items-center justify-center mb-2">{getRankIcon(1)}</div>
                  <div className="text-gray-600 text-sm mb-1">Earn {topThree[0].totalPoints} points</div>
                  <div className="text-3xl font-bold text-gray-900">{topThree[0].totalPoints.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">Points</div>
                </div>
                <div className="w-28 h-40 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">1</span>
                </div>
              </div>
            )}

            {topThree[2] && (
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{topThree[2].name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -top-2 -right-2">{getRankBadge(3)}</div>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">{topThree[2].name}</h3>
                  <div className="flex items-center justify-center mb-2">{getRankIcon(3)}</div>
                  <div className="text-gray-600 text-sm mb-1">Earn {topThree[2].totalPoints} points</div>
                  <div className="text-2xl font-bold text-gray-900">{topThree[2].totalPoints.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">Points</div>
                </div>
                <div className="w-24 h-28 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remaining Users Table */}
      {remainingUsers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 text-gray-500 text-sm font-medium bg-gray-50">
            <div>Rank</div>
            <div>Username</div>
            <div>Points</div>
          </div>

          <div className="divide-y divide-gray-200">
            {remainingUsers.map((user, index) => {
              const rank = index + 4
              return (
                <div key={user._id} className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-gray-500 font-bold">#{rank}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{user.name}</span>
                  </div>
                  <div className="text-gray-900 font-medium">{user.totalPoints}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-500">Create some users to see the leaderboard!</p>
        </div>
      )}
    </div>
  )
}
