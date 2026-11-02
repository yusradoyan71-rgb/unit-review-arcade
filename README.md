# UNIT REVIEW ARCADE

> Modern, interactive, expandable educational game platform for Grade 7 and Grade 8 English classes, optimized for classroom interactive smartboards.

## Overview

UNIT REVIEW ARCADE is a teacher-operated smartboard platform engineered to conduct engaging, high-energy unit reviews without personal student accounts, logins, or cloud dependencies.

- **Smartboard Optimized**: Designed for 16:9 interactive displays with touch-friendly controls and large typography.
- **Architectural Separation**: Complete separation of game mechanics from educational content.
- **Independent Libraries**: Grade 7 and Grade 8 maintain independent unit and activity vaults.
- **LocalStorage Persistence**: All units, activities, and questions are stored locally in the browser cache.
- **JSON Backup & Restore**: Full JSON schema import and export for saving and restoring content across devices.

## Technology Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide React**
- **Procedural Web Audio API** (100% offline audio synthesis)

## Project Structure

```
src/
├── components/
│   ├── common/       # ClassroomHeader, EmptyState, ToastContainer
│   ├── home/         # HomeScreen (Grade 7 & Grade 8 interactive cards)
│   ├── library/      # UnitLibraryScreen
│   ├── dashboard/    # UnitDashboardScreen
│   └── teacher/      # TeacherPanelModal (Units, Activities, Backup/Restore)
├── context/          # ArcadeContext
├── services/         # StorageService, SoundEffectsService
└── types/            # Schema definitions (Grade, Unit, Activity, GameType)
```

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
