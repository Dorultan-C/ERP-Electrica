'use client'

import React from 'react'
import { AuthProvider } from './AuthContext'
import { NavigationProvider } from './NavigationContext'
import { DrawerProvider } from './DrawerContext'
import { NotificationProvider } from './NotificationContext'
import { ContextErrorBoundary } from './ContextErrorBoundary'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Combined context providers for the entire application
 * Centralizes all context providers in a clean, maintainable structure
 * Includes error boundary for robust error handling
 *
 * Provider hierarchy:
 * 1. ContextErrorBoundary - Error handling for context failures
 * 2. AuthProvider - User authentication and session management
 * 3. NavigationProvider - Module and navigation state
 * 4. DrawerProvider - Right drawer state and URL routing
 * 5. NotificationProvider - Notification state and actions
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ContextErrorBoundary>
      <AuthProvider>
        <NavigationProvider>
          <DrawerProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </DrawerProvider>
        </NavigationProvider>
      </AuthProvider>
    </ContextErrorBoundary>
  )
}