// DUMMY DATA - EASILY REMOVABLE
// This file contains dummy user data for prototype development
// TODO: Replace with real API calls in Phase 9 (Backend Integration)

import type { User, UserStatus, EmploymentHistoryEvent, EmergencyContact } from "../../shared/types/index";

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
    date: new Date("2025-05-30"),
    notes: "Promoted to Senior Frontend Developer"
  },
  {
    id: "eh3",
    status: "probation",
    date: new Date("2024-01-10"),
    notes: "Started probation period"
  },
  {
    id: "eh4",
    status: "active",
    date: new Date("2022-03-01"),
    notes: "Started as Backend Developer"
  },
  {
    id: "eh5",
    status: "active",
    date: new Date("2021-09-15"),
    notes: "Started as UI/UX Designer"
  },
  {
    id: "eh6",
    status: "active",
    date: new Date("2020-11-01"),
    notes: "Started as Project Manager"
  }
];

// Comprehensive dummy user data with 30 unique users
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
    birthDate: new Date("1990-05-15"),
    clothingSizes: {
      shoe: 42,
      shirt: "L",
      trousers: 44,
      jacket: "L",
      gloves: 9
    },
    emergencyContact: {
      id: "ec-001",
      firstName: "Mary",
      lastName: "Doe",
      phoneNumber: "+1-555-9999",
      email: "mary.doe@email.com"
    },
    yearlyVacationDays: 25,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!, employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001", "role-002"],
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["read", "create"]
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
    birthDate: new Date("1988-11-22"),
    emergencyContact: {
      id: "ec-002",
      firstName: "Robert",
      lastName: "Smith",
      phoneNumber: "+1-555-8888",
      email: "robert.smith@email.com"
    },
    yearlyVacationDays: 30,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300&h=300&fit=crop&crop=face",
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
        actions: ["message", "create", "approve", "update_approved", "read", "delete_approved", "update"]
      },
      {
        permissionId: "hr-schedules-manage",
        actions: ["read"]
      },
      {
        permissionId: "hr-attendance-manage-others",
        actions: ["message", "read", "create", "update", "delete", "approve", "request_changes", "update_approved", "delete_approved"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      },
      {
        permissionId: "hr-users-permissions-others",
        actions: ["read_own"]
      }
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
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
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
  {
    id: "user-004",
    username: "sarah.johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@personal.com",
    workEmail: "sarah.johnson@company.com",
    phoneNumber: "+1-555-0126",
    workPhoneNumber: "+1-555-0103",
    address: "321 Elm Street, Springfield, ST 62701",
    nationalID: "789123456",
    insuranceNumber: "INS789123",
    yearlyVacationDays: 28,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[4]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2021-09-15T09:00:00Z")
  },
  {
    id: "user-005",
    username: "david.brown",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@personal.com",
    workEmail: "david.brown@company.com",
    phoneNumber: "+1-555-0127",
    workPhoneNumber: "+1-555-0104",
    address: "654 Maple Ave, Portland, OR 97201",
    nationalID: "321654987",
    insuranceNumber: "INS321654",
    yearlyVacationDays: 22,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[3]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2022-03-01T08:30:00Z")
  },
  {
    id: "user-006",
    username: "lisa.garcia",
    firstName: "Lisa",
    lastName: "Garcia",
    email: "lisa.garcia@personal.com",
    workEmail: "lisa.garcia@company.com",
    phoneNumber: "+1-555-0128",
    workPhoneNumber: "+1-555-0105",
    address: "987 Cedar Ln, Austin, TX 78701",
    nationalID: "654987321",
    insuranceNumber: "INS654987",
    yearlyVacationDays: 26,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[5]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2020-11-01T10:00:00Z")
  },
  {
    id: "user-007",
    username: "alex.martinez",
    firstName: "Alex",
    lastName: "Martinez",
    email: "alex.martinez@personal.com",
    workEmail: "alex.martinez@company.com",
    phoneNumber: "+1-555-0129",
    workPhoneNumber: "+1-555-0106",
    address: "147 Oak St, Denver, CO 80201",
    nationalID: "147258369",
    insuranceNumber: "INS147258",
    yearlyVacationDays: 24,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2023-05-12T09:15:00Z")
  },
  {
    id: "user-008",
    username: "emma.davis",
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@personal.com",
    workEmail: "emma.davis@company.com",
    phoneNumber: "+1-555-0130",
    workPhoneNumber: "+1-555-0107",
    address: "258 Pine St, Seattle, WA 98101",
    nationalID: "258369147",
    insuranceNumber: "INS258369",
    yearlyVacationDays: 29,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300&h=300&fit=crop&crop=face",
    status: "terminated",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [],
    createdAt: new Date("2023-02-08T11:30:00Z")
  },
  {
    id: "user-009",
    username: "ryan.thompson",
    firstName: "Ryan",
    lastName: "Thompson",
    email: "ryan.thompson@personal.com",
    workEmail: "ryan.thompson@company.com",
    phoneNumber: "+1-555-0131",
    workPhoneNumber: "+1-555-0108",
    address: "369 Birch Ave, Boston, MA 02101",
    nationalID: "369147258",
    insuranceNumber: "INS369147",
    yearlyVacationDays: 21,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read"]
      }
    ],
    createdAt: new Date("2024-02-15T08:45:00Z")
  },
  {
    id: "user-010",
    username: "olivia.white",
    firstName: "Olivia",
    lastName: "White",
    email: "olivia.white@personal.com",
    workEmail: "olivia.white@company.com",
    phoneNumber: "+1-555-0132",
    workPhoneNumber: "+1-555-0109",
    address: "741 Spruce Dr, Miami, FL 33101",
    nationalID: "741852963",
    insuranceNumber: "INS741852",
    yearlyVacationDays: 27,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[4]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2021-07-20T10:20:00Z")
  },
  {
    id: "user-011",
    username: "chris.lee",
    firstName: "Chris",
    lastName: "Lee",
    email: "chris.lee@personal.com",
    workEmail: "chris.lee@company.com",
    phoneNumber: "+1-555-0133",
    workPhoneNumber: "+1-555-0110",
    address: "852 Ash St, Phoenix, AZ 85001",
    nationalID: "852963741",
    insuranceNumber: "INS852963",
    yearlyVacationDays: 23,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[3]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2022-08-11T09:10:00Z")
  },
  {
    id: "user-012",
    username: "sophia.clark",
    firstName: "Sophia",
    lastName: "Clark",
    email: "sophia.clark@personal.com",
    workEmail: "sophia.clark@company.com",
    phoneNumber: "+1-555-0134",
    workPhoneNumber: "+1-555-0111",
    address: "963 Walnut Way, Chicago, IL 60601",
    nationalID: "963741852",
    insuranceNumber: "INS963741",
    yearlyVacationDays: 31,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[5]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2020-12-05T08:00:00Z")
  },
  {
    id: "user-013",
    username: "james.rodriguez",
    firstName: "James",
    lastName: "Rodriguez",
    email: "james.rodriguez@personal.com",
    workEmail: "james.rodriguez@company.com",
    phoneNumber: "+1-555-0135",
    workPhoneNumber: "+1-555-0112",
    address: "159 Chestnut Blvd, San Diego, CA 92101",
    nationalID: "159357246",
    insuranceNumber: "INS159357",
    yearlyVacationDays: 19,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face",
    status: "suspended",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2023-09-18T07:45:00Z")
  },
  {
    id: "user-014",
    username: "mia.walker",
    firstName: "Mia",
    lastName: "Walker",
    email: "mia.walker@personal.com",
    workEmail: "mia.walker@company.com",
    phoneNumber: "+1-555-0136",
    workPhoneNumber: "+1-555-0113",
    address: "357 Hickory Hill, Nashville, TN 37201",
    nationalID: "357159246",
    insuranceNumber: "INS357159",
    yearlyVacationDays: 25,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2023-04-03T09:30:00Z")
  },
  {
    id: "user-015",
    username: "noah.hall",
    firstName: "Noah",
    lastName: "Hall",
    email: "noah.hall@personal.com",
    workEmail: "noah.hall@company.com",
    phoneNumber: "+1-555-0137",
    workPhoneNumber: "+1-555-0114",
    address: "468 Poplar Place, Las Vegas, NV 89101",
    nationalID: "468246135",
    insuranceNumber: "INS468246",
    yearlyVacationDays: 22,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2023-06-25T10:45:00Z")
  },
  {
    id: "user-016",
    username: "ava.young",
    firstName: "Ava",
    lastName: "Young",
    email: "ava.young@personal.com",
    workEmail: "ava.young@company.com",
    phoneNumber: "+1-555-0138",
    workPhoneNumber: "+1-555-0115",
    address: "579 Sycamore St, Atlanta, GA 30301",
    nationalID: "579135468",
    insuranceNumber: "INS579135",
    yearlyVacationDays: 28,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[4]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2021-10-14T08:15:00Z")
  },
  {
    id: "user-017",
    username: "ethan.king",
    firstName: "Ethan",
    lastName: "King",
    email: "ethan.king@personal.com",
    workEmail: "ethan.king@company.com",
    phoneNumber: "+1-555-0139",
    workPhoneNumber: "+1-555-0116",
    address: "681 Magnolia Manor, New Orleans, LA 70112",
    nationalID: "681468579",
    insuranceNumber: "INS681468",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read"]
      }
    ],
    createdAt: new Date("2024-03-07T09:00:00Z")
  },
  {
    id: "user-018",
    username: "isabella.wright",
    firstName: "Isabella",
    lastName: "Wright",
    email: "isabella.wright@personal.com",
    workEmail: "isabella.wright@company.com",
    phoneNumber: "+1-555-0140",
    workPhoneNumber: "+1-555-0117",
    address: "792 Dogwood Dr, Charlotte, NC 28201",
    nationalID: "792579681",
    insuranceNumber: "INS792579",
    yearlyVacationDays: 26,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[3]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2022-01-28T07:30:00Z")
  },
  {
    id: "user-019",
    username: "mason.lopez",
    firstName: "Mason",
    lastName: "Lopez",
    email: "mason.lopez@personal.com",
    workEmail: "mason.lopez@company.com",
    phoneNumber: "+1-555-0141",
    workPhoneNumber: "+1-555-0118",
    address: "813 Redwood Ridge, Sacramento, CA 95814",
    nationalID: "813681792",
    insuranceNumber: "INS813681",
    yearlyVacationDays: 24,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[5]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2020-09-22T11:00:00Z")
  },
  {
    id: "user-020",
    username: "amelia.green",
    firstName: "Amelia",
    lastName: "Green",
    email: "amelia.green@personal.com",
    workEmail: "amelia.green@company.com",
    phoneNumber: "+1-555-0142",
    workPhoneNumber: "+1-555-0119",
    address: "924 Willow Way, Minneapolis, MN 55401",
    nationalID: "924792813",
    insuranceNumber: "INS924792",
    yearlyVacationDays: 30,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1488508872907-592763824245?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2023-01-30T08:20:00Z")
  },
  {
    id: "user-021",
    username: "logan.adams",
    firstName: "Logan",
    lastName: "Adams",
    email: "logan.adams@personal.com",
    workEmail: "logan.adams@company.com",
    phoneNumber: "+1-555-0143",
    workPhoneNumber: "+1-555-0120",
    address: "135 Cedar Creek, Salt Lake City, UT 84101",
    nationalID: "135813924",
    insuranceNumber: "INS135813",
    yearlyVacationDays: 21,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=300&fit=crop&crop=face",
    status: "terminated",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2023-08-16T10:30:00Z")
  },
  {
    id: "user-022",
    username: "harper.baker",
    firstName: "Harper",
    lastName: "Baker",
    email: "harper.baker@personal.com",
    workEmail: "harper.baker@company.com",
    phoneNumber: "+1-555-0144",
    workPhoneNumber: "+1-555-0121",
    address: "246 Oakwood Oaks, Kansas City, MO 64101",
    nationalID: "246924135",
    insuranceNumber: "INS246924",
    yearlyVacationDays: 27,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[4]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2021-05-09T09:45:00Z")
  },
  {
    id: "user-023",
    username: "jacob.nelson",
    firstName: "Jacob",
    lastName: "Nelson",
    email: "jacob.nelson@personal.com",
    workEmail: "jacob.nelson@company.com",
    phoneNumber: "+1-555-0145",
    workPhoneNumber: "+1-555-0122",
    address: "357 Pine Peak, Colorado Springs, CO 80901",
    nationalID: "357135246",
    insuranceNumber: "INS357135",
    yearlyVacationDays: 23,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[3]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2022-11-14T08:50:00Z")
  },
  {
    id: "user-024",
    username: "evelyn.carter",
    firstName: "Evelyn",
    lastName: "Carter",
    email: "evelyn.carter@personal.com",
    workEmail: "evelyn.carter@company.com",
    phoneNumber: "+1-555-0146",
    workPhoneNumber: "+1-555-0123",
    address: "468 Maple Mountain, Richmond, VA 23219",
    nationalID: "468246357",
    insuranceNumber: "INS468246",
    yearlyVacationDays: 29,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[5]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2020-04-17T07:15:00Z")
  },
  {
    id: "user-025",
    username: "lucas.mitchell",
    firstName: "Lucas",
    lastName: "Mitchell",
    email: "lucas.mitchell@personal.com",
    workEmail: "lucas.mitchell@company.com",
    phoneNumber: "+1-555-0147",
    workPhoneNumber: "+1-555-0124",
    address: "579 Birch Bay, Tampa, FL 33602",
    nationalID: "579357468",
    insuranceNumber: "INS579357",
    yearlyVacationDays: 18,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop&crop=face",
    status: "suspended",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [],
    createdAt: new Date("2023-12-01T11:20:00Z")
  },
  {
    id: "user-026",
    username: "charlotte.perez",
    firstName: "Charlotte",
    lastName: "Perez",
    email: "charlotte.perez@personal.com",
    workEmail: "charlotte.perez@company.com",
    phoneNumber: "+1-555-0148",
    workPhoneNumber: "+1-555-0125",
    address: "681 Elm Estate, Raleigh, NC 27601",
    nationalID: "681468579",
    insuranceNumber: "INS681468",
    yearlyVacationDays: 25,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2023-03-22T09:40:00Z")
  },
  {
    id: "user-027",
    username: "henry.roberts",
    firstName: "Henry",
    lastName: "Roberts",
    email: "henry.roberts@personal.com",
    workEmail: "henry.roberts@company.com",
    phoneNumber: "+1-555-0149",
    workPhoneNumber: "+1-555-0126",
    address: "792 Spruce Springs, Memphis, TN 38103",
    nationalID: "792579681",
    insuranceNumber: "INS792579",
    yearlyVacationDays: 22,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[1]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2023-07-11T08:25:00Z")
  },
  {
    id: "user-028",
    username: "grace.turner",
    firstName: "Grace",
    lastName: "Turner",
    email: "grace.turner@personal.com",
    workEmail: "grace.turner@company.com",
    phoneNumber: "+1-555-0150",
    workPhoneNumber: "+1-555-0127",
    address: "813 Aspen Acres, Tucson, AZ 85701",
    nationalID: "813681792",
    insuranceNumber: "INS813681",
    yearlyVacationDays: 28,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[4]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-002"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2021-08-30T10:10:00Z")
  },
  {
    id: "user-029",
    username: "benjamin.phillips",
    firstName: "Benjamin",
    lastName: "Phillips",
    email: "benjamin.phillips@personal.com",
    workEmail: "benjamin.phillips@company.com",
    phoneNumber: "+1-555-0151",
    workPhoneNumber: "+1-555-0128",
    address: "924 Cherry Chase, Louisville, KY 40202",
    nationalID: "924792813",
    insuranceNumber: "INS924792",
    yearlyVacationDays: 20,
    vacationDaysType: "labouring",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
    status: "probation",
    employmentHistory: [employmentHistoryEvents[2]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read"]
      }
    ],
    createdAt: new Date("2024-01-25T09:55:00Z")
  },
  {
    id: "user-030",
    username: "zoe.campbell",
    firstName: "Zoe",
    lastName: "Campbell",
    email: "zoe.campbell@personal.com",
    workEmail: "zoe.campbell@company.com",
    phoneNumber: "+1-555-0152",
    workPhoneNumber: "+1-555-0129",
    address: "135 Willow Woods, Oklahoma City, OK 73102",
    nationalID: "135813924",
    insuranceNumber: "INS135813",
    yearlyVacationDays: 26,
    vacationDaysType: "natural",
    profileImage: "https://images.unsplash.com/photo-1522075469751-3847faf86d40?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[3]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"]
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"]
      }
    ],
    createdAt: new Date("2022-06-18T08:35:00Z")
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
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    status: "active",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-manager"],
    permissions: [
      {
        permissionId: "hr-attendance-manage-others",
        actions: ["create", "read", "update", "delete", "approve", "request_changes"]
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