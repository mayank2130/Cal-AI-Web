"use client"

import { ReactNode, createContext, useState, useContext, useEffect } from "react"
import { ThemeProvider } from "./theme-provider"

// Define the context type
type TabContextType = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

// Create the context with default values
const TabContext = createContext<TabContextType>({
  activeTab: "overview",
  setActiveTab: () => {},
})

// Hook to use the tab context
export const useTabContext = () => useContext(TabContext)

// Provider component
export function Providers({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Initialize from localStorage if available
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab && ["overview", "activity", "nutrition", "sleep", "workouts"].includes(savedTab)) {
      setActiveTab(savedTab)
    }
  }, [])
  
  // Save to localStorage whenever activeTab changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
    
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('changeTab', { detail: activeTab }))
  }, [activeTab])

  return (
    <ThemeProvider defaultTheme="light" storageKey="fitness-theme">
      <TabContext.Provider value={{ activeTab, setActiveTab }}>
        {children}
      </TabContext.Provider>
    </ThemeProvider>
  )
} 