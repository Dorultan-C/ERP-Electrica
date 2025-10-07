import { ComponentType } from 'react'
import { TimesheetDetailsDrawer } from '@/components/modules/hr/drawers/TimesheetDetailsDrawer'
import { ScheduleDetailsDrawer } from '@/components/modules/hr/drawers/ScheduleDetailsDrawer'
import { UserDetailsDrawer } from '@/components/modules/hr/drawers/UserDetailsDrawer'
import { getTimesheetsWithEmployeeNames, dummySchedules } from '@/data/dummy/hr'
import { dummyUsers } from '@/data/dummy/users'

export interface DrawerContentProps {
  id: string
}

export interface DrawerRegistryEntry {
  component: ComponentType<DrawerContentProps>
  getTitle: (id: string) => string
}

export type DrawerType = 'timesheets' | 'schedules' | 'users'

export const drawerRegistry: Record<DrawerType, DrawerRegistryEntry> = {
  timesheets: {
    component: TimesheetDetailsDrawer,
    getTitle: (id: string) => {
      const timesheets = getTimesheetsWithEmployeeNames()
      const timesheet = timesheets.find(t => t.id === id)
      if (!timesheet) return `Timesheet ${id}`

      const date = new Date(timesheet.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      return `Timesheet ${date}`
    },
  },
  schedules: {
    component: ScheduleDetailsDrawer,
    getTitle: (id: string) => {
      const schedule = dummySchedules.find(s => s.id === id)
      return schedule?.name || `Schedule ${id}`
    },
  },
  users: {
    component: UserDetailsDrawer,
    getTitle: (id: string) => {
      const user = dummyUsers.find(u => u.id === id)
      if (!user) return `User ${id}`
      return `${user.firstName} ${user.lastName}`
    },
  },
}

// Helper to register/update drawer types (for future extensibility)
export function registerDrawer(type: DrawerType, entry: DrawerRegistryEntry) {
  drawerRegistry[type] = entry
}
