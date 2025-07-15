import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Leaderboard from "./components/Leaderboard"
import History from "./components/History"
import Users from "./components/Users"
import { Menu } from "lucide-react"
import { Toaster } from "sonner"

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "leaderboard":
        return <Leaderboard />
      case "history":
        return <History />
      case "users":
        return <Users />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster richColors/>
   
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">

        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full p-4 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
