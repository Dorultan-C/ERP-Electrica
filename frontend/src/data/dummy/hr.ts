// DUMMY DATA - EASILY REMOVABLE
// This file contains dummy HR data for prototype development
// TODO: Replace with real API calls in Phase 9 (Backend Integration)

import type {
  Vacation,
  VacationStatus,
  LeaveOfAbsence,
  Timesheet,
  TimesheetStatus,
  Break,
  PublicHoliday,
  ClosingDay,
  VacationListItem,
  LOAListItem,
  VacationStats,
  AttendanceStats
} from "../../shared/types/hr";

import type { Message } from "../../shared/types/common";

import type { Schedule } from "../../shared/types/index";

// Dummy Messages
export const dummyMessages: Message[] = [
  {
    id: "msg-001",
    userId: "user-001",
    text: "Can I extend my vacation by one more day?",
    date: new Date("2024-01-15T10:30:00Z"),
    isAnswered: false
  },
  {
    id: "msg-002",
    userId: "user-002",
    text: "Medical certificate attached for sick leave",
    date: new Date("2024-01-20T14:15:00Z"),
    isAnswered: true
  }
];

// Dummy Vacations
export const dummyVacations: Vacation[] = [
  {
    id: "vac-001",
    userId: "user-001",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-02-20"),
    days: 4,
    status: "pending",
    messages: [dummyMessages[0]!],
    requestedAt: new Date("2024-01-15T09:00:00Z"),
    reviewedBy: "user-002",
    reviewedAt: new Date("2024-01-16T11:30:00Z")
  },
  {
    id: "vac-002",
    userId: "user-002",
    startDate: new Date("2025-09-08"),
    endDate: new Date("2025-09-19"),
    days: 5,
    status: "approved",
    requestedAt: new Date("2024-01-10T14:20:00Z"),
    reviewedBy: "user-001",
    reviewedAt: new Date("2024-01-12T10:45:00Z")
  },
  {
    id: "vac-003",
    userId: "user-003",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-01-22"),
    days: 2,
    status: "rejected",
    requestedAt: new Date("2024-01-18T16:00:00Z"),
    reviewedBy: "user-001",
    reviewedAt: new Date("2024-01-19T09:15:00Z")
  },
  {
    id: "vac-004",
    userId: "user-004",
    startDate: new Date("2023-12-20"),
    endDate: new Date("2023-12-30"),
    days: 8,
    status: "withdrawn",
    requestedAt: new Date("2023-11-15T13:30:00Z")
  }
];

// Dummy Leave of Absence
export const dummyLOAs: LeaveOfAbsence[] = [
  /* {
    id: "loa-001",
    userId: "user-002",
    type: "medical",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-09-25"),
    status: "approved",
    documents: ["medical-cert-001.pdf"],
    messages: [dummyMessages[1]!],
    requestedAt: new Date("2024-01-20T08:00:00Z"),
    reviewedBy: "user-001",
    reviewedAt: new Date("2024-01-22T15:30:00Z")
  }, */
  {
    id: "loa-002",
    userId: "user-003",
    type: "family_emergency",
    startDate: new Date("2024-01-25"),
    status: "pending",
    requestedAt: new Date("2024-01-24T19:45:00Z")
  },
  {
    id: "loa-003",
    userId: "user-005",
    type: "educational",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-05-31"),
    status: "rejected",
    requestedAt: new Date("2024-01-10T12:00:00Z"),
    reviewedBy: "user-001",
    reviewedAt: new Date("2024-01-15T14:20:00Z")
  }
];

// Dummy Breaks
export const dummyBreaks: Break[] = [
  {
    id: "break-001",
    startTime: new Date("2024-01-22T12:00:00Z"),
    endTime: new Date("2024-01-22T13:00:00Z"),
    totalMinutes: 60
  },
  {
    id: "break-002",
    startTime: new Date("2024-01-22T15:30:00Z"),
    endTime: new Date("2024-01-22T15:45:00Z"),
    totalMinutes: 15
  }
];

