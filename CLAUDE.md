# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive ERP (Enterprise Resource Planning) system in early development. The project follows a full-stack TypeScript architecture with web, mobile, and backend components.

## Technology Stack

### Frontend Web
- **Framework**: Next.js (latest stable)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: Next.js built-in routing
- **Real-time**: Socket.IO client

### Mobile App
- **Framework**: React Native + Expo (latest stable)
- **Language**: TypeScript
- **Styling**: NativeWind (consistent with web)
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Real-time**: Socket.IO client

### Backend API
- **Runtime**: Node.js + Express (latest stable)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Real-time**: Socket.IO server

### Infrastructure
- **Cache/Sessions**: Redis
- **File Storage**: MinIO (S3-compatible)
- **Hosting**: Ubuntu 22.04 LTS
- **Reverse Proxy**: Nginx
- **Containerization**: Podman

## Architecture Principles

### Strict Technology Adherence
- Use ONLY the technologies listed above
- Consult before adding any additional technologies
- All components must use TypeScript where indicated

### Data Flow & Structure
- All API requests/responses between frontend, mobile, and backend must use identical data structures
- Business logic exists ONLY in backend API
- Frontend and mobile handle presentation and state only
- No business logic in infrastructure components (Nginx/Ubuntu/Podman)

### Real-time Requirements
- ALL real-time functionality must use Socket.IO (server on backend, client on web/mobile)
- Backend must emit events immediately after any data changes
- Clients must update automatically - no polling allowed
- Real-time events must respect user permissions

### Styling Consistency
- Export shared theme/design tokens in a TypeScript file
- Web and mobile must have consistent styling
- For complex components, create shared component files with platform-specific wrappers (.web.tsx, .native.tsx)
- State, behavior, and permission checks go in shared logic files
- Only styling or platform-specific tweaks go in platform files

## Application Structure

### Module-Based Architecture
The app is organized into modules accessed via a full-screen grid menu:

**Core Modules:**
- **Settings**: Company and app-wide configuration
- **Human Resources**: Users, vacations, leave of absence, attendance, schedules
- **Projects**: (Coming soon)
- **Finance**: (Coming soon)
- **Inventory**: (Coming soon)
- **Files**: (Coming soon)

### UI Layout
- **Header**: Module navigation (grid icon), Dashboard button, notifications (with badge), profile dropdown
- **Side Drawer**: Module sections (collapsible with icons/titles)
- **Dashboard**: Customizable masonry grid of widgets (persistent across sessions)
- **Right-side Drawer**: Used for item details and forms throughout the app

### Permission System
- Permissions govern access to modules, sections, features, and buttons
- UI elements are only visible to users with required permissions
- Real-time events must respect permission boundaries

## Development Guidelines

### Component Development
- Create shared component files where possible for web/mobile reuse
- Put state, behavior, and permission checks in shared logic
- Use platform-specific wrappers only for styling/platform tweaks

### API Development
- Validate request bodies and query parameters
- Return typed responses matching frontend expectations
- Emit Socket.IO events immediately after data changes
- Ensure JWT payload includes user ID, roles, and permissions

### Database Access
- Interact with PostgreSQL exclusively through Prisma
- Use generated TypeScript types from Prisma client
- Enforce referential integrity and constraints at database level

## Code Organization & Maintenance Requirements

### Dummy Data Management
- Create clearly marked dummy data files in `data/dummy/` directory or with `*.dummy.ts` naming
- Use consistent naming conventions like `mock-*.ts` for temporary data
- Implement data abstraction layers to enable easy replacement with real data
- Document dummy data removal process in code comments

### Clean Codebase Standards
- NO obsolete files, directories, or unused code
- Remove temporary/experimental code immediately after testing
- Maintain only actively used code or code planned for future roadmap phases
- Regular cleanup during development phases

### Refactoring Guidelines
- Always reference `dev_notes/roadmap.md` before making structural changes
- Ensure refactoring doesn't break current functionality
- Plan refactoring to support future features (especially mobile compatibility from Phase 11+)
- Maintain backward compatibility until replacement features are complete
- Structure code to support the web → mobile development progression

### Organization Strategy
- Keep shared logic separate and reusable from day one (prepare for Phase 11.2)
- Follow the `shared/` directory approach for cross-platform components
- Implement TypeScript interfaces that work for both dummy and real data
- Design with mobile adaptation in mind throughout web development

## Roadmap Task Status System

Use this marking system in `dev_notes/roadmap.md` to track task progress:
- `- [ ]` - Not started
- `- [*]` - Started/In progress
- `- [-]` - Completed (ready for review)
- `- [+]` - Reviewed and approved (closed)

## Project Status

This is an early-stage project with comprehensive planning documentation but no implemented code yet. The specifications are defined in:
- `dev_notes/stack_specs.md`: Complete technology stack specifications
- `dev_notes/feachures.md`: Detailed feature requirements and UI layout
- `dev_notes/roadmap.md`: Complete numbered development roadmap (tasks 1.1.1 through 16.3.4)

Development follows the roadmap phases: Frontend prototype with dummy data (Phases 1-7) → Backend development (Phase 8) → Full integration (Phase 9) → Mobile development (Phases 11-13).