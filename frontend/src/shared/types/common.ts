// Common types used across multiple modules within the web app
// (Not to be confused with /shared/ which is for web/mobile cross-platform code)

export interface Message {
  id: string;
  userId: string;
  text: string;
  date: Date;
  isAnswered: boolean;
}

// Common list item structure for UI components
export interface BaseListItem {
  id: string;
  userId: string;
  employeeName: string;
}

// Common employee info structure for populated interfaces
export interface EmployeeInfo {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}