// Dummy Timesheets
export const dummyTimesheets: Timesheet[] = [
  {
    id: "ts-001",
    userId: "user-002",
    date: new Date("2025-10-01"),
    startTime: new Date("2025-09-25T09:00:00Z"),
    endTime: new Date("2025-09-25T17:30:00Z"),
    breaks: [dummyBreaks[0]!, dummyBreaks[1]!],
    totalMinutes: 435, // 7h 15m
    regularMinutes: 435,
    overtimeMinutes: 0,
    breakMinutes: 75,
    status: "approved",
    reviewedBy: "user-002",
    reviewedAt: new Date("2024-01-23T10:00:00Z")
  },
  {
    id: "ts-002",
    userId: "user-002",
    date: new Date("2024-01-22"),
    startTime: new Date("2024-01-22T08:30:00Z"),
    endTime: new Date("2024-01-22T18:00:00Z"),
    breaks: [dummyBreaks[0]!],
    totalMinutes: 510, // 8h 30m
    regularMinutes: 480, // 8h
    overtimeMinutes: 30,
    breakMinutes: 60,
    status: "pending",
    messages: []
  },
  {
    id: "ts-003",
    userId: "user-003",
    date: new Date("2024-01-21"),
    totalMinutes: 0,
    regularMinutes: 0,
    overtimeMinutes: 0,
    breakMinutes: 0,
    status: "requires_modification"
  },
  {
    id: "ts-004",
    userId: "user-002",
    date: new Date("2025-09-22"),
    startTime: new Date("2025-09-22T06:00:00Z"),
    endTime: new Date("2025-09-22T15:00:00Z"),
    breaks: [
      {
        id: "break-004",
        startTime: new Date("2025-09-22T11:00:00Z"),
        endTime: new Date("2025-09-22T12:00:00Z"),
        totalMinutes: 60
      },
      {
        id: "break-005",
        startTime: new Date("2025-09-22T08:30:00Z"),
        endTime: new Date("2025-09-22T08:45:00Z"),
        totalMinutes: 15
      }
    ],
    totalMinutes: 540,
    regularMinutes: 480,
    overtimeMinutes: 0,
    breakMinutes: 60,
    status: "requires_modification",
    reviewedBy: "user-001",
    reviewedAt: new Date("2025-09-23T10:00:00Z"),
    messages: [
      {
        id: "msg-001",
        userId: "user-001",
        text: "Please double-check your break times. The 15-minute break at 8:30 AM seems to overlap with your work start time.",
        date: new Date("2025-09-23T10:00:00Z"),
        isAnswered: false
      },
      {
        id: "msg-002",
        userId: "user-002",
        text: "You're right, I took a quick coffee break after clocking in. Should I adjust the start time or remove this break?",
        date: new Date("2025-09-23T14:30:00Z"),
        isAnswered: false
      },
      {
        id: "msg-003",
        userId: "user-001",
        text: "Please adjust your start time to 6:00 AM and keep the break. That way your hours will be accurate.",
        date: new Date("2025-09-23T15:45:00Z"),
        isAnswered: true
      }
    ]
  },

  // More pending timesheets for approval workflow testing
  {
    id: "ts-005",
    userId: "user-001",
    date: new Date("2025-09-24"),
    startTime: new Date("2025-09-24T08:30:00Z"),
    endTime: new Date("2025-09-24T17:00:00Z"),
    breaks: [
      {
        id: "break-006",
        startTime: new Date("2025-09-24T12:00:00Z"),
        endTime: new Date("2025-09-24T12:30:00Z"),
        totalMinutes: 30
      }
    ],
    totalMinutes: 480,
    regularMinutes: 480,
    overtimeMinutes: 0,
    breakMinutes: 30,
    status: "pending"
  },
  {
    id: "ts-006",
    userId: "user-003",
    date: new Date("2025-09-23"),
    startTime: new Date("2025-09-23T09:15:00Z"),
    endTime: new Date("2025-09-23T17:45:00Z"),
    breaks: [
      {
        id: "break-007",
        startTime: new Date("2025-09-23T12:30:00Z"),
        endTime: new Date("2025-09-23T13:15:00Z"),
        totalMinutes: 45
      }
    ],
    totalMinutes: 465,
    regularMinutes: 465,
    overtimeMinutes: 0,
    breakMinutes: 45,
    status: "pending"
  },
  {
    id: "ts-007",
    userId: "user-005",
    date: new Date("2025-09-21"),
    startTime: new Date("2025-09-21T08:00:00Z"),
    endTime: new Date("2025-09-21T16:30:00Z"),
    breaks: [
      {
        id: "break-008",
        startTime: new Date("2025-09-21T12:00:00Z"),
        endTime: new Date("2025-09-21T13:00:00Z"),
        totalMinutes: 60
      }
    ],
    totalMinutes: 450,
    regularMinutes: 450,
    overtimeMinutes: 0,
    breakMinutes: 60,
    status: "approved",
    reviewedBy: "user-002",
    reviewedAt: new Date("2025-09-22T09:00:00Z")
  }
];

// Dummy Public Holidays
export const dummyPublicHolidays: PublicHoliday[] = [
  {
    id: "ph-001",
    name: "Fiesta mayor",
    date: new Date("2025-09-25")
  },
  {
    id: "ph-002",
    name: "Independence Day",
    date: new Date("2024-07-04")
  },
  {
    id: "ph-003",
    name: "Christmas Day",
    date: new Date("2024-12-25")
  }
];

// Dummy Closing Days
export const dummyClosingDays: ClosingDay[] = [
  {
    id: "cd-001",
    startDate: new Date("2025-09-22"),
    endDate: new Date("2025-09-25"),
    description: "Christmas Closing"
  },
  {
    id: "cd-002",
    startDate: new Date("2024-08-15"),
    endDate: new Date("2024-08-16"),
    description: "Company retreat days"
  }
];

