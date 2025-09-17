'use client'

import { useEffect } from 'react'
import { useNavigation } from '../contexts/NavigationContext'

export function useKeyboardShortcuts() {
  const { moduleMenuOpen, closeModuleMenu, toggleModuleMenu } = useNavigation()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key - Close module menu
      if (event.key === 'Escape' && moduleMenuOpen) {
        event.preventDefault()
        closeModuleMenu()
        return
      }

      // Ctrl/Cmd + M - Toggle module menu
      if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
        event.preventDefault()
        toggleModuleMenu()
        return
      }

      // Space key - Toggle module menu (when not in input)
      if (event.key === ' ' && !moduleMenuOpen && event.target === document.body) {
        event.preventDefault()
        toggleModuleMenu()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [moduleMenuOpen, closeModuleMenu, toggleModuleMenu])
}

// Custom hook for component-specific shortcuts
export function useModuleShortcuts() {
  const { setSelectedModule, closeModuleMenu } = useNavigation()

  const handleModuleShortcut = (moduleId: string) => {
    setSelectedModule(moduleId)
    closeModuleMenu()
  }

  return { handleModuleShortcut }
}