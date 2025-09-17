// DUMMY DATA - EASILY REMOVABLE
// Central export point for all dummy data
// TODO: Remove this entire file and directory in Phase 9 (Backend Integration)

// Export all dummy data
export * from "./users";
export * from "./hr";
export * from "./permissions";
export * from "./modules";
export * from "./notifications";


// Configuration for dummy data behavior
export const DUMMY_DATA_CONFIG = {
  // Simulate API delays in development
  simulateApiDelay: true,
  defaultDelayMs: 300,

  // Enable/disable specific dummy data sets
  enableUsers: true,
  enableHR: true,
  enablePermissions: true,
  enableModules: true,
  enableNotifications: true,

  // Default pagination settings
  defaultPageSize: 10,
  maxPageSize: 100
};

// Utility function to simulate API delay
export const simulateApiDelay = async (ms?: number): Promise<void> => {
  if (!DUMMY_DATA_CONFIG.simulateApiDelay) return;

  const delay = ms || DUMMY_DATA_CONFIG.defaultDelayMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};