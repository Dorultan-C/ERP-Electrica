'use client'

import React from 'react'
import Header from './Header'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Side Drawer - Placeholder for module sections */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 hidden lg:block">
          <nav className="p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Navigation will be implemented in Phase 2.3
            </div>
          </nav>
        </aside>

        {/* Mobile Overlay Placeholder */}
        <div className="lg:hidden">
          {/* Mobile drawer will be implemented in Phase 2.3 */}
        </div>

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