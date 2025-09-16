# Shared Components & Logic

This directory contains reusable code that will be shared between the web frontend and mobile app (Phase 11+).

⚠️ **Important**: This directory is specifically for **cross-platform** code (web ↔ mobile). For code shared within just the web app, use `/types/common.ts` or `/lib/` instead.

## Structure

- **`components/`** - Platform-agnostic business logic components
- **`hooks/`** - Custom React hooks for shared functionality
- **`utils/`** - Utility functions and helpers
- **`types/`** - TypeScript interfaces and types for cross-platform data structures
- **`constants/`** - Application constants and configuration

## Usage Guidelines

- All business logic, state management, and permission checks should go in shared components
- Platform-specific wrappers use `.web.tsx` and `.native.tsx` extensions
- Only styling and platform-specific tweaks should go in platform files
- Shared theme and design tokens are exported from this directory

## Development Notes

- **Phases 1-10 (Web only)**: This directory remains mostly empty, components live in `/components/`
- **Phase 11+ (Mobile development)**: Components are moved here and restructured for cross-platform sharing
- **Web-only shared code**: Use `/types/common.ts`, `/lib/utils.ts`, etc. instead of this directory