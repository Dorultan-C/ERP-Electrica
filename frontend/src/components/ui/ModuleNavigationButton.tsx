'use client'

import React from 'react'

interface ModuleNavigationButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export default function ModuleNavigationButton({ isOpen, onToggle }: ModuleNavigationButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
      aria-label="Module Navigation"
    >
      <div className="relative w-6 h-6">
        {/* Grid Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${
            isOpen
              ? 'opacity-0'
              : 'opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
        </svg>

        {/* Close Icon (X) */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${
            isOpen
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </button>
  )
}