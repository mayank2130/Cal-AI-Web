"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Menu, X, Sun, Moon, Settings, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useTabContext } from "./providers"
import { useTheme } from "./theme-provider"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { activeTab, setActiveTab } = useTabContext()
  const { theme, setTheme } = useTheme()
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuOpen && e.target instanceof Element && !e.target.closest('.user-menu')) {
        setUserMenuOpen(false)
      }
    }
    
    // Only add listener if menu is open
    if (userMenuOpen) {
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside)
      }, 0)
    }
    
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [userMenuOpen])

  // This function navigates and sets the active tab
  const navigateToTab = (tab: string) => {
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
    
    // Update the active tab in context
    setActiveTab(tab)
    
    // If we're not on the home page, navigate to home
    if (pathname !== '/') {
      router.push('/')
    }
  }

  // Toggle user menu
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled 
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-white">
          fitnessTrack
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => navigateToTab('overview')}
            className={`text-sm hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'overview' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigateToTab('activity')}
            className={`text-sm hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'activity' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Activity
          </button>
          <button 
            onClick={() => navigateToTab('nutrition')}
            className={`text-sm hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'nutrition' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Nutrition
          </button>
          <button 
            onClick={() => navigateToTab('sleep')}
            className={`text-sm hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'sleep' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Sleep
          </button>
          <button 
            onClick={() => navigateToTab('workouts')}
            className={`text-sm hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'workouts' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Workouts
          </button>
          
          {/* Theme toggle button */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* User profile button with dropdown */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center cursor-pointer relative"
              aria-label="User profile"
            >
              <User className="w-4 h-4 text-white dark:text-black" />
            </button>
            
            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-medium text-slate-900 dark:text-white">Alex Johnson</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">alex@example.com</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black shadow-md py-4 px-6 flex flex-col space-y-4">
          <button 
            onClick={() => navigateToTab('overview')}
            className={`text-base py-2 hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'overview' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigateToTab('activity')}
            className={`text-base py-2 hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'activity' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Activity
          </button>
          <button 
            onClick={() => navigateToTab('nutrition')}
            className={`text-base py-2 hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'nutrition' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Nutrition
          </button>
          <button 
            onClick={() => navigateToTab('sleep')}
            className={`text-base py-2 hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'sleep' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Sleep
          </button>
          <button 
            onClick={() => navigateToTab('workouts')}
            className={`text-base py-2 hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeTab === 'workouts' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Workouts
          </button>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <User className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="ml-3 text-slate-700 dark:text-slate-300">Alex Johnson</span>
            </div>
            
            {/* Mobile theme toggle */}
            <button
              className="p-2 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      )}
    </header>
  )
} 