import { useState, useEffect } from "react"
import { HistoryIcon, Calendar, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://leaderboard-khp8.onrender.com/api/users/getHistory")
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      toast.error("Failed to fetch history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const groupHistoryByDate = (history) => {
    const grouped = {}
    history.forEach((item) => {
      const date = new Date(item.claimedAt).toDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item)
    })
    return grouped
  }

  const groupedHistory = groupHistoryByDate(history)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Points History</h1>
          <p className="text-gray-600 mt-1">Track all point claiming activities</p>
        </div>
        <button
          onClick={fetchHistory}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <HistoryIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
          <p className="text-gray-500">Start claiming points to see activity here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{date}</h2>
                  <p className="text-gray-500 text-sm">{items.length} claims made</p>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((claim) => (
                  <div key={claim._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {claim.userId.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-medium">{claim.userId.name}</h3>
                        <p className="text-gray-500 text-sm">{new Date(claim.claimedAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">+{claim.pointsClaimed}</div>
                      <div className="text-gray-500 text-sm">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
