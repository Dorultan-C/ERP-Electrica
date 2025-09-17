'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { modules } from '@/data/modules'
import { sections } from '@/data/sections'

interface NavigationContextType {
  // Module navigation state
  moduleMenuOpen: boolean
  openModuleMenu: () => void
  closeModuleMenu: () => void
  toggleModuleMenu: () => void

  // Selected module state
  selectedModuleId: string | null
  setSelectedModule: (moduleId: string | null) => void

  // Selected section state
  selectedSectionId: string | null
  setSelectedSection: (sectionId: string | null) => void

  // Side drawer state
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
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  // Side drawer state
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

    // Auto-select first section when module is selected
    if (moduleId) {
      const currentModule = modules.find(m => m.id === moduleId)
      if (currentModule) {
        const currentSections = sections
          .filter(s => currentModule.sectionIds.includes(s.id) && s.isActive)
          .sort((a, b) => a.order - b.order)

        // Select first available section
        if (currentSections.length > 0) {
          setSelectedSectionId(currentSections[0]!.id)
        } else {
          setSelectedSectionId(null)
        }
      }
      closeModuleMenu()
    } else {
      // Clear section selection when no module is selected
      setSelectedSectionId(null)
    }
  }, [closeModuleMenu])

  // Section selection
  const setSelectedSection = useCallback((sectionId: string | null) => {
    setSelectedSectionId(sectionId)
  }, [])

  // Side drawer actions
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

    // Section selection
    selectedSectionId,
    setSelectedSection,

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