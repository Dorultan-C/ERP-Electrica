
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'
import { User } from '@/shared/types'
import { Avatar } from '@/components/ui/Avatar'

interface UserDetailsDrawerProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsDrawer({ user, isOpen, onClose }: UserDetailsDrawerProps) {
  if (!user) return null

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            fallback={`${user.firstName[0]}${user.lastName[0]}`}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.workEmail}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm">
              Status
            </h3>
            <p className="text-gray-900 dark:text-white capitalize">{user.status}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm">
              Phone Number
            </h3>
            <p className="text-gray-900 dark:text-white">{user.workPhoneNumber}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm">
              Roles
            </h3>
            <p className="text-gray-900 dark:text-white">{user.roleIds.join(', ')}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm">
              Member Since
            </h3>
            <p className="text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded">
            Edit User
          </button>
        </div>
      </div>
    </RightDrawer>
  )
}
