'use client'

import React from 'react'
import { DataListCellProps } from '../types'

interface StackCellProps<T = any> extends Partial<DataListCellProps<T>> {
  children: React.ReactNode
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Stack<T>({ children, spacing = 'sm', className = '' }: StackCellProps<T>) {
  const spacingClasses = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-3'
  }

  return (
    <div className={`flex flex-col ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  )
}

interface GroupCellProps<T = any> extends Partial<DataListCellProps<T>> {
  children: React.ReactNode
  spacing?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function Group<T>({
  children,
  spacing = 'md',
  align = 'center',
  className = ''
}: GroupCellProps<T>) {
  const spacingClasses = {
    sm: 'space-x-1',
    md: 'space-x-2',
    lg: 'space-x-3'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  }

  return (
    <div className={`flex ${alignClasses[align]} ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  )
}