Permission System Structure Design

Overview

This document outlines a simplified yet type-safe permission system in TypeScript. It balances flexibility with safety by enforcing valid options through type unions, while still allowing moduleId and sectionId to be checked against predefined IDs.

Core Concept

Instead of assigning raw strings everywhere, we:

1. Define option sets (e.g., CRUD, download formats, approval levels).


2. Use a generic Permission interface parameterized by those option sets.


3. Restrict moduleId and sectionId to known IDs using union types.




---

Type Definitions

Module and Section IDs

type ModuleId = "hr" | "files" | "dashboard"
type SectionId = "users" | "vacations" | "documents" | "main"

Option Sets

type UserManagementOptions = "create" | "read" | "update" | "delete" | "suspend" | "activate"
type FileDownloadOptions = "pdf" | "excel" | "csv" | "images" | "documents"
type VacationApprovalOptions = "own_team" | "department" | "company_wide" | "emergency_override"

Generic Permission Interface

export interface Permission<OptionType extends string> {
  id: string
  name: string
  description?: string
  moduleId: ModuleId
  sectionId: SectionId
  action: string
  options: OptionType[]
}


---

Examples

Example 1: User Management

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

Example 2: File Downloads

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

Example 3: Vacation Approvals

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


---

Benefits

1. Type Safety

options are validated against predefined string unions.

moduleId and sectionId must come from predefined ID unions.

Strong IntelliSense support.


2. Flexibility

Different permissions can have completely different options sets.

No rigid CRUD-only model.

Easy to extend by adding new union types.


3. Granular Control

Assign partial permissions by selecting subsets of the options array.

Consistent structure across different modules.


4. Simplicity

Only one Permission interface is needed.

No explosion of interfaces/unions.

Balanced safety without heavy boilerplate.



---

Programmatic Checking

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


---

Database Schema (Example)

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


---

Migration Path

1. Define option sets for each permission.


2. Define modules and sections as union types.


3. Replace legacy role/permission assignments with structured grants.


4. Build admin UI to assign subsets of options per user.



This structure keeps things clean, safe, and flexible without becoming overly complex.

