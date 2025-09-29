
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'
import { Schedule } from '@/shared/types'

interface ScheduleDetailsDrawerProps {
  schedule: Schedule | null
  isOpen: boolean
  onClose: () => void
}

export function ScheduleDetailsDrawer({ schedule, isOpen, onClose }: ScheduleDetailsDrawerProps) {
  if (!schedule) return null

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Schedule Details">
      <div className="p-6">
        {/* TODO: Implement schedule details */}
        <p>Schedule details for {schedule.name}</p>
      </div>
    </RightDrawer>
  )
}
