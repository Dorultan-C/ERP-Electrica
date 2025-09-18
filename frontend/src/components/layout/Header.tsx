'use client'

import React from 'react'
import ModuleNavigationButton from '../ui/ModuleNavigationButton'
import DashboardButton from '../ui/DashboardButton'
import NotificationButton from '../ui/NotificationButton'
import ProfileDropdown from '../ui/ProfileDropdown'
import ModuleGrid from '../ui/ModuleGrid'
import { useNavigation } from '../../shared/contexts'
import { useKeyboardShortcuts } from '../../shared/hooks/useKeyboardShortcuts'
import { modules } from '@/data/modules'
import { sections } from '@/data/sections'

export default function Header() {
  const { moduleMenuOpen, toggleModuleMenu, closeModuleMenu, setSelectedModule, selectedModuleId, selectedSectionId, toggleSideDrawer } = useNavigation()

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId)
    // Module context will handle closing the menu
  }

  // Get current module and section
  const currentModule = modules.find(m => m.id === selectedModuleId)
  const currentSection = sections.find(s => s.id === selectedSectionId)

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Main header row */}
          <div className="flex items-center justify-between h-16">
            {/* Left side - Module navigation and dashboard */}
            <div className="flex items-center space-x-4">
              {/* Mobile sidebar toggle button - Only show when module is selected */}
              {selectedModuleId && (
                <button
                  onClick={toggleSideDrawer}
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                  aria-label="Open sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <ModuleNavigationButton
                isOpen={moduleMenuOpen}
                onToggle={toggleModuleMenu}
              />

              <DashboardButton />

              {/* Desktop title */}
              <div className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-white">
                {currentModule ? currentModule.title : 'ERP System'}
              </div>
            </div>

            {/* Right side - Notifications and profile */}
            <div className="flex items-center space-x-4">
              <NotificationButton />

              <ProfileDropdown />
            </div>
          </div>

          {/* Mobile title row - Only show when module is selected */}
          {currentModule && (
            <div className="sm:hidden pb-3 -mt-2">
              {currentSection ? (
                <>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentSection.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {currentModule.title}
                  </div>
                </>
              ) : (
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentModule.title}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Module Grid Overlay */}
      <ModuleGrid
        isOpen={moduleMenuOpen}
        onClose={closeModuleMenu}
        onModuleSelect={handleModuleSelect}
        selectedModuleId={selectedModuleId}
      />
    </>
  )
}