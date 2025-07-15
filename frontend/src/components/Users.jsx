import { useState, useEffect } from "react"
import { Plus, Zap, User, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function Users() {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [loading, setLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://leaderboard-khp8.onrender.com/api/users/getUser")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error("Failed to fetch users")
    }
  }

  const createUser = async () => {
    if (!newUserName.trim()) {
      toast.error("Please enter a user name")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://leaderboard-khp8.onrender.com/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newUserName }),
      })

      if (response.ok) {
        toast.success("User created successfully!")
        setNewUserName("")
        fetchUsers()
      } else {
        toast.error("Failed to create user")
      }
    } catch (error) {
      toast.error("Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const claimPoints = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user first")
      return
    }

    setClaimLoading(true)
    try {
      const response = await fetch("https://leaderboard-khp8.onrender.com/api/users/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`🎉 Claimed ${data.points} points! Total: ${data.updatedPoints}`)
        fetchUsers()
      } else {
        toast.error("Failed to claim points")
      }
    } catch (error) {
      toast.error("Failed to claim points")
    } finally {
      setClaimLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and claim points</p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New User */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">User Name</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createUser()}
                placeholder="Enter user name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={createUser}
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>

        {/* Claim Points */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Claim Points</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Select User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.totalPoints} pts)
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={claimPoints}
              disabled={claimLoading || !selectedUserId}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 transition-colors"
            >
              {claimLoading ? "Claiming..." : "🎲 Claim Random Points"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Users</h2>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users yet. Create your first user!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user._id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.totalPoints} points</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
