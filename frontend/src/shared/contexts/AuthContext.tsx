'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import { dummyUsers } from '../../data/dummy/users'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    // Check for existing session on app load
    // In Phase 9, this will check for JWT token in localStorage/sessionStorage
    const checkExistingSession = () => {
      // For now, auto-login the second dummy user for development
      const currentUser = dummyUsers[1]
      if (currentUser) {
        setAuthState({
          user: currentUser,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }))
      }
    }

    // Simulate loading delay (in real app, this would be an API call)
    const timer = setTimeout(checkExistingSession, 500)
    return () => clearTimeout(timer)
  }, [])

  const login = async (username: string, _password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))

      // In Phase 9, this will make an API call to authenticate
      // For now, simulate authentication with dummy data
      const user = dummyUsers.find(u =>
        u.username === username || u.email === username
      )

      if (user) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        })
        return true
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }))
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }))
      return false
    }
  }

  const logout = () => {
    // In Phase 9, this will clear JWT token and make logout API call
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  const updateUser = (updates: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null
    }))
  }

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}