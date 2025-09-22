'use client'

import React, { useState, useEffect } from 'react'
import { getInitials, getAvatarColor, getAvatarTextColor } from '@/shared/utils'

interface AvatarProps {
  src?: string | undefined
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'
  alt?: string | undefined
  className?: string
  fallback?: React.ReactNode
}

export function Avatar({
  src,
  name = '?',
  size = 'md',
  alt,
  className = '',
  fallback
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  // Reset image error when src changes
  useEffect(() => {
    setImageError(false)
  }, [src])

  // Don't show image if there's an error or no src
  const shouldShowImage = src && !imageError

  // Avatar utilities for consistent styling
  const initials = getInitials(name)
  const avatarColor = getAvatarColor(name)
  const avatarTextColor = getAvatarTextColor(name)

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    small: 'w-9 h-9',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-xl font-medium',
    md: 'text-2xl font-medium',
    lg: 'text-3xl font-medium',
    small: 'text-xl font-medium',
    medium: 'text-2xl font-medium',
    large: 'text-3xl font-medium'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}>
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : fallback ? (
        fallback
      ) : (
        <div className={`w-full h-full ${avatarColor} flex items-center justify-center ${avatarTextColor} ${textSizeClasses[size]}`}>
          {initials}
        </div>
      )}
    </div>
  )
}