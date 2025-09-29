
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'
import { LeaveOfAbsence } from '@/shared/types'

interface LeaveOfAbsenceDetailsDrawerProps {
  loa: LeaveOfAbsence | null
  isOpen: boolean
  onClose: () => void
}

export function LeaveOfAbsenceDetailsDrawer({ loa, isOpen, onClose }: LeaveOfAbsenceDetailsDrawerProps) {
  if (!loa) return null

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Leave of Absence Details">
      <div className="p-6">
        {/* TODO: Implement LOA details */}
        <p>LOA details for {loa.id}</p>
      </div>
    </RightDrawer>
  )
}
