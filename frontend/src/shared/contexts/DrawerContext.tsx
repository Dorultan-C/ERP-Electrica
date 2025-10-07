'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { DrawerType, drawerRegistry } from '@/shared/drawer/drawerRegistry'

export interface DrawerStackItem {
  id: string
  type: DrawerType
  title: string
}

interface DrawerContextType {
  // State
  stack: DrawerStackItem[]
  isOpen: boolean
  isExpanded: boolean
  direction: number

  // Current item (top of stack)
  current: DrawerStackItem | null

  // Actions
  open: (id: string, type: DrawerType) => void
  close: () => void
  navigateTo: (id: string, type: DrawerType) => void
  navigateBack: () => void
  navigateToIndex: (index: number) => void
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

  const [stack, setStack] = useState<DrawerStackItem[]>([])
  const [isExpanded, setIsExpandedState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [direction, setDirection] = useState(1)

  // Derived state
  const isOpen = stack.length > 0
  const current = stack.length > 0 ? stack[stack.length - 1] ?? null : null

  // Parse drawer parameter from URL: "type:id,type:id,..."
  const parseDrawerParam = useCallback((param: string): DrawerStackItem[] => {
    if (!param) return []

    const items: DrawerStackItem[] = []
    const pairs = param.split(',')

    for (const pair of pairs) {
      const [type, id] = pair.split(':')
      if (type && id && type in drawerRegistry) {
        const drawerType = type as DrawerType
        const title = drawerRegistry[drawerType].getTitle(id)
        items.push({ id, type: drawerType, title })
      }
    }

    return items
  }, [])

  // Encode stack to URL parameter
  const encodeStackToUrl = useCallback((stack: DrawerStackItem[]): string => {
    if (stack.length === 0) return ''
    return stack.map(item => `${item.type}:${item.id}`).join(',')
  }, [])

  // Initialize from URL on mount
  useEffect(() => {
    const drawerParam = searchParams.get('drawer')
    const expanded = searchParams.get('expanded') === 'true'

    if (drawerParam) {
      const items = parseDrawerParam(drawerParam)
      setStack(items)
      setIsExpandedState(expanded)
    }

    setIsInitialized(true)
  }, []) // Only run on mount

  // Sync stack to URL whenever it changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return

    const params = new URLSearchParams(searchParams.toString())

    if (stack.length > 0) {
      params.set('drawer', encodeStackToUrl(stack))
      if (isExpanded) {
        params.set('expanded', 'true')
      } else {
        params.delete('expanded')
      }
    } else {
      params.delete('drawer')
      params.delete('expanded')
    }

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.replace(newUrl, { scroll: false })
  }, [stack, isExpanded, pathname, isInitialized])

  // Open drawer (new stack)
  const open = useCallback((id: string, type: DrawerType) => {
    const title = drawerRegistry[type].getTitle(id)
    setStack([{ id, type, title }])
  }, [])

  // Close drawer - just clear the stack, animation handled by AnimatePresence
  const close = useCallback(() => {
    setStack([])
    setIsExpandedState(false)
  }, [])

  // Navigate to new item (push to stack)
  const navigateTo = useCallback((id: string, type: DrawerType) => {
    const title = drawerRegistry[type].getTitle(id)
    setDirection(1) // Forward
    setStack(prev => [...prev, { id, type, title }])
  }, [])

  // Navigate back (pop from stack)
  const navigateBack = useCallback(() => {
    setDirection(-1) // Backward
    setStack(prev => {
      if (prev.length <= 1) {
        return [] // Close drawer if only one item
      }
      return prev.slice(0, -1)
    })
  }, [])

  // Navigate to specific index (breadcrumb click)
  const navigateToIndex = useCallback((index: number) => {
    setStack(prev => {
      // Determine direction based on where we're going
      if (index < prev.length - 1) {
        setDirection(-1) // Going backward
      }
      return prev.slice(0, index + 1)
    })
  }, [])

  // Toggle expand
  const toggleExpand = useCallback(() => {
    setIsExpandedState(prev => !prev)
  }, [])

  // Set expanded state
  const setExpanded = useCallback((expanded: boolean) => {
    setIsExpandedState(expanded)
  }, [])

  const contextValue: DrawerContextType = {
    stack,
    isOpen,
    isExpanded,
    direction,
    current,
    open,
    close,
    navigateTo,
    navigateBack,
    navigateToIndex,
    toggleExpand,
    setExpanded,
  }

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  )
}
