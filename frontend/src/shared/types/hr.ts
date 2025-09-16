// HR Module TypeScript interfaces
// Based on specifications in dev_notes/feachures.md

import type { ScheduleDay } from "./index";
import type { Message, EmployeeInfo } from "./common";

// Vacation/Leave interfaces
export interface Vacation {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  status: VacationStatus;
  messages?: Message[];
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

// Message interface moved to shared/types

export type VacationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

export interface PublicHoliday {
  id: string;
  name?: string;
  date: Date;
}

export interface ClosingDay {
  id: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

// Leave of Absence interfaces
export interface LeaveOfAbsence {
  id: string;
  userId: string;
  type: LOAType;
  startDate: Date;
  endDate?: Date;
  status: LOAStatus;
  documents?: string[];
  messages?: Message[];
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export type LOAType =
  | "medical"
  | "family_emergency"
  | "military_service"
  | "educational"
  | "sabbatical"
  | "other";

export type LOAStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

// Attendance interfaces
export interface Timesheet {
  id: string;
  userId: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  breaks?: Break[];
  totalMinutes: number;
  regularMinutes: number;
  overtimeMinutes: number;
  breakMinutes: number;
  status: TimesheetStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  messages?: Message[];
}

export interface Break {
  id: string;
  startTime: Date; // Actual break start time (timestamp)
  endTime: Date;   // Actual break end time (timestamp)
  totalMinutes: number;
}

export type TimesheetStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "requires_modification";


// updated up to here


// HR List view interfaces
export interface VacationListItem {
  id: string;
  userId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  days: number;
  status: VacationStatus;
  requestedAt: Date;
}

export interface LOAListItem {
  id: string;
  userId: string;
  employeeName: string;
  type: LOAType;
  startDate: Date;
  endDate?: Date;
  status: LOAStatus;
  requestedAt: Date;
}

export interface TimesheetListItem {
  id: string;
  userId: string;
  employeeName: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  totalMinutes: number;
  status: TimesheetStatus;
}

export interface ScheduleListItem {
  id: string;
  name: string;
  description?: string;
  employeeCount: number;
  isDefault: boolean;
  isActive: boolean;
}

// HR Form interfaces
export interface VacationFormData {
  startDate: Date;
  endDate: Date;
  reason?: string;
  comments?: string;
}

export interface LOAFormData {
  type: LOAType;
  startDate: Date;
  endDate?: Date;
  reason: string;
  medicalCertificate?: File;
  documents?: File[];
}

export interface TimesheetFormData {
  startTime?: Date;
  endTime?: Date;
  breaks?: Omit<Break, "id">[];
}

export interface ScheduleFormData {
  name: string;
  description?: string;
  weekSchedule: ScheduleDay[];
  isDefault: boolean;
  isActive: boolean;
}

// Import ScheduleDay from index.ts when needed

// HR Statistics interfaces
export interface VacationStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalDaysRequested: number;
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageAttendanceRate: number;
}

// Populated interfaces for when full User objects are needed (UI display, etc.)
// Import User type when needed: import { User } from "./index"

export interface PopulatedVacation extends Omit<Vacation, "userId"> {
  userId: string;
  user?: EmployeeInfo;
}

export interface PopulatedLeaveOfAbsence extends Omit<LeaveOfAbsence, "userId"> {
  userId: string;
  user?: EmployeeInfo;
}

export interface PopulatedTimesheet extends Omit<Timesheet, "userId"> {
  userId: string;
  user?: EmployeeInfo;
}

// Note: EmployeeSchedule interface removed in simplified version
// If needed, can be added back or managed through User.assignedScheduleId