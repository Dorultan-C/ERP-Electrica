/**
 * Avatar utility functions for generating user initials and colors
 */

/**
 * Generate user initials from full name
 */
export function getInitials(name: string): string {
  if (!name) return '??' // Unknown User

  const names = name.trim().split(' ').filter(n => n.length > 0)
  if (names.length === 0) return '??'

  if (names.length === 1) {
    const singleName = names[0]!
    return singleName.length >= 2 ? singleName.substring(0, 2).toUpperCase() : singleName.toUpperCase()
  }

  const firstInitial = names[0]?.[0] || ''
  const lastInitial = names[names.length - 1]?.[0] || ''
  return (firstInitial + lastInitial).toUpperCase()
}

/**
 * Generate a consistent color for a user based on their name
 * Returns Tailwind CSS background color classes
 * Uses subtle colors that match the app's design tone
 */
export function getAvatarColor(name: string): string {
  if (!name) return 'bg-gray-400'

  const colors = [
    'bg-red-200',
    'bg-orange-200',
    'bg-yellow-200',
    'bg-lime-200',
    'bg-green-200',
    'bg-teal-200',
    'bg-cyan-200',
    'bg-sky-200',
    'bg-violet-200',
    'bg-fuchsia-200',
    'bg-rose-200'
  ]

  // Generate consistent hash from name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length] || 'bg-gray-400'
}

/**
 * Generate a matching text color for the avatar background
 * Returns a darker shade of the same color for better contrast
 */
export function getAvatarTextColor(name: string): string {
  if (!name) return 'text-gray-600'

  const textColors = [
    'text-red-600',
    'text-orange-600',
    'text-yellow-600',
    'text-lime-700',
    'text-green-700',
    'text-teal-700',
    'text-cyan-700',
    'text-sky-700',
    'text-violet-700',
    'text-fuchsia-700',
    'text-rose-700'
  ]

  // Use the same hash logic to ensure matching color families
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return textColors[Math.abs(hash) % textColors.length] || 'text-gray-700'
}