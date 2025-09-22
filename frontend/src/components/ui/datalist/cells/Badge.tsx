'use client'

import React from 'react'
import { DataListCellProps } from '../types'

interface BadgeCellProps<T = any> extends Partial<DataListCellProps<T>> {
  value?: any
  colorMap?: Record<string, string>
  variant?: 'solid' | 'outline'
  className?: string
}

export function Badge<T>({
  value,
  colorMap = {},
  variant = 'solid',
  className = ''
}: BadgeCellProps<T>) {
  const color = colorMap[value] || 'gray'

  const getColorClasses = (color: string) => {
    const colors = {
      gray: variant === 'solid'
        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
      red: variant === 'solid'
        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        : 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-400',
      yellow: variant === 'solid'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        : 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400',
      green: variant === 'solid'
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        : 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-400',
      blue: variant === 'solid'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        : 'border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-400',
      indigo: variant === 'solid'
        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
        : 'border-indigo-300 text-indigo-700 dark:border-indigo-600 dark:text-indigo-400',
      purple: variant === 'solid'
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
        : 'border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-400',
      pink: variant === 'solid'
        ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
        : 'border-pink-300 text-pink-700 dark:border-pink-600 dark:text-pink-400'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      variant === 'outline' ? 'border' : ''
    } ${getColorClasses(color)} ${className}`}>
      {value}
    </span>
  )
}