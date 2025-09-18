// Centralized exports for React contexts
// Following the shared component architecture for future web/mobile compatibility

export { AuthProvider, useAuth } from './AuthContext'
export type { AuthState, AuthContextType, AuthProviderProps } from './AuthContext'

export { NavigationProvider, useNavigation } from './NavigationContext'

export { NotificationProvider, useNotifications } from './NotificationContext'
export type { NotificationState, NotificationContextType, NotificationProviderProps } from './NotificationContext'

// Combined providers for easy app setup
export { AppProviders } from './AppProviders'
export { ContextErrorBoundary } from './ContextErrorBoundary'

// Centralized context hook
export { useAppContext } from './useAppContext'