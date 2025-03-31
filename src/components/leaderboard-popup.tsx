"use client"

import { useState } from "react"
import { Trophy, X, ChevronUp, Users, Medal } from "lucide-react"

interface LeaderboardEntry {
  id: number
  name: string
  avatar: string
  points: number
  rank: number
  change: 'up' | 'down' | 'same'
}

export function LeaderboardPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'friends' | 'global'>('friends')
  
  // Mock leaderboard data
  const friendsLeaderboardData: LeaderboardEntry[] = [
    { id: 1, name: "Sarah J.", avatar: "S", points: 2840, rank: 1, change: 'same' },
    { id: 2, name: "David P.", avatar: "D", points: 2710, rank: 2, change: 'up' },
    { id: 3, name: "Alex B.", avatar: "A", points: 2480, rank: 3, change: 'down' },
    { id: 4, name: "Emma R.", avatar: "E", points: 2350, rank: 4, change: 'up' },
    { id: 5, name: "Michael K.", avatar: "M", points: 2240, rank: 5, change: 'same' },
    { id: 6, name: "You", avatar: "Y", points: 2120, rank: 6, change: 'up' },
    { id: 7, name: "Thomas W.", avatar: "T", points: 2050, rank: 7, change: 'down' },
    { id: 8, name: "Lisa M.", avatar: "L", points: 1980, rank: 8, change: 'same' },
  ]
  
  // Mock global leaderboard data
  const globalLeaderboardData: LeaderboardEntry[] = [
    { id: 1, name: "John D.", avatar: "J", points: 4250, rank: 1, change: 'same' },
    { id: 2, name: "Maria S.", avatar: "M", points: 4120, rank: 2, change: 'up' },
    { id: 3, name: "Robert T.", avatar: "R", points: 3980, rank: 3, change: 'same' },
    { id: 4, name: "Jessica L.", avatar: "J", points: 3850, rank: 4, change: 'down' },
    { id: 5, name: "James B.", avatar: "J", points: 3720, rank: 5, change: 'up' },
    { id: 6, name: "Claire W.", avatar: "C", points: 3610, rank: 6, change: 'up' },
    { id: 7, name: "You", avatar: "Y", points: 2120, rank: 156, change: 'down' },
    { id: 8, name: "Eric M.", avatar: "E", points: 3520, rank: 7, change: 'same' },
    { id: 9, name: "Sophia K.", avatar: "S", points: 3480, rank: 8, change: 'down' },
    { id: 10, name: "Daniel P.", avatar: "D", points: 3420, rank: 9, change: 'up' },
  ]
  
  // Get current data based on active tab
  const currentLeaderboardData = activeTab === 'friends' 
    ? friendsLeaderboardData 
    : globalLeaderboardData.filter(entry => entry.name !== "You").slice(0, 8).concat(
        globalLeaderboardData.filter(entry => entry.name === "You")
      )
  
  const toggleLeaderboard = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }
  
  const minimizeLeaderboard = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
  }
  
  const closeLeaderboard = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    setIsMinimized(false)
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Minimized state */}
      {isMinimized && (
        <div 
          className="flex items-center bg-white dark:bg-black shadow-lg rounded-full h-12 pl-4 pr-2 cursor-pointer border border-slate-200 dark:border-slate-800"
          onClick={() => setIsMinimized(false)}
        >
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">Leaderboard</span>
          <span className="text-xs bg-black dark:bg-white text-white dark:text-black rounded-full h-5 w-5 flex items-center justify-center">
            {currentLeaderboardData.length}
          </span>
        </div>
      )}
      
      {/* Button to toggle leaderboard */}
      {!isMinimized && (
        <button 
          className={`rounded-full bg-black dark:bg-white shadow-lg p-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          onClick={toggleLeaderboard}
          aria-label={isOpen ? "Close leaderboard" : "Open leaderboard"}
        >
          <Trophy className="h-6 w-6 text-white dark:text-black" />
        </button>
      )}
      
      {/* Leaderboard Panel */}
      {isOpen && !isMinimized && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-black rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-slate-900 dark:text-white">Leaderboard</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={minimizeLeaderboard}
                aria-label="Minimize leaderboard"
              >
                <ChevronUp size={18} />
              </button>
              <button 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={closeLeaderboard}
                aria-label="Close leaderboard"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Leaderboard Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button 
              className={`flex-1 py-2 px-4 text-sm ${
                activeTab === 'friends' 
                  ? "font-medium text-slate-900 dark:text-white border-b-2 border-black dark:border-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-sm ${
                activeTab === 'global' 
                  ? "font-medium text-slate-900 dark:text-white border-b-2 border-black dark:border-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab('global')}
            >
              Global
            </button>
          </div>
          
          {/* Leaderboard List */}
          <div className="max-h-80 overflow-y-auto p-2 leaderboard-scroll">
            {currentLeaderboardData.map(entry => (
              <div 
                key={entry.id} 
                className={`flex items-center p-2 rounded-lg mb-1 ${
                  entry.name === "You" 
                    ? "bg-slate-100 dark:bg-slate-800" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <div className="w-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                  {entry.rank}
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 ml-2">
                  {entry.avatar}
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
                    {entry.name}
                    {entry.rank <= 3 && (
                      <Medal className={`h-3 w-3 ml-1 ${
                        entry.rank === 1 ? 'text-yellow-500' : 
                        entry.rank === 2 ? 'text-slate-400' : 
                        'text-amber-700'
                      }`} />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{entry.points} pts</div>
                </div>
                <div className={`text-xs font-medium ${
                  entry.change === 'up' ? 'text-green-500' : 
                  entry.change === 'down' ? 'text-red-500' : 
                  'text-slate-400'
                }`}>
                  {entry.change === 'up' ? '↑' : entry.change === 'down' ? '↓' : '–'}
                </div>
              </div>
            ))}
          </div>
          
          {/* Leaderboard Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <button className="w-full py-2 text-sm text-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <Users className="h-4 w-4 inline-block mr-2" />
              Invite Friends
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 