'use client'

import React from 'react'
import { DataListCellProps } from '../types'
import { Avatar as SharedAvatar } from '../../Avatar'

interface AvatarCellProps<T = any> extends Partial<DataListCellProps<T>> {
  src?: string | undefined
  fallback?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'
  alt?: string
  className?: string
  name?: string
}

export function Avatar<T>({
  value,
  data: _data,
  src,
  fallback,
  size = 'md',
  alt,
  className = '',
  name
}: AvatarCellProps<T>) {
  const imageSrc = src || value

  // Determine display name for consistent avatar generation
  const displayName = name || '?'

  return (
    <SharedAvatar
      src={imageSrc}
      name={displayName}
      size={size}
      alt={alt}
      className={className}
      fallback={fallback}
    />
  )
}