// Dummy Schedules (referenced by modules)
export const dummySchedules: Schedule[] = [
  {
    id: "schedule-001",
    name: "Standard Office Hours",
    description: "Monday to Friday, 09:00 to 17:00",
    weekSchedule: [
      {
        id: "sd-001",
        dayOfWeek: 1, // Monday
        startTime: "09:00",
        endTime: "17:00",
        labouringMinutes: 480, // 8 hours
        allowedBrakeMinutes: 60  // 1 hour lunch
      },
      {
        id: "sd-002",
        dayOfWeek: 2, // Tuesday
        startTime: "09:00",
        endTime: "17:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      },
      {
        id: "sd-003",
        dayOfWeek: 3, // Wednesday
        startTime: "09:00",
        endTime: "17:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 10
      },
      {
        id: "sd-004",
        dayOfWeek: 4, // Thursday
        startTime: "09:00",
        endTime: "17:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      },
      {
        id: "sd-005",
        dayOfWeek: 5, // Friday
        startTime: "09:00",
        endTime: "17:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      }
    ]
  },
  {
    id: "schedule-002",
    name: "Flexible Hours",
    description: "Monday to Friday, 08:00 to 16:00",
    weekSchedule: [
      {
        id: "sd-006",
        dayOfWeek: 1, // Monday
        startTime: "08:00",
        endTime: "16:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      },
      {
        id: "sd-007",
        dayOfWeek: 2, // Tuesday
        startTime: "08:00",
        endTime: "16:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      },
      {
        id: "sd-008",
        dayOfWeek: 3, // Wednesday
        startTime: "08:00",
        endTime: "16:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      },
      {
        id: "sd-009",
        dayOfWeek: 4, // Thursday
        startTime: "08:00",
        endTime: "16:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      },
      {
        id: "sd-010",
        dayOfWeek: 5, // Friday
        startTime: "08:00",
        endTime: "16:00",
        labouringMinutes: 480,
        allowedBrakeMinutes: 60
      }
    ]
  }
];

// Dummy List Items for UI components
export const dummyVacationListItems: VacationListItem[] = [
  {
    id: "vac-001",
    userId: "user-001",
    employeeName: "John Doe",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-02-20"),
    days: 4,
    status: "pending",
    requestedAt: new Date("2024-01-15T09:00:00Z")
  },
  {
    id: "vac-002",
    userId: "user-002",
    employeeName: "Jane Smith",
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-03-15"),
    days: 5,
    status: "approved",
    requestedAt: new Date("2024-01-10T14:20:00Z")
  }
];

export const dummyLOAListItems: LOAListItem[] = [
  {
    id: "loa-001",
    userId: "user-002",
    employeeName: "Jane Smith",
    type: "medical",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-28"),
    status: "approved",
    requestedAt: new Date("2024-01-20T08:00:00Z")
  },
  {
    id: "loa-002",
    userId: "user-003",
    employeeName: "Mike Wilson",
    type: "family_emergency",
    startDate: new Date("2024-01-25"),
    status: "pending",
    requestedAt: new Date("2024-01-24T19:45:00Z")
  }
];


// Dummy Statistics
export const dummyVacationStats: VacationStats = {
  totalRequests: 12,
  pendingRequests: 3,
  approvedRequests: 7,
  rejectedRequests: 2,
  totalDaysRequested: 45
};

export const dummyAttendanceStats: AttendanceStats = {
  totalEmployees: 6,
  presentToday: 4,
  absentToday: 1,
  lateToday: 1,
  averageAttendanceRate: 87.5
};

// Helper functions for dummy data
export const getDummyVacationById = (id: string): Vacation | undefined => {
  return dummyVacations.find(vacation => vacation.id === id);
};

export const getDummyVacationsByUserId = (userId: string): Vacation[] => {
  return dummyVacations.filter(vacation => vacation.userId === userId);
};

export const getDummyVacationsByStatus = (status: VacationStatus): Vacation[] => {
  return dummyVacations.filter(vacation => vacation.status === status);
};

export const getDummyLOAById = (id: string): LeaveOfAbsence | undefined => {
  return dummyLOAs.find(loa => loa.id === id);
};

export const getDummyLOAsByUserId = (userId: string): LeaveOfAbsence[] => {
  return dummyLOAs.filter(loa => loa.userId === userId);
};

export const getDummyTimesheetById = (id: string): Timesheet | undefined => {
  return dummyTimesheets.find(timesheet => timesheet.id === id);
};

export const getDummyTimesheetsByUserId = (userId: string): Timesheet[] => {
  return dummyTimesheets.filter(timesheet => timesheet.userId === userId);
};

export const getDummyTimesheetsByStatus = (status: TimesheetStatus): Timesheet[] => {
  return dummyTimesheets.filter(timesheet => timesheet.status === status);
};

// Helper function to get timesheets with employee names populated
export const getTimesheetsWithEmployeeNames = (): Timesheet[] => {
  const { dummyUsers } = require('./users');
  return dummyTimesheets.map(timesheet => ({
    ...timesheet,
    employeeName: (() => {
      const user = dummyUsers.find((u: any) => u.id === timesheet.userId);
      return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    })()
  }));
};