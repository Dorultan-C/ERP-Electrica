'use client'

import React from 'react'

interface DashboardButtonProps {
  onClick?: () => void
}

export default function DashboardButton({ onClick }: DashboardButtonProps) {
  const handleClick = () => {
    // TODO: Navigate to dashboard (will be implemented in later phases)
    console.log('Navigate to Dashboard')
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      aria-label="Dashboard"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
      Dashboard
    </button>
  )
}