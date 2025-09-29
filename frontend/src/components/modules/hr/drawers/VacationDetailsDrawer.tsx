
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'
import { Vacation } from '@/shared/types'

interface VacationDetailsDrawerProps {
  vacation: Vacation | null
  isOpen: boolean
  onClose: () => void
}

export function VacationDetailsDrawer({ vacation, isOpen, onClose }: VacationDetailsDrawerProps) {
  if (!vacation) return null

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Vacation Details">
      <div className="p-6">
        {/* TODO: Implement vacation details */}
        <p>Vacation details for {vacation.id}</p>
      </div>
    </RightDrawer>
  )
}
