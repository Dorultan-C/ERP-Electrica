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
    permissionIds: ["perm-001", "perm-002", "perm-003"],
    createdAt: new Date("2023-01-15T09:00:00Z"),
    updatedAt: new Date("2024-01-15T14:30:00Z")
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
    permissionIds: ["perm-001", "perm-004"],
    createdAt: new Date("2022-03-20T10:15:00Z"),
    updatedAt: new Date("2024-01-20T16:45:00Z")
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
    permissionIds: ["perm-001"],
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-01-22T11:20:00Z")
  },
  {
    id: "user-004",
    username: "sarah.brown",
    email: "sarah.brown@personal.com",
    workEmail: "sarah.brown@company.com",
    phoneNumber: "+1-555-0126",
    workPhoneNumber: "+1-555-0103",
    firstName: "Sarah",
    lastName: "Brown",
    address: "321 Elm St, Fourth City, ST 12348",
    nationalID: "789123456",
    insuranceNumber: "INS789123",
    yearlyVacationDays: 28,
    vacationDaysType: "natural",
    status: "pending_start",
    employmentHistory: [],
    assignedScheduleId: "schedule-001",
    roleIds: ["role-001"],
    permissionIds: ["perm-001", "perm-002"],
    createdAt: new Date("2024-02-01T12:00:00Z"),
    updatedAt: new Date("2024-02-01T12:00:00Z")
  },
  {
    id: "user-005",
    username: "david.johnson",
    email: "david.johnson@personal.com",
    workEmail: "david.johnson@company.com",
    phoneNumber: "+1-555-0127",
    workPhoneNumber: "+1-555-0104",
    firstName: "David",
    lastName: "Johnson",
    address: "654 Maple Dr, Fifth Town, ST 12349",
    nationalID: "321654987",
    insuranceNumber: "INS321654",
    yearlyVacationDays: 22,
    vacationDaysType: "labouring",
    profileImage: "/images/profiles/david-johnson.jpg",
    status: "suspended",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-002",
    roleIds: ["role-003"],
    permissionIds: ["perm-001"],
    createdAt: new Date("2023-05-12T14:30:00Z"),
    updatedAt: new Date("2024-01-30T09:15:00Z")
  },
  {
    id: "user-006",
    username: "lisa.davis",
    email: "lisa.davis@personal.com",
    workEmail: "lisa.davis@company.com",
    phoneNumber: "+1-555-0128",
    workPhoneNumber: "+1-555-0105",
    firstName: "Lisa",
    lastName: "Davis",
    address: "987 Birch Ln, Sixth City, ST 12350",
    nationalID: "654987321",
    insuranceNumber: "INS654987",
    yearlyVacationDays: 26,
    vacationDaysType: "natural",
    profileImage: "/images/profiles/lisa-davis.jpg",
    status: "terminated",
    employmentHistory: [employmentHistoryEvents[0]!],
    assignedScheduleId: "schedule-001",
    roleIds: [],
    permissionIds: [],
    createdAt: new Date("2022-08-15T10:00:00Z"),
    updatedAt: new Date("2023-12-20T17:00:00Z")
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
    user.workEmail.toLowerCase().includes(lowercaseQuery)
  );
};