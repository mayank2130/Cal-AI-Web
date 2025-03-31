"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

interface SetGoalProps {
  title: string
  subtitle?: string
  initialValue?: number
  unit?: string
  min?: number
  max?: number
  step?: number
  onSave?: (value: number) => void
}

export function SetGoal({
  title,
  subtitle = "Set your daily activity goal.",
  initialValue = 500,
  unit = "CALORIES/DAY",
  min = 100,
  max = 1000,
  step = 10,
  onSave
}: SetGoalProps) {
  const [value, setValue] = useState(initialValue)
  
  // Generate visualization data (activity bars)
  const generateBars = () => {
    // Create 12 random bars to visualize activity levels
    return Array.from({ length: 12 }).map(() => {
      const height = Math.random() * 100 + 20
      return {
        height: `${height}%`
      }
    })
  }
  
  const [bars] = useState(generateBars())
  
  const handleDecrement = () => {
    if (value > min) {
      setValue(prev => Math.max(prev - step, min))
    }
  }
  
  const handleIncrement = () => {
    if (value < max) {
      setValue(prev => Math.min(prev + step, max))
    }
  }
  
  const handleSave = () => {
    if (onSave) {
      onSave(value)
    }
  }
  
  return (
    <div className="bg-black text-white rounded-xl p-6 max-w-md w-full mx-auto shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-slate-400 mt-1">{subtitle}</p>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleDecrement}
          className="h-12 w-12 rounded-full border border-slate-600 flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
          aria-label="Decrease goal"
        >
          <Minus size={20} />
        </button>
        
        <div className="text-center">
          <div className="text-5xl font-bold">{value}</div>
          <div className="text-xs text-slate-400 mt-1">{unit}</div>
        </div>
        
        <button 
          onClick={handleIncrement}
          className="h-12 w-12 rounded-full border border-slate-600 flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
          aria-label="Increase goal"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* Activity Visualization */}
      <div className="flex items-end justify-between h-24 mb-8 px-1">
        {bars.map((bar, index) => (
          <div 
            key={index}
            className="w-4 bg-white rounded-sm"
            style={{ height: bar.height }}
          />
        ))}
      </div>
      
      <button
        onClick={handleSave}
        className="w-full py-4 bg-white text-black font-medium rounded-lg hover:bg-slate-200 transition-colors"
      >
        Set Goal
      </button>
    </div>
  )
} 