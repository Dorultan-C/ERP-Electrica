import { NotificationType } from '@/shared/types'

export interface NotificationTheme {
  dotColor: string
}

export const notificationThemes: Record<NotificationType, NotificationTheme> = {
  vacation_request: {
    dotColor: 'bg-blue-600'
  },
  leave_request: {
    dotColor: 'bg-blue-600'
  },
  general: {
    dotColor: 'bg-green-600'
  },
  system_alert: {
    dotColor: 'bg-yellow-600'
  },
  message: {
    dotColor: 'bg-purple-600'
  }
}

export const defaultNotificationTheme: NotificationTheme = {
  dotColor: 'bg-gray-600'
}

export function getNotificationTheme(type: NotificationType): NotificationTheme {
  return notificationThemes[type] || defaultNotificationTheme
}