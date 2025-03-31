"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  indicatorColor?: string
  trackColor?: string
  label?: React.ReactNode
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 4,
  className,
  indicatorColor,
  trackColor,
  label,
}: CircularProgressProps) {
  const { theme } = useTheme()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  // Default colors based on theme
  const defaultIndicatorColor = theme === 'dark' ? 'white' : 'black'
  const defaultTrackColor = theme === 'dark' ? '#27272a' : '#f1f5f9'

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor || defaultTrackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={indicatorColor || defaultIndicatorColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label}
        </div>
      )}
    </div>
  )
} 