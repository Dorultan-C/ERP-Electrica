// DUMMY DATA - EASILY REMOVABLE
// This file contains dummy user data for prototype development
// TODO: Replace with real API calls in Phase 9 (Backend Integration)

import type { User, UserStatus, EmploymentHistoryEvent } from "../../shared/types/index";

// Employment history events for dummy data
const employmentHistoryEvents: EmploymentHistoryEvent[] = [
  {
    id: "eh1",
    status: "active",
    date: new Date("2023-01-15"),
    notes: "Started as Frontend Developer"
  },
  {
    id: "eh2",
    status: "active",
    date: new Date("2023-06-01"),
    notes: "Promoted to Senior Frontend Developer"
  },
  {
    id: "eh3",
    status: "probation",
    date: new Date("2024-01-10"),
    notes: "Started probation period"
  }
];

// Comprehensive dummy user data
export const dummyUsers: User[] = [
  {
    id: "user-001",
    username: "john.doe",
    email: "john.doe@personal.com",
    workEmail: "john.doe@company.com",
    phoneNumber: "+1-555-0123",
    workPhoneNumber: "+1-555-0100",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Anytown, ST 12345",
    nationalID: "123456789",
    insuranceNumber: "INS123456",
    yearlyVacationDays: 25,
    vacationDaysType: "labouring",
    profileImage: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001", "role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create"]
      }
    ],
    createdAt: new Date("2023-01-15T09:00:00Z")
  },
  {
    id: "user-002",
    username: "jane.smith",
    email: "jane.smith@personal.com",
    workEmail: "jane.smith@company.com",
    phoneNumber: "+1-555-0124",
    workPhoneNumber: "+1-555-0101",
    firstName: "Jane",
    lastName: "Smith",
    address: "456 Oak Ave, Another City, ST 12346",
    nationalID: "987654321",
    insuranceNumber: "INS987654",
    yearlyVacationDays: 30,
    vacationDaysType: "natural",
    profileImage: "https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create", "update"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete", "approve", "reject", "request_changes"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      },
    ],
    createdAt: new Date("2022-03-20T10:15:00Z")
  },
  {
    id: "user-003",
    username: "mike.wilson",
    email: "mike.wilson@personal.com",
    workEmail: "mike.wilson@company.com",
    phoneNumber: "+1-555-0125",
    workPhoneNumber: "+1-555-0102",
    firstName: "Mike",
    lastName: "Wilson",
    address: "789 Pine Rd, Third Town, ST 12347",
    nationalID: "456789123",
    insuranceNumber: "INS456789",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    profileImage: "/images/profiles/mike-wilson.jpg",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2024-01-10T08:00:00Z")
  },

  // Test user with super-user permissions
  {
    id: "user-004",
    username: "super.admin",
    firstName: "Super",
    lastName: "Admin",
    email: "super@company.com",
    workEmail: "super.admin@company.com",
    phoneNumber: "+1-555-0199",
    workPhoneNumber: "+1-555-0199",
    address: "789 Admin Blvd, Admin City, AC 90210, USA",
    nationalID: "111111111",
    insuranceNumber: "INS111111",
    yearlyVacationDays: 30,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "super-user",
        actions: ["true"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2020-01-01T09:00:00Z")
  },

  // Test user with download permissions only
  {
    id: "user-005",
    username: "download.user",
    firstName: "Download",
    lastName: "User",
    email: "download@company.com",
    workEmail: "download.user@company.com",
    phoneNumber: "+1-555-0188",
    workPhoneNumber: "+1-555-0188",
    address: "456 Download St, File City, FC 12345, USA",
    nationalID: "222222222",
    insuranceNumber: "INS222222",
    yearlyVacationDays: 25,
    vacationDaysType: "natural",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "files-downloads-download",
        actions: ["pdf", "docx"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2023-06-01T09:00:00Z")
  },

  // Test user with no permissions
  {
    id: "user-006",
    username: "no.access",
    firstName: "No",
    lastName: "Access",
    email: "noaccess@company.com",
    workEmail: "no.access@company.com",
    phoneNumber: "+1-555-0177",
    workPhoneNumber: "+1-555-0177",
    address: "123 Limited St, Restricted City, RC 54321, USA",
    nationalID: "333333333",
    insuranceNumber: "INS333333",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2024-01-01T09:00:00Z")
  },








  {
    id: "user-007",
    username: "john.doe",
    email: "john.doe@personal.com",
    workEmail: "john.doe@company.com",
    phoneNumber: "+1-555-0123",
    workPhoneNumber: "+1-555-0100",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Anytown, ST 12345",
    nationalID: "123456789",
    insuranceNumber: "INS123456",
    yearlyVacationDays: 25,
    vacationDaysType: "labouring",
    profileImage: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001", "role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create"]
      }
    ],
    createdAt: new Date("2023-01-15T09:00:00Z")
  },
  {
    id: "user-008",
    username: "jane.smith",
    email: "jane.smith@personal.com",
    workEmail: "jane.smith@company.com",
    phoneNumber: "+1-555-0124",
    workPhoneNumber: "+1-555-0101",
    firstName: "Jane",
    lastName: "Smith",
    address: "456 Oak Ave, Another City, ST 12346",
    nationalID: "987654321",
    insuranceNumber: "INS987654",
    yearlyVacationDays: 30,
    vacationDaysType: "natural",
    profileImage: "https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create", "update"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2022-03-20T10:15:00Z")
  },
  {
    id: "user-009",
    username: "mike.wilson",
    email: "mike.wilson@personal.com",
    workEmail: "mike.wilson@company.com",
    phoneNumber: "+1-555-0125",
    workPhoneNumber: "+1-555-0102",
    firstName: "Mike",
    lastName: "Wilson",
    address: "789 Pine Rd, Third Town, ST 12347",
    nationalID: "456789123",
    insuranceNumber: "INS456789",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    profileImage: "/images/profiles/mike-wilson.jpg",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2024-01-10T08:00:00Z")
  },

  // Test user with super-user permissions
  {
    id: "user-010",
    username: "super.admin",
    firstName: "Super",
    lastName: "Admin",
    email: "super@company.com",
    workEmail: "super.admin@company.com",
    phoneNumber: "+1-555-0199",
    workPhoneNumber: "+1-555-0199",
    address: "789 Admin Blvd, Admin City, AC 90210, USA",
    nationalID: "111111111",
    insuranceNumber: "INS111111",
    yearlyVacationDays: 30,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "super-user",
        actions: ["true"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2020-01-01T09:00:00Z")
  },

  // Test user with download permissions only
  {
    id: "user-011",
    username: "download.user",
    firstName: "Download",
    lastName: "User",
    email: "download@company.com",
    workEmail: "download.user@company.com",
    phoneNumber: "+1-555-0188",
    workPhoneNumber: "+1-555-0188",
    address: "456 Download St, File City, FC 12345, USA",
    nationalID: "222222222",
    insuranceNumber: "INS222222",
    yearlyVacationDays: 25,
    vacationDaysType: "natural",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "files-downloads-download",
        actions: ["pdf", "docx"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2023-06-01T09:00:00Z")
  },

  // Test user with no permissions
  {
    id: "user-012",
    username: "no.access",
    firstName: "No",
    lastName: "Access",
    email: "noaccess@company.com",
    workEmail: "no.access@company.com",
    phoneNumber: "+1-555-0177",
    workPhoneNumber: "+1-555-0177",
    address: "123 Limited St, Restricted City, RC 54321, USA",
    nationalID: "333333333",
    insuranceNumber: "INS333333",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2024-01-01T09:00:00Z")
  },
  {
    id: "user-013",
    username: "john.doe",
    email: "john.doe@personal.com",
    workEmail: "john.doe@company.com",
    phoneNumber: "+1-555-0123",
    workPhoneNumber: "+1-555-0100",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Anytown, ST 12345",
    nationalID: "123456789",
    insuranceNumber: "INS123456",
    yearlyVacationDays: 25,
    vacationDaysType: "labouring",
    profileImage: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001", "role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create"]
      }
    ],
    createdAt: new Date("2023-01-15T09:00:00Z")
  },
  {
    id: "user-014",
    username: "jane.smith",
    email: "jane.smith@personal.com",
    workEmail: "jane.smith@company.com",
    phoneNumber: "+1-555-0124",
    workPhoneNumber: "+1-555-0101",
    firstName: "Jane",
    lastName: "Smith",
    address: "456 Oak Ave, Another City, ST 12346",
    nationalID: "987654321",
    insuranceNumber: "INS987654",
    yearlyVacationDays: 30,
    vacationDaysType: "natural",
    profileImage: "https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create", "update"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2022-03-20T10:15:00Z")
  },
  {
    id: "user-015",
    username: "mike.wilson",
    email: "mike.wilson@personal.com",
    workEmail: "mike.wilson@company.com",
    phoneNumber: "+1-555-0125",
    workPhoneNumber: "+1-555-0102",
    firstName: "Mike",
    lastName: "Wilson",
    address: "789 Pine Rd, Third Town, ST 12347",
    nationalID: "456789123",
    insuranceNumber: "INS456789",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    profileImage: "/images/profiles/mike-wilson.jpg",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2024-01-10T08:00:00Z")
  },

  // Test user with super-user permissions
  {
    id: "user-016",
    username: "super.admin",
    firstName: "Super",
    lastName: "Admin",
    email: "super@company.com",
    workEmail: "super.admin@company.com",
    phoneNumber: "+1-555-0199",
    workPhoneNumber: "+1-555-0199",
    address: "789 Admin Blvd, Admin City, AC 90210, USA",
    nationalID: "111111111",
    insuranceNumber: "INS111111",
    yearlyVacationDays: 30,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "super-user",
        actions: ["true"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2020-01-01T09:00:00Z")
  },

  // Test user with download permissions only
  {
    id: "user-017",
    username: "download.user",
    firstName: "Download",
    lastName: "User",
    email: "download@company.com",
    workEmail: "download.user@company.com",
    phoneNumber: "+1-555-0188",
    workPhoneNumber: "+1-555-0188",
    address: "456 Download St, File City, FC 12345, USA",
    nationalID: "222222222",
    insuranceNumber: "INS222222",
    yearlyVacationDays: 25,
    vacationDaysType: "natural",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "files-downloads-download",
        actions: ["pdf", "docx"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2023-06-01T09:00:00Z")
  },

  // Test user with no permissions
  {
    id: "user-018",
    username: "no.access",
    firstName: "No",
    lastName: "Access",
    email: "noaccess@company.com",
    workEmail: "no.access@company.com",
    phoneNumber: "+1-555-0177",
    workPhoneNumber: "+1-555-0177",
    address: "123 Limited St, Restricted City, RC 54321, USA",
    nationalID: "333333333",
    insuranceNumber: "INS333333",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2024-01-01T09:00:00Z")
  },
  {
    id: "user-019",
    username: "john.doe",
    email: "john.doe@personal.com",
    workEmail: "john.doe@company.com",
    phoneNumber: "+1-555-0123",
    workPhoneNumber: "+1-555-0100",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Anytown, ST 12345",
    nationalID: "123456789",
    insuranceNumber: "INS123456",
    yearlyVacationDays: 25,
    vacationDaysType: "labouring",
    profileImage: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001", "role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create"]
      }
    ],
    createdAt: new Date("2023-01-15T09:00:00Z")
  },
  {
    id: "user-020",
    username: "jane.smith",
    email: "jane.smith@personal.com",
    workEmail: "jane.smith@company.com",
    phoneNumber: "+1-555-0124",
    workPhoneNumber: "+1-555-0101",
    firstName: "Jane",
    lastName: "Smith",
    address: "456 Oak Ave, Another City, ST 12346",
    nationalID: "987654321",
    insuranceNumber: "INS987654",
    yearlyVacationDays: 30,
    vacationDaysType: "natural",
    profileImage: "https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create", "update"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2022-03-20T10:15:00Z")
  },
  {
    id: "user-021",
    username: "mike.wilson",
    email: "mike.wilson@personal.com",
    workEmail: "mike.wilson@company.com",
    phoneNumber: "+1-555-0125",
    workPhoneNumber: "+1-555-0102",
    firstName: "Mike",
    lastName: "Wilson",
    address: "789 Pine Rd, Third Town, ST 12347",
    nationalID: "456789123",
    insuranceNumber: "INS456789",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    profileImage: "/images/profiles/mike-wilson.jpg",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2024-01-10T08:00:00Z")
  },

  // Test user with super-user permissions
  {
    id: "user-022",
    username: "super.admin",
    firstName: "Super",
    lastName: "Admin",
    email: "super@company.com",
    workEmail: "super.admin@company.com",
    phoneNumber: "+1-555-0199",
    workPhoneNumber: "+1-555-0199",
    address: "789 Admin Blvd, Admin City, AC 90210, USA",
    nationalID: "111111111",
    insuranceNumber: "INS111111",
    yearlyVacationDays: 30,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "super-user",
        actions: ["true"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2020-01-01T09:00:00Z")
  },

  // Test user with download permissions only
  {
    id: "user-023",
    username: "download.user",
    firstName: "Download",
    lastName: "User",
    email: "download@company.com",
    workEmail: "download.user@company.com",
    phoneNumber: "+1-555-0188",
    workPhoneNumber: "+1-555-0188",
    address: "456 Download St, File City, FC 12345, USA",
    nationalID: "222222222",
    insuranceNumber: "INS222222",
    yearlyVacationDays: 25,
    vacationDaysType: "natural",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "files-downloads-download",
        actions: ["pdf", "docx"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "update", "read"]
      }
    ],
    createdAt: new Date("2023-06-01T09:00:00Z")
  },

  // Test user with no permissions
  {
    id: "user-024",
    username: "no.access",
    firstName: "No",
    lastName: "Access",
    email: "noaccess@company.com",
    workEmail: "no.access@company.com",
    phoneNumber: "+1-555-0177",
    workPhoneNumber: "+1-555-0177",
    address: "123 Limited St, Restricted City, RC 54321, USA",
    nationalID: "333333333",
    insuranceNumber: "INS333333",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    status: "active",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2024-01-01T09:00:00Z")
  },

  // Manager with timesheet approval permissions
  {
    id: "user-manager",
    username: "manager.smith",
    firstName: "Manager",
    lastName: "Smith",
    email: "manager@company.com",
    workEmail: "manager.smith@company.com",
    phoneNumber: "+1-555-0200",
    workPhoneNumber: "+1-555-0200",
    address: "100 Management Ave, Boss City, BC 90001, USA",
    nationalID: "999999999",
    insuranceNumber: "INS999999",
    yearlyVacationDays: 35,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-manager"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-others",
        actions: ["create", "read", "update", "delete", "approve", "reject", "request_changes"]
      },
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2020-06-01T09:00:00Z")
  }
];

// Helper function to get user by ID
export const getDummyUserById = (id: string): User | undefined => {
  return dummyUsers.find(user => user.id === id);
};

// Helper function to get users by status
export const getDummyUsersByStatus = (status: UserStatus): User[] => {
  return dummyUsers.filter(user => user.status === status);
};

// Helper function to get active users count
export const getActiveDummyUsersCount = (): number => {
  return dummyUsers.filter(user => user.status === "active").length;
};

// Helper function to search users by name
export const searchDummyUsers = (query: string): User[] => {
  const lowercaseQuery = query.toLowerCase();
  return dummyUsers.filter(user =>
    user.firstName.toLowerCase().includes(lowercaseQuery) ||
    user.lastName.toLowerCase().includes(lowercaseQuery) ||
    user.username.toLowerCase().includes(lowercaseQuery) ||
    (user.workEmail?.toLowerCase().includes(lowercaseQuery) ?? false)
  );
};