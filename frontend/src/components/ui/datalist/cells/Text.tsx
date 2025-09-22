'use client'

import React from 'react'
import { DataListCellProps } from '../types'

interface TextCellProps<T = any> extends Partial<DataListCellProps<T>> {
  value?: any
  fallback?: string
  className?: string
}

export function Text<T>({ value, fallback = '-', className = '' }: TextCellProps<T>) {
  return (
    <div className={`text-gray-900 dark:text-white ${className}`}>
      {value || fallback}
    </div>
  )
}

export function Subtitle<T>({ value, fallback = '', className = '' }: TextCellProps<T>) {
  if (!value && !fallback) return null

  return (
    <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {value || fallback}
    </div>
  )
}