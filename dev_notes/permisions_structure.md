# Permission System Structure Design

## Overview
This document explores a flexible permission system that separates permission definitions from user-specific permission grants, allowing for granular control while maintaining clean UI presentation.

## Core Concept
Instead of having users directly assigned to permissions, we have:
1. **Permission Definitions** - Define what CAN be done
2. **User Permissions** - Define what specific users ARE ALLOWED to do

## Interface Structure

### Base Permission Interface
```typescript
// Base permission interface with common fields
export interface BasePermission {
  id: string
  name: string
  description?: string
  moduleId: string  // For UI grouping
  sectionId: string // For UI grouping
}

// Permission-specific interfaces extending the base
export interface UserManagementPermission extends BasePermission {
  action: "manage_users"
  options: ("create" | "read" | "update" | "delete" | "suspend" | "activate")[]
}

export interface FileDownloadPermission extends BasePermission {
  action: "download_files"
  options: ("pdf" | "excel" | "csv" | "images" | "documents")[]
}

export interface VacationApprovalPermission extends BasePermission {
  action: "approve_vacations"
  options: ("own_team" | "department" | "company_wide" | "emergency_override")[]
}

export interface PageAccessPermission extends BasePermission {
  action: "view_page"
  options: ["view"] // Simple single option
}

// Union type for all permissions (needed for functions that work with any permission type)
export type Permission =
  | UserManagementPermission
  | FileDownloadPermission
  | VacationApprovalPermission
  | PageAccessPermission

// User permission grants (simple structure)
export interface UserPermission {
  id: string                    // Permission ID reference
  options: string[]             // Subset of permission.options that user has
}
```

## Examples

### Example 1: User Management
```typescript
// Permission Definition (UserManagementPermission)
const userMgmtPermission: UserManagementPermission = {
  id: "perm-hr-users-manage",
  name: "Manage Users",
  description: "Manage user accounts in HR system",
  moduleId: "module-hr",
  sectionId: "section-hr-users",
  action: "manage_users",
  options: ["create", "read", "update", "delete", "suspend", "activate"]
}

// User Assignments
// HR Manager gets full access
{
  id: "perm-hr-users-manage",
  options: ["create", "read", "update", "delete", "suspend", "activate"]
}

// Team Lead gets limited access
{
  id: "perm-hr-users-manage",
  options: ["read", "update"]
}

// Employee gets read-only
{
  id: "perm-hr-users-manage",
  options: ["read"]
}
```

### Example 2: File Downloads
```typescript
// Permission Definition (FileDownloadPermission)
const fileDownloadPermission: FileDownloadPermission = {
  id: "perm-files-download",
  name: "Download Files",
  description: "Download files in various formats",
  moduleId: "module-files",
  sectionId: "section-files-documents",
  action: "download_files",
  options: ["pdf", "excel", "csv", "images", "documents"]
}

// User Assignment - Can only download reports
{
  id: "perm-files-download",
  options: ["pdf", "excel"]
}
```

### Example 3: Page Access
```typescript
// Permission Definition (PageAccessPermission)
const dashboardPermission: PageAccessPermission = {
  id: "perm-dashboard-view",
  name: "Dashboard Access",
  description: "Access to dashboard page",
  moduleId: "module-dashboard",
  sectionId: "section-dashboard-main",
  action: "view_page",
  options: ["view"]
}

// User Assignment - Simple page access
{
  id: "perm-dashboard-view",
  options: ["view"]
}
```

### Example 4: Vacation Approvals
```typescript
// Permission Definition (VacationApprovalPermission)
const vacationApprovalPermission: VacationApprovalPermission = {
  id: "perm-hr-vacations-approve",
  name: "Approve Vacations",
  description: "Approve or reject vacation requests",
  moduleId: "module-hr",
  sectionId: "section-hr-vacations",
  action: "approve_vacations",
  options: ["own_team", "department", "company_wide", "emergency_override"]
}

// User Assignments
// Team Lead
{
  id: "perm-hr-vacations-approve",
  options: ["own_team"]
}

// HR Manager
{
  id: "perm-hr-vacations-approve",
  options: ["own_team", "department", "company_wide"]
}

// CEO
{
  id: "perm-hr-vacations-approve",
  options: ["own_team", "department", "company_wide", "emergency_override"]
}
```

## Benefits

### 1. Type Safety & Flexibility
- **Full TypeScript type safety**: Each permission type has specific, compile-time checked options
- **IntelliSense support**: IDE autocompletes valid options for each permission type
- **Compile-time error prevention**: Invalid options caught during development, not runtime
- **Flexible option sets**: Each permission can have completely different option types
- **No forced CRUD model**: Can model any business logic (approval levels, file types, regions, etc.)

### 2. Clean Admin UI
Admin sees grouped, descriptive permissions:

**HR Module → Users Section**
- ☑️ Manage Users → [Create, Read, Update, Delete, Suspend, Activate]
- ☑️ View User Reports → [View]
- ☑️ Export User Data → [PDF, Excel, CSV]

**HR Module → Vacations Section**
- ☑️ Request Vacation → [Submit, Cancel Own]
- ☑️ Approve Vacations → [Own Team, Department, Company Wide]
- ☑️ Manage Holidays → [Create, Edit, Delete]

### 3. Granular Control
- Users can have partial permissions (e.g., read and update but not create/delete)
- Same permission can be granted at different levels to different users
- Easy to audit what each user can actually do

### 4. Programmatic Checking
```typescript
// Check if user can perform specific action with specific option
function hasPermission(userId: string, permissionId: string, option: string): boolean {
  const userPerm = getUserPermission(userId, permissionId)
  return userPerm?.options.includes(option) ?? false
}

// Usage
if (hasPermission(userId, "perm-hr-users-manage", "delete")) {
  // Show delete button
}

if (hasPermission(userId, "perm-files-download", "pdf")) {
  // Show PDF download option
}
```

## Implementation Notes

### User Interface
When assigning permissions to users, admin would see:

```
HR Module
├── Users
│   ├── ☑️ Manage Users
│   │   ├── ☑️ Create  ├── ☑️ Read  ├── ☑️ Update  ├── ☐ Delete  ├── ☐ Suspend
│   ├── ☑️ View User Reports
│   │   ├── ☑️ View
│   └── ☐ Export User Data
│       ├── ☐ PDF  ├── ☐ Excel  ├── ☐ CSV
```

### Database Schema
```sql
-- Permission definitions
CREATE TABLE permissions (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  module_id VARCHAR NOT NULL,
  section_id VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  options JSONB NOT NULL -- ["create", "read", "update", "delete"]
);

-- User permission grants
CREATE TABLE user_permissions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  permission_id VARCHAR NOT NULL,
  options JSONB NOT NULL, -- ["read", "update"] (subset of permission.options)
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by VARCHAR,
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
```

## Migration Path
1. Define all permissions with their available options
2. Create user permission mappings based on current role assignments
3. Update permission checking code to use new structure
4. Build admin UI for granular permission assignment

This structure provides maximum flexibility while maintaining clean UX and clear permission semantics.