/**
 * Centralized hook for accessing all application contexts
 * Provides a single point of access for all context values
 * Useful for components that need multiple context values
 */

import { useAuth } from './AuthContext'
import { useNavigation } from './NavigationContext'
import { useNotifications } from './NotificationContext'

export function useAppContext() {
  const auth = useAuth()
  const navigation = useNavigation()
  const notifications = useNotifications()

  return {
    auth,
    navigation,
    notifications
  }
}

// Individual context re-exports for convenience
export { useAuth, useNavigation, useNotifications }