'use client'

import React from 'react'
import { DataListCellProps } from '../types'

interface ActionButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

export function ActionButton({
  onClick,
  children,
  variant = 'secondary',
  size = 'sm',
  className = ''
}: ActionButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm'
  }

  const variantClasses = {
    primary: 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

interface IconButtonProps {
  onClick: () => void
  icon: React.ReactNode
  title?: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

export function IconButton({
  onClick,
  icon,
  title,
  variant = 'secondary',
  size = 'sm',
  className = ''
}: IconButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2'
  }

  const variantClasses = {
    primary: 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  return (
    <button
      type="button"
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

interface ActionsCellProps<T = any> extends Partial<DataListCellProps<T>> {
  children: React.ReactNode
  className?: string
}

export function Actions<T>({ children, className = '' }: ActionsCellProps<T>) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {children}
    </div>
  )
}