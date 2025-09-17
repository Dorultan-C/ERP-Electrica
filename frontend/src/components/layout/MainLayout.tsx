'use client'

import React from 'react'
import Header from './Header'
import SideDrawer from '../ui/SideDrawer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Side Drawer */}
        <SideDrawer />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}