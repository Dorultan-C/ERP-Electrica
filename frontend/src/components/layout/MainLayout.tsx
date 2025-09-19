'use client'

import React from 'react'
import Header from './Header'
import SideDrawer from '../ui/SideDrawer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 sticky top-0 z-30">
        <Header />
      </div>

      {/* Main Content Area - Takes remaining height */}
      <div className="flex flex-1 min-h-0">
        {/* Side Drawer - Fixed height with independent scrolling */}
        <div className="flex-shrink-0">
          <SideDrawer />
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}