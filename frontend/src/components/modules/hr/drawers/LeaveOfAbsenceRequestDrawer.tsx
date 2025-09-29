
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'

interface LeaveOfAbsenceRequestDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function LeaveOfAbsenceRequestDrawer({ isOpen, onClose }: LeaveOfAbsenceRequestDrawerProps) {
  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Request Leave of Absence">
      <div className="p-6">
        {/* TODO: Implement LOA request form */}
        <p>LOA request form</p>
      </div>
    </RightDrawer>
  )
}
