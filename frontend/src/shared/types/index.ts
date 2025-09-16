// Core TypeScript interfaces for the ERP system
// These interfaces work with both dummy and real data

export interface User {
  id: string;
  username: string;
  email: string;
  workEmail: string;
  phoneNumber: string;
  workPhoneNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  nationalID: string;
  insuranceNumber: string;
  yearlyVacationDays: number;
  vacationDaysType: VacationDaysType;
  profileImage?: string;
  status: UserStatus;
  employmentHistory: EmploymentHistoryEvent[];
  assignedScheduleId: string;
  roleIds: string[];
  permissionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  name: string;
  weekSchedule: ScheduleDay[];
  description?: string;
}

export interface ScheduleDay {
  id: string;
  dayOfWeek: number;
  startTime: string; // "09:00" format for schedule templates
  endTime: string;   // "17:00" format for schedule templates
  labouringMinutes: number;
  allowedBrakeMinutes: number;
}

export type VacationDaysType =
  | "labouring"
  | "natural";

export type UserStatus =
  | "pending_start"
  | "active"
  | "terminated"
  | "suspended"
  | "probation";

export interface EmploymentHistoryEvent {
  id: string;
  status: UserStatus;
  date: Date;
  notes?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  moduleId: string;
  sectionId: string;
  action: PermissionAction;
  resource?: string;
}

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "manage";

export interface Module {
  id: string;
  name: string;
  title: string;
  description?: string;
  icon: string;
  route: string;
  sectionIds: string[];
  requiredPermissionId: string;
  isActive: boolean;
  order: number;
}

export interface ModuleSection {
  id: string;
  name: string;
  title: string;
  description?: string;
  icon: string;
  route: string;
  requiredPermissionId: string;
  isActive: boolean;
  order: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  seenAt?: Date;
  data?: Record<string, unknown>;
}

export type NotificationType =
  | "general"
  | "vacation_request"
  | "leave_request"
  | "message"
  | "system_alert";

// Navigation and UI state interfaces
export interface NavigationState {
  currentModule?: string;
  currentSection?: string;
  sideDrawerOpen: boolean;
  sideDrawerExpanded: boolean;
  moduleMenuOpen: boolean;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  moduleId?: string;
  sectionId?: string;
  size: WidgetSize;
  position: WidgetPosition;
  config: Record<string, unknown>;
  requiredPermissionId: string;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Filter and search interfaces
export interface FilterOption {
  label: string;
  value: string | number | boolean;
  count?: number;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
  label: string;
}

export interface SearchAndFilterState {
  searchQuery: string;
  filters: Record<string, unknown>;
  sort: SortOption | null;
  page: number;
  limit: number;
}

// Populated interfaces for when full objects are needed (UI display, etc.)
export interface PopulatedUser extends Omit<User, "roleIds" | "permissionIds" | "assignedScheduleId"> {
  roles: Role[];
  permissions: Permission[];
  assignedSchedule: Schedule;
}

export interface PopulatedRole extends Omit<Role, "permissionIds"> {
  permissions: Permission[];
}

export interface PopulatedModule extends Omit<Module, "sectionIds" | "requiredPermissionId"> {
  sections: ModuleSection[];
  requiredPermission: Permission;
}

export interface PopulatedModuleSection extends Omit<ModuleSection, "requiredPermissionId"> {
  requiredPermission: Permission;
}

export interface PopulatedDashboardWidget extends Omit<DashboardWidget, "moduleId" | "sectionId" | "requiredPermissionId"> {
  module?: Module;
  section?: ModuleSection;
  requiredPermission: Permission;
}