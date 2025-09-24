'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface DrawerState {
  isOpen: boolean
  isClosing: boolean
  isExpanded: boolean
  selectedId: string | null
  selectedType: string | null
}

interface DrawerContextType {
  // State
  isOpen: boolean
  isClosing: boolean
  isExpanded: boolean
  selectedId: string | null
  selectedType: string | null

  // Actions
  openDrawer: (id: string, type: string) => void
  closeDrawer: () => void
  toggleExpand: () => void
  setExpanded: (expanded: boolean) => void
}

const DrawerContext = createContext<DrawerContextType | null>(null)

export const useDrawer = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }
  return context
}

interface DrawerProviderProps {
  children: React.ReactNode
}

export function DrawerProvider({ children }: DrawerProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [state, setState] = useState<DrawerState>({
    isOpen: false,
    isClosing: false,
    isExpanded: false,
    selectedId: null,
    selectedType: null
  })

  // Initialize state from URL on mount
  useEffect(() => {
    const urlParts = pathname.split('/')
    const detailId = searchParams.get('detail')
    const detailType = searchParams.get('type')
    const expanded = searchParams.get('expanded') === 'true'

    if (detailId) {
      setState({
        isOpen: true,
        isClosing: false,
        isExpanded: expanded,
        selectedId: detailId,
        selectedType: detailType || urlParts[2] || 'unknown' // Prefer URL param, fallback to path segment
      })
    } else {
      // If no detail ID, close the drawer
      setState(prev => ({
        ...prev,
        isOpen: false,
        isClosing: false,
        selectedId: null,
        selectedType: null
      }))
    }
  }, [pathname, searchParams])

  const openDrawer = useCallback((id: string, type: string) => {
    // Update URL with query parameters instead of path segments
    const params = new URLSearchParams(searchParams.toString())
    params.set('detail', id)
    params.set('type', type)

    if (state.isExpanded) {
      params.set('expanded', 'true')
    }

    const queryString = params.toString()
    const finalUrl = `${pathname}?${queryString}`

    router.push(finalUrl, { scroll: false })

    // Note: State will be set by the useEffect when URL changes
  }, [pathname, searchParams, router, state.isExpanded])

  const closeDrawer = useCallback(() => {
    // First, set closing state to trigger exit animation
    setState(prev => ({
      ...prev,
      isClosing: true
    }))

    // After animation completes, actually close the drawer
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isOpen: false,
        isClosing: false,
        selectedId: null,
        selectedType: null
      }))

      // Remove detail, type and expanded parameters from URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete('detail')
      params.delete('type')
      params.delete('expanded')

      const queryString = params.toString()
      const finalUrl = queryString ? `${pathname}?${queryString}` : pathname

      router.push(finalUrl, { scroll: false })
    }, 300)
  }, [pathname, searchParams, router])

  const toggleExpand = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))

    // Update URL with expanded state
    const params = new URLSearchParams(searchParams.toString())

    if (!state.isExpanded) {
      params.set('expanded', 'true')
    } else {
      params.delete('expanded')
    }

    const queryString = params.toString()
    const finalUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(finalUrl, { scroll: false })
  }, [pathname, searchParams, router, state.isExpanded])

  const setExpanded = useCallback((expanded: boolean) => {
    setState(prev => ({ ...prev, isExpanded: expanded }))

    const params = new URLSearchParams(searchParams.toString())

    if (expanded) {
      params.set('expanded', 'true')
    } else {
      params.delete('expanded')
    }

    const queryString = params.toString()
    const finalUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(finalUrl, { scroll: false })
  }, [pathname, searchParams, router])

  const contextValue: DrawerContextType = {
    isOpen: state.isOpen,
    isClosing: state.isClosing,
    isExpanded: state.isExpanded,
    selectedId: state.selectedId,
    selectedType: state.selectedType,
    openDrawer,
    closeDrawer,
    toggleExpand,
    setExpanded
  }

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  )
}