"use client"

import { Heart, Instagram, Twitter, Facebook, Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full py-10 mt-10 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                fitnessTrack
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {currentYear} fitnessTrack. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
            </div>
            
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <span>Made with</span>
              <Heart className="h-3 w-3 mx-1 text-red-500" />
              <span>for healthier lives</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 