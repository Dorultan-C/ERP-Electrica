'use client'

import React, { Component, ReactNode } from 'react'

interface ContextErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ContextErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Error boundary specifically for context-related errors
 * Provides a fallback UI when context providers fail
 */
export class ContextErrorBoundary extends Component<ContextErrorBoundaryProps, ContextErrorBoundaryState> {
  constructor(props: ContextErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ContextErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Context Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Application Error
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There was an error loading the application. Please refresh the page to try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer">Error Details (Dev Mode)</summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}