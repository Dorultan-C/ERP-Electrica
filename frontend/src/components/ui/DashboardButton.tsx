'use client'

import React from 'react'

interface DashboardButtonProps {
  onClick?: () => void
}

export default function DashboardButton({ onClick }: DashboardButtonProps) {
  const handleClick = () => {
    // TODO: Navigate to dashboard (will be implemented in later phases)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
      aria-label="Dashboard"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l9 9v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9l9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
      </svg>
    </button>
  )
}