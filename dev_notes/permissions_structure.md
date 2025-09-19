# Permission System Structure Design

## Overview

This document outlines a simplified yet type-safe permission system in TypeScript. It balances flexibility with safety by enforcing valid options through type unions, while also ensuring moduleId and sectionId are validated against predefined values.

## Core Concept

Instead of using raw strings everywhere, we:

1. **Define option sets** (e.g., CRUD operations, download formats, approval levels)
2. **Use a generic Permission interface** parameterized by those option sets
3. **Restrict moduleId and sectionId** to known IDs using union types

This provides type safety without excessive complexity.

---

## Type Definitions

### Module and Section IDs
```typescript
type ModuleId = "hr" | "files" | "dashboard" | "settings" | "projects"
type SectionId = "users" | "vacations" | "loa" | "attendance" | "schedules" | "documents" | "main" | "company" | "app"
```

### Option Sets
```typescript
type UserManagementOptions = "create" | "read" | "update" | "delete" | "suspend" | "activate"
type FileDownloadOptions = "pdf" | "excel" | "csv" | "images" | "documents"
type VacationApprovalOptions = "own_team" | "department" | "company_wide" | "emergency_override"
type PageAccessOptions = "view"
```

### Generic Permission Interface
```typescript
export interface Permission<OptionType extends string> {
  id: string
  name: string
  description?: string
  moduleId: ModuleId
  sectionId: SectionId
  action: string
  options: OptionType[]
}

// User permission grants
export interface UserPermission {
  id: string                // Permission ID reference
  options: string[]         // Subset of permission.options that user has
}
```


## Examples

### Example 1: User Management
```typescript
const userMgmtPermission: Permission<UserManagementOptions> = {
  id: "perm-hr-users-manage",
  name: "Manage Users",
  description: "Manage user accounts in HR system",
  moduleId: "hr",
  sectionId: "users",
  action: "user.manage",
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
const fileDownloadPermission: Permission<FileDownloadOptions> = {
  id: "perm-files-download",
  name: "Download Files",
  description: "Download files in various formats",
  moduleId: "files",
  sectionId: "documents",
  action: "file.download",
  options: ["pdf", "excel", "csv", "images", "documents"]
}

// User Assignment - Can only download reports
{
  id: "perm-files-download",
  options: ["pdf", "excel"]
}
```

### Example 3: Vacation Approvals
```typescript
const vacationApprovalPermission: Permission<VacationApprovalOptions> = {
  id: "perm-hr-vacations-approve",
  name: "Approve Vacations",
  description: "Approve or reject vacation requests",
  moduleId: "hr",
  sectionId: "vacations",
  action: "vacation.approve",
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

### 1. Type Safety
- **Options are validated** against predefined string unions
- **moduleId and sectionId** must come from predefined ID unions
- **Strong IntelliSense support** with autocomplete for valid options
- **Compile-time error prevention** for invalid permission configurations

### 2. Flexibility
- **Different permissions** can have completely different option sets
- **No rigid CRUD-only model** - supports any business logic
- **Easy to extend** by adding new option union types
- **Custom actions** like "approve", "download", "export" fit naturally

### 3. Granular Control
- **Assign partial permissions** by selecting subsets of the options array
- **Consistent structure** across different modules and sections
- **Fine-grained access control** without permission explosion

### 4. Simplicity
- **Only one Permission interface** needed for all permission types
- **No explosion of interfaces/unions** like previous approach
- **Balanced safety** without heavy TypeScript boilerplate

---

## Programmatic Checking

```typescript
function hasPermission(userId: string, permissionId: string, option: string): boolean {
  const userPerm = getUserPermission(userId, permissionId)
  return userPerm?.options.includes(option) ?? false
}

// Usage examples
if (hasPermission(userId, "perm-hr-users-manage", "delete")) {
  // Show delete button
}

if (hasPermission(userId, "perm-files-download", "pdf")) {
  // Show PDF download option
}

if (hasPermission(userId, "perm-hr-vacations-approve", "company_wide")) {
  // Show company-wide approval interface
}
```

---

## Database Schema (Example)

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
  options JSONB NOT NULL, -- subset of permission.options
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by VARCHAR,
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
```

---

## Implementation Notes

### Admin UI Structure
When assigning permissions to users, admin would see:

```
HR Module
├── Users
│   ├── ☑️ Manage Users
│   │   ├── ☑️ Create  ├── ☑️ Read  ├── ☑️ Update  ├── ☐ Delete  ├── ☐ Suspend
│   └── ☑️ View Reports → [View]
├── Vacations
│   ├── ☑️ Approve Vacations
│   │   ├── ☑️ Own Team  ├── ☑️ Department  ├── ☐ Company Wide
│   └── ☑️ Request Vacation → [Submit, Cancel Own]
```

### Migration Path

1. **Define option sets** for each permission type needed
2. **Define modules and sections** as union types matching your app structure
3. **Replace legacy role/permission assignments** with structured grants
4. **Build admin UI** to assign subsets of options per user
5. **Update permission checking code** to use new structure

This structure keeps things clean, safe, and flexible without becoming overly complex.

