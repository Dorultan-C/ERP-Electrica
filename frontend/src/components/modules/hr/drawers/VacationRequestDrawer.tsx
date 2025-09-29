
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'

interface VacationRequestDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function VacationRequestDrawer({ isOpen, onClose }: VacationRequestDrawerProps) {
  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Request Vacation">
      <div className="p-6">
        {/* TODO: Implement vacation request form */}
        <p>Vacation request form</p>
      </div>
    </RightDrawer>
  )
}
