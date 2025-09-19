'use client'

import React, { useEffect, useMemo } from 'react'
import { modules } from '@/data/modules'
import { type Module } from '@/shared/types'
import { usePermissions } from '@/shared/hooks'
import ModuleCard from './ModuleCard'

interface ModuleGridProps {
  isOpen: boolean
  onClose: () => void
  onModuleSelect?: (moduleId: string) => void
  selectedModuleId?: string | null
}

export default function ModuleGrid({ isOpen, onClose, onModuleSelect, selectedModuleId }: ModuleGridProps) {
  const { hasModuleAccess } = usePermissions()

  // Filter modules based on user permissions
  const accessibleModules = useMemo(() => {
    return modules.filter((module) => {
      // Check if user has any permission with moduleId matching this module
      // Note: Super users are automatically handled by hasModuleAccess
      return hasModuleAccess(module.id)
    })
  }, [hasModuleAccess])

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
            {accessibleModules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={handleModuleClick}
                index={index}
                isSelected={selectedModuleId === module.id}
              />
            ))}
          </div>

          {/* Show message if no accessible modules */}
          {accessibleModules.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No Accessible Modules</h3>
                <p className="text-sm">You don&apos;t have permission to access any modules.</p>
                <p className="text-sm mt-1">Contact your administrator for access.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}