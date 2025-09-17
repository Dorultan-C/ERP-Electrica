'use client'

import React, { useEffect } from 'react'
import { modules } from '@/data/modules'
import { type Module } from '@/shared/types'
import ModuleCard from './ModuleCard'

interface ModuleGridProps {
  isOpen: boolean
  onClose: () => void
  onModuleSelect?: (moduleId: string) => void
}

export default function ModuleGrid({ isOpen, onClose, onModuleSelect }: ModuleGridProps) {
  useEffect(() => {
    // Handle body scroll locking when module grid is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleModuleClick = (module: Module) => {
    if (module.isActive) {
      onModuleSelect?.(module.id)
      console.log(`Navigate to ${module.title}:`, module.route)
    }
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Header for the module menu */}
      <div
        className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
              aria-label="Close Module Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Module
            </div>
          </div>

          {/* Keyboard shortcut hint */}
          <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
            Press ESC to close
          </div>
        </div>
      </div>

      {/* Module Grid Content */}
      <div
        className={`flex-1 p-8 overflow-y-auto transition-all duration-500 delay-100 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={handleModuleClick}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}