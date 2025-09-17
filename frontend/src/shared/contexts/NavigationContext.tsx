'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface NavigationContextType {
  // Module navigation state
  moduleMenuOpen: boolean
  openModuleMenu: () => void
  closeModuleMenu: () => void
  toggleModuleMenu: () => void

  // Selected module state
  selectedModuleId: string | null
  setSelectedModule: (moduleId: string | null) => void

  // Side drawer state (for future implementation)
  sideDrawerOpen: boolean
  sideDrawerExpanded: boolean
  toggleSideDrawer: () => void
  setSideDrawerExpanded: (expanded: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  children: React.ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  // Module menu state
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  // Side drawer state (for future Phase 2.3)
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false)
  const [sideDrawerExpanded, setSideDrawerExpanded] = useState(true)

  // Module menu actions
  const openModuleMenu = useCallback(() => {
    setModuleMenuOpen(true)
  }, [])

  const closeModuleMenu = useCallback(() => {
    setModuleMenuOpen(false)
  }, [])

  const toggleModuleMenu = useCallback(() => {
    setModuleMenuOpen(prev => !prev)
  }, [])

  // Module selection
  const setSelectedModule = useCallback((moduleId: string | null) => {
    setSelectedModuleId(moduleId)
    // Auto-close module menu when a module is selected
    if (moduleId) {
      closeModuleMenu()
    }
  }, [closeModuleMenu])

  // Side drawer actions (for future use)
  const toggleSideDrawer = useCallback(() => {
    setSideDrawerOpen(prev => !prev)
  }, [])

  const contextValue: NavigationContextType = {
    // Module navigation
    moduleMenuOpen,
    openModuleMenu,
    closeModuleMenu,
    toggleModuleMenu,

    // Module selection
    selectedModuleId,
    setSelectedModule,

    // Side drawer
    sideDrawerOpen,
    sideDrawerExpanded,
    toggleSideDrawer,
    setSideDrawerExpanded
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}