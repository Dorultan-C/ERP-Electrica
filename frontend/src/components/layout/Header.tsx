'use client'

import React, { useState } from 'react'
import ModuleNavigationButton from '../ui/ModuleNavigationButton'
import DashboardButton from '../ui/DashboardButton'
import NotificationButton from '../ui/NotificationButton'
import ProfileDropdown from '../ui/ProfileDropdown'
import ModuleGrid from '../ui/ModuleGrid'

export default function Header() {
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false)

  const handleModuleToggle = () => {
    setModuleMenuOpen(!moduleMenuOpen)
  }

  const handleModuleClose = () => {
    setModuleMenuOpen(false)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          {/* Left side - Module navigation and dashboard */}
          <div className="flex items-center space-x-4">
            <ModuleNavigationButton
              isOpen={moduleMenuOpen}
              onToggle={handleModuleToggle}
            />

            <DashboardButton />

            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ERP System
            </div>
          </div>

          {/* Right side - Notifications and profile */}
          <div className="flex items-center space-x-4">
            <NotificationButton count={3} />

            <ProfileDropdown
              userName="John Doe"
              userEmail="john.doe@company.com"
            />
          </div>
        </div>
      </header>

      {/* Module Grid Overlay */}
      <ModuleGrid isOpen={moduleMenuOpen} onClose={handleModuleClose} />
    </>
  )
}