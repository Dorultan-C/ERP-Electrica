'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Notification } from '../types'
import { dummyNotifications } from '../../data/dummy/notifications'

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
}

export interface NotificationContextType extends NotificationState {
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (notificationId: string) => void
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true
  })

  // Initialize notifications on mount
  useEffect(() => {
    const initializeNotifications = () => {
      // In Phase 9, this will fetch from API
      // For now, use dummy data sorted by creation date (newest first)
      const sortedNotifications = [...dummyNotifications].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )

      const unreadCount = sortedNotifications.filter(n => !n.isRead).length

      setNotificationState({
        notifications: sortedNotifications,
        unreadCount,
        isLoading: false
      })
    }

    // Simulate loading delay (in real app, this would be an API call)
    const timer = setTimeout(initializeNotifications, 300)
    return () => clearTimeout(timer)
  }, [])

  // Mark a specific notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotificationState(prev => {
      const updatedNotifications = prev.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true, seenAt: new Date() }
          : notification
      )

      const unreadCount = updatedNotifications.filter(n => !n.isRead).length

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount
      }
    })
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotificationState(prev => {
      const updatedNotifications = prev.notifications.map(notification => ({
        ...notification,
        isRead: true,
        seenAt: notification.seenAt || new Date()
      }))

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: 0
      }
    })
  }, [])

  // Add a new notification
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date()
    }

    setNotificationState(prev => {
      const updatedNotifications = [newNotification, ...prev.notifications]
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount
      }
    })
  }, [])

  // Remove a notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotificationState(prev => {
      const updatedNotifications = prev.notifications.filter(n => n.id !== notificationId)
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount
      }
    })
  }, [])

  // Refresh notifications (for future API integration)
  const refreshNotifications = useCallback(async () => {
    setNotificationState(prev => ({ ...prev, isLoading: true }))

    try {
      // In Phase 9, this will make an API call
      // For now, simulate refresh with dummy data
      await new Promise(resolve => setTimeout(resolve, 500))

      const sortedNotifications = [...dummyNotifications].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )

      const unreadCount = sortedNotifications.filter(n => !n.isRead).length

      setNotificationState({
        notifications: sortedNotifications,
        unreadCount,
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to refresh notifications:', error)
      setNotificationState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const contextValue: NotificationContextType = {
    ...notificationState,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    refreshNotifications
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}