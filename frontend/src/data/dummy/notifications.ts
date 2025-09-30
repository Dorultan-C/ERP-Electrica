// DUMMY DATA - EASILY REMOVABLE
// Dummy notifications data for development and prototyping
// TODO: Remove this file in Phase 9 (Backend Integration)

import { Notification } from '@/shared/types'

export const dummyNotifications: Notification[] = [
  {
    id: 'vacation-1',
    userId: 'user-1',
    title: 'New vacation request',
    message: 'John Doe has requested vacation from March 15-20',
    type: 'vacation_request',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'timesheet-1',
    userId: 'user-1',
    title: 'Timesheet approved',
    message: 'Your timesheet for week 11 has been approved',
    type: 'general',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 'maintenance-1',
    userId: 'user-1',
    title: 'System maintenance',
    message: 'Scheduled maintenance on Sunday at 02:00',
    type: 'system_alert',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'test-1',
    userId: 'user-1',
    title: 'Test Not If I Cation',
    message: 'This is a test notification',
    type: 'general',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
]

