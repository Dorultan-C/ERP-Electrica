
import { useState } from 'react'

export function useDrawer<T>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = (item: T) => {
    setSelectedItem(item)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setSelectedItem(null)
    setIsDrawerOpen(false)
  }

  return {
    selectedItem,
    isDrawerOpen,
    openDrawer,
    closeDrawer
  }
}
