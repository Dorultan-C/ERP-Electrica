'use client'

import React, { useMemo } from 'react'
import { useNavigation } from '../../shared/contexts/NavigationContext'
import { usePermissions } from '@/shared/hooks'
import { sections } from '@/data/sections'
import { modules } from '@/data/modules'

export default function SideDrawer() {
  const {
    selectedModuleId,
    selectedSectionId,
    setSelectedSection,
    sideDrawerOpen,
    sideDrawerExpanded,
    toggleSideDrawer,
    setSideDrawerExpanded
  } = useNavigation()

  const { hasSectionAccess } = usePermissions()

  // Get current module and its sections with permission filtering
  const currentModule = modules.find(m => m.id === selectedModuleId)
  const currentSections = useMemo(() => {
    if (!currentModule) return []

    const moduleSections = sections.filter(s =>
      currentModule.sectionIds.includes(s.id) && s.isActive
    )

    // Filter sections based on permissions
    const accessibleSections = moduleSections.filter((section) => {
      // Check if user has any permission with sectionId matching this section
      // Note: Super users are automatically handled by hasSectionAccess
      return hasSectionAccess(section.id)
    })

    return accessibleSections.sort((a, b) => a.order - b.order)
  }, [currentModule, selectedModuleId, hasSectionAccess])

  const handleSectionClick = (sectionId: string, route: string) => {
    setSelectedSection(sectionId)
    console.log(`Navigate to section: ${sectionId}, route: ${route}`)
    // TODO: Implement actual routing in future phases
  }

  const toggleExpanded = () => {
    setSideDrawerExpanded(!sideDrawerExpanded)
  }

  return (
    <>
      {/* Desktop Side Drawer - Only show when module is selected */}
      {selectedModuleId && (
        <aside className={`hidden lg:block bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${sideDrawerExpanded ? 'w-64' : 'w-14'}`}>
          {/* Header */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleExpanded}
              className={`w-full flex items-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                sideDrawerExpanded
                  ? 'justify-end'
                  : 'justify-center'
              }`}
              aria-label={sideDrawerExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <div className={`flex-shrink-0 text-gray-500 dark:text-gray-400 ${!sideDrawerExpanded ? 'w-5 h-5' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sideDrawerExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </div>
            </button>
          </div>

        {/* Navigation */}
        <nav className="p-2">
          {currentSections.length > 0 ? (
            <div className="space-y-1">
              {currentSections.map((section) => {
                const isSelected = selectedSectionId === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id, section.route)}
                    className={`w-full flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] ${
                      sideDrawerExpanded
                        ? 'justify-start space-x-3 p-3'
                        : 'justify-center p-2'
                    } ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={!sideDrawerExpanded ? `${section.title}${section.description ? ` - ${section.description}` : ''}` : undefined}
                  >
                    <div className={`flex-shrink-0 ${!sideDrawerExpanded ? 'w-5 h-5' : ''} ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {section.icon}
                    </div>
                    {sideDrawerExpanded && (
                      <div className="flex-1 text-left min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          isSelected ? 'text-blue-700 dark:text-blue-300' : ''
                        }`}>{section.title}</div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className={`text-center ${sideDrawerExpanded ? 'p-4' : 'py-4 px-2'}`}>
              {selectedModuleId ? (
                sideDrawerExpanded ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No sections available
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500" title="No sections available">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                )
              ) : (
                sideDrawerExpanded ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Select a module to view sections
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500" title="Select a module to view sections">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                )
              )}
            </div>
          )}
        </nav>
        </aside>
      )}

      {/* Mobile Side Drawer - Only show when module is selected */}
      {selectedModuleId && (
        <div className="lg:hidden">
          {/* Mobile Side Drawer Overlay */}
          {sideDrawerOpen && (
            <div
              className="fixed inset-0 z-40 transition-opacity"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              onClick={toggleSideDrawer}
              aria-hidden="true"
            />
          )}

          {/* Mobile Side Drawer Panel */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
              sideDrawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {currentModule ? currentModule.title : 'Navigation'}
              </div>

              <button
                onClick={toggleSideDrawer}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          {/* Mobile Navigation */}
          <nav className="p-2">
            {currentSections.length > 0 ? (
              <div className="space-y-1">
                {currentSections.map((section) => {
                  const isSelected = selectedSectionId === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        handleSectionClick(section.id, section.route)
                        // Close mobile drawer after selection
                        toggleSideDrawer()
                      }}
                      className={`w-full flex items-center justify-start space-x-3 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {section.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          isSelected ? 'text-blue-700 dark:text-blue-300' : ''
                        }`}>{section.title}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedModuleId ? (
                    "No sections available"
                  ) : (
                    "Select a module to view sections"
                  )}
                </div>
              </div>
            )}
          </nav>
          </div>
        </div>
      )}
    </>
  )
}