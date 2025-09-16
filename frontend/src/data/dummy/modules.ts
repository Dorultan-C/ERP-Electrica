// DUMMY DATA - EASILY REMOVABLE
// This file contains dummy module and section configuration data for prototype development
// TODO: Replace with real API calls in Phase 9 (Backend Integration)

import type { Module, ModuleSection, Schedule } from "../../shared/types/index";

// Dummy Schedules (referenced by modules)
export const dummySchedules: Schedule[] = [
  {
    id: "schedule-001",
    name: "Standard Office Hours",
    description: "Monday to Friday, 9 AM to 5 PM",
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
        allowedBrakeMinutes: 60
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
    description: "Monday to Friday, 8 AM to 4 PM",
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

// Dummy Module Sections
export const dummyModuleSections: ModuleSection[] = [
  // Dashboard sections (special case - dashboard has no sections)
  {
    id: "section-dashboard-main",
    name: "dashboard",
    title: "Dashboard",
    description: "Main dashboard view",
    icon: "dashboard",
    route: "/dashboard",
    requiredPermissionId: "perm-001",
    isActive: true,
    order: 1
  },

  // Settings sections
  {
    id: "section-settings-company",
    name: "company",
    title: "Company",
    description: "Manage company-related information and settings",
    icon: "building",
    route: "/settings/company",
    requiredPermissionId: "perm-003",
    isActive: true,
    order: 1
  },
  {
    id: "section-settings-app",
    name: "app",
    title: "App",
    description: "Manage application-wide information and settings",
    icon: "settings",
    route: "/settings/app",
    requiredPermissionId: "perm-005",
    isActive: true,
    order: 2
  },

  // HR sections
  {
    id: "section-hr-users",
    name: "users",
    title: "Users",
    description: "Manage users in the application",
    icon: "users",
    route: "/hr/users",
    requiredPermissionId: "perm-007",
    isActive: true,
    order: 1
  },
  {
    id: "section-hr-vacations",
    name: "vacations",
    title: "Vacations",
    description: "Manage vacation requests and public holidays",
    icon: "calendar",
    route: "/hr/vacations",
    requiredPermissionId: "perm-011",
    isActive: true,
    order: 2
  },
  {
    id: "section-hr-loa",
    name: "leave_of_absence",
    title: "Leave of Absence",
    description: "Manage leave of absence requests",
    icon: "clock",
    route: "/hr/leave-of-absence",
    requiredPermissionId: "perm-015",
    isActive: true,
    order: 3
  },
  {
    id: "section-hr-attendance",
    name: "attendance",
    title: "Attendance",
    description: "View and manage attendance and timesheets",
    icon: "checkcircle",
    route: "/hr/attendance",
    requiredPermissionId: "perm-018",
    isActive: true,
    order: 4
  },
  {
    id: "section-hr-schedules",
    name: "schedules",
    title: "Schedules",
    description: "Manage employee work schedules",
    icon: "schedule",
    route: "/hr/schedules",
    requiredPermissionId: "perm-022",
    isActive: true,
    order: 5
  },

  // Future modules sections (inactive for now)
  {
    id: "section-projects-overview",
    name: "overview",
    title: "Overview",
    description: "Project overview and statistics",
    icon: "chart",
    route: "/projects/overview",
    requiredPermissionId: "perm-999", // Future permission
    isActive: false,
    order: 1
  },
  {
    id: "section-finance-dashboard",
    name: "dashboard",
    title: "Finance Dashboard",
    description: "Financial overview and reports",
    icon: "dollar",
    route: "/finance/dashboard",
    requiredPermissionId: "perm-998", // Future permission
    isActive: false,
    order: 1
  }
];

// Dummy Modules based on the features specification
export const dummyModules: Module[] = [
  {
    id: "module-dashboard",
    name: "dashboard",
    title: "Dashboard",
    description: "Customizable dashboard with widgets and quick actions",
    icon: "grid",
    route: "/dashboard",
    sectionIds: ["section-dashboard-main"],
    requiredPermissionId: "perm-001",
    isActive: true,
    order: 1
  },
  {
    id: "module-settings",
    name: "settings",
    title: "Settings",
    description: "Company and application configuration",
    icon: "settings",
    route: "/settings",
    sectionIds: ["section-settings-company", "section-settings-app"],
    requiredPermissionId: "perm-003",
    isActive: true,
    order: 2
  },
  {
    id: "module-hr",
    name: "human_resources",
    title: "Human Resources",
    description: "Employee management, attendance, vacations, and schedules",
    icon: "users",
    route: "/hr",
    sectionIds: [
      "section-hr-users",
      "section-hr-vacations",
      "section-hr-loa",
      "section-hr-attendance",
      "section-hr-schedules"
    ],
    requiredPermissionId: "perm-007",
    isActive: true,
    order: 3
  },
  {
    id: "module-projects",
    name: "projects",
    title: "Projects",
    description: "Project management and tracking (Coming Soon)",
    icon: "briefcase",
    route: "/projects",
    sectionIds: ["section-projects-overview"],
    requiredPermissionId: "perm-999", // Future permission
    isActive: false, // Coming soon
    order: 4
  },
  {
    id: "module-finance",
    name: "finance",
    title: "Finance",
    description: "Financial management and reporting (Coming Soon)",
    icon: "dollarsign",
    route: "/finance",
    sectionIds: ["section-finance-dashboard"],
    requiredPermissionId: "perm-998", // Future permission
    isActive: false, // Coming soon
    order: 5
  },
  {
    id: "module-inventory",
    name: "inventory",
    title: "Inventory",
    description: "Inventory management and tracking (Coming Soon)",
    icon: "package",
    route: "/inventory",
    sectionIds: [],
    requiredPermissionId: "perm-997", // Future permission
    isActive: false, // Coming soon
    order: 6
  },
  {
    id: "module-files",
    name: "files",
    title: "Files",
    description: "File management and storage (Coming Soon)",
    icon: "folder",
    route: "/files",
    sectionIds: [],
    requiredPermissionId: "perm-996", // Future permission
    isActive: false, // Coming soon
    order: 7
  }
];

// Helper functions for dummy modules and sections
export const getDummyModuleById = (id: string): Module | undefined => {
  return dummyModules.find(module => module.id === id);
};

export const getDummyModuleByName = (name: string): Module | undefined => {
  return dummyModules.find(module => module.name === name);
};

export const getActiveDummyModules = (): Module[] => {
  return dummyModules.filter(module => module.isActive);
};

export const getDummyModulesByPermission = (userPermissionIds: string[]): Module[] => {
  return dummyModules.filter(module =>
    module.isActive && userPermissionIds.includes(module.requiredPermissionId)
  );
};

export const getDummySectionById = (id: string): ModuleSection | undefined => {
  return dummyModuleSections.find(section => section.id === id);
};

export const getDummySectionsByModule = (moduleId: string): ModuleSection[] => {
  const moduleData = getDummyModuleById(moduleId);
  if (!moduleData) return [];

  return dummyModuleSections.filter(section =>
    moduleData.sectionIds.includes(section.id) && section.isActive
  );
};

export const getDummySectionsByPermission = (userPermissionIds: string[]): ModuleSection[] => {
  return dummyModuleSections.filter(section =>
    section.isActive && userPermissionIds.includes(section.requiredPermissionId)
  );
};

export const getDummyScheduleById = (id: string): Schedule | undefined => {
  return dummySchedules.find(schedule => schedule.id === id);
};

// Utility function to check if user can access module
export const canUserAccessModule = (module: Module, userPermissionIds: string[]): boolean => {
  return module.isActive && userPermissionIds.includes(module.requiredPermissionId);
};

// Utility function to check if user can access section
export const canUserAccessSection = (section: ModuleSection, userPermissionIds: string[]): boolean => {
  return section.isActive && userPermissionIds.includes(section.requiredPermissionId);
};