# Commander AI — Foundation (Phase 1.1)

An enterprise-ready, modular, futuristic foundation for **Commander AI** — an AI Operating System.

## Architecture Overview

Phase 1.1 focuses on delivering a production-quality architectural foundation, authentication subsystem, modular database models, and modern user dashboard.

### Core Modules
- **Frontend Architecture**: React 19 + TypeScript + Tailwind CSS with modular view structure (`components/`, `views/`, `services/`, `auth/`, `hooks/`, `types/`, `config/`, `database/`).
- **Backend Architecture**: Express API backend serving authentication routes, session security, database operations, user profiles, system activity logging, and setting controls.
- **Database Schema**: Structured models for `User`, `Session`, `Settings`, `Project`, and `ActivityLog`.
- **Authentication**: Simulated & OAuth integrations (Google & GitHub login), session state management, profile auto-creation, and logout handling.
- **UI / UX**: Futuristic dark and light theme options, high contrast typography, left sidebar navigation (Dashboard, Commander phase notice, Projects, Activity, Settings, Profile), and interactive notifications.

---

## Folder Structure

```
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
├── server.ts                  # Express backend server with Vite integration
└── src/
    ├── main.tsx               # App entry point
    ├── App.tsx                # Main container & layout router
    ├── types/                 # TypeScript interfaces and models
    │   └── index.ts
    ├── config/                # App configuration constants
    │   └── appConfig.ts
    ├── database/              # DB schemas and mock models (User, Session, Settings)
    │   └── schema.ts
    ├── auth/                  # Auth Context, session handlers, Google & GitHub login
    │   └── AuthContext.tsx
    ├── services/              # API Client & Backend REST services
    │   └── apiService.ts
    ├── hooks/                 # Custom React hooks (useAuth, useSettings, useProjects)
    │   └── useCommander.ts
    ├── utils/                 # Formatting, theme, storage helpers
    │   └── theme.ts
    ├── components/            # UI Components
    │   ├── Sidebar.tsx
    │   ├── TopNav.tsx
    │   ├── CommanderNoticeModal.tsx
    │   ├── AuthModal.tsx
    │   ├── QuickStatsCard.tsx
    │   └── StatusBadge.tsx
    └── views/                 # Core Screens
        ├── DashboardView.tsx
        ├── ProjectsView.tsx
        ├── ActivityView.tsx
        ├── SettingsView.tsx
        └── ProfileView.tsx
```

---

## Phase 1.1 Status & Activation

- **Activated Features**: Dashboard, Projects Manager, Activity Logging, User Profile, OAuth Login (Google/GitHub), Settings (Dark/Light Mode, Accent Theme, Language Selection, Notifications), Express backend APIs, Docker containers.
- **Phase 1.2 Notice**: The **Commander** AI execution engine is primed for Phase 1.2 activation. Clicking the Commander menu item displays the formal Phase 1.2 activation notice.

---

## Quick Start

### Development Mode
```bash
npm run dev
```

### Production Build & Containerization
```bash
npm run build
npm start
```

Or run via Docker Compose:
```bash
docker-compose up --build
```
