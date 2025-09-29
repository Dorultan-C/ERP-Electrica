
'use client'

import { RightDrawer } from '@/components/ui/RightDrawer'
import { Schedule } from '@/shared/types'

interface ScheduleFormDrawerProps {
  schedule?: Schedule | null
  isOpen: boolean
  onClose: () => void
}

export function ScheduleFormDrawer({ schedule, isOpen, onClose }: ScheduleFormDrawerProps) {
  const title = schedule ? 'Edit Schedule' : 'Add Schedule'

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        {/* TODO: Implement schedule form */}
        <p>Schedule form</p>
      </div>
    </RightDrawer>
  )
}
