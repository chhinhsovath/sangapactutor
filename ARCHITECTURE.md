# Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                     (React 19 + Ant Design)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 SERVER                            │
│                      (App Router)                               │
│                                                                 │
│  ┌────────────────────┐         ┌─────────────────────────┐    │
│  │   Pages Layer      │         │     API Routes          │    │
│  │                    │         │                         │    │
│  │  • / (Home)        │◄────────┤  • GET /api/jobs        │    │
│  │  • /jobs/[slug]    │         │  • GET /api/jobs/[slug] │    │
│  │                    │         │  • GET /api/departments │    │
│  └────────────────────┘         │  • GET /api/locations   │    │
│           │                     └─────────────────────────┘    │
│           │                                  │                 │
│           ▼                                  ▼                 │
│  ┌────────────────────┐         ┌─────────────────────────┐    │
│  │   Components       │         │    Business Logic       │    │
│  │                    │         │                         │    │
│  │  • JobFilters      │         │  • Filter jobs          │    │
│  │  • JobList         │         │  • Query database       │    │
│  │  • JobCard         │         │  • Transform data       │    │
│  └────────────────────┘         └─────────────────────────┘    │
│                                              │                 │
└──────────────────────────────────────────────┼─────────────────┘
                                               │
                                               │ Drizzle ORM
                                               ▼
                              ┌─────────────────────────────┐
                              │    POSTGRESQL DATABASE      │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │  departments          │  │
                              │  │  • id, name, slug     │  │
                              │  └───────────────────────┘  │
                              │             │               │
                              │             │ FK            │
                              │             ▼               │
                              │  ┌───────────────────────┐  │
                              │  │  jobs                 │  │
                              │  │  • id, title, slug    │  │
                              │  │  • department_id      │  │
                              │  │  • location_id        │  │
                              │  │  • employment_type    │  │
                              │  │  • work_arrangement   │  │
                              │  │  • salary_min/max     │  │
                              │  │  • description, etc   │  │
                              │  └───────────────────────┘  │
                              │             ▲               │
                              │             │ FK            │
                              │             │               │
                              │  ┌───────────────────────┐  │
                              │  │  locations            │  │
                              │  │  • id, name, slug     │  │
                              │  └───────────────────────┘  │
                              │                             │
                              └─────────────────────────────┘
                                        │
                                        │ Docker
                                        ▼
                              ┌─────────────────────────────┐
                              │   Docker Container          │
                              │   postgres:16-alpine        │
                              │   Port: 5432                │
                              └─────────────────────────────┘
```

## Data Flow

### 1. Job Listing Flow
```
User visits "/" 
    → Page.tsx renders
    → useEffect fetches departments/locations
    → useEffect fetches jobs (with filters)
    → API Routes query database via Drizzle ORM
    → PostgreSQL returns data
    → Components render jobs grouped by department
```

### 2. Filtering Flow
```
User changes filter
    → Filter component calls onChange handler
    → State updates (selectedDepartment/Location/Type)
    → useEffect triggers with new dependencies
    → New API call with query parameters
    → Database filters results
    → UI re-renders with filtered jobs
```

### 3. Job Detail Flow
```
User clicks job card
    → Navigate to /jobs/[slug]
    → Page component fetches job by slug
    → API route queries database with slug
    → Returns job with related data (dept, location)
    → Page renders full job details
```

## Technology Stack Layers

```
┌──────────────────────────────────────────┐
│         Presentation Layer               │
│  • React 19 Components                   │
│  • Ant Design UI Library                 │
│  • Tailwind CSS Utilities                │
└──────────────────────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│         Application Layer                │
│  • Next.js 14 App Router                 │
│  • TypeScript Type Safety                │
│  • Client/Server Components              │
└──────────────────────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│         Business Logic Layer             │
│  • API Route Handlers                    │
│  • Data Validation (Zod)                 │
│  • Query Building                        │
└──────────────────────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│         Data Access Layer                │
│  • Drizzle ORM                           │
│  • Type-safe Queries                     │
│  • Relations & Joins                     │
└──────────────────────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│         Database Layer                   │
│  • PostgreSQL 16                         │
│  • ACID Transactions                     │
│  • Normalized Schema                     │
└──────────────────────────────────────────┘
```

## Component Hierarchy

```
App Root (layout.tsx)
│
├─ AntdRegistry
│  └─ ConfigProvider (theme)
│     │
│     ├─ Home Page (/)
│     │  ├─ Layout (Header, Content, Footer)
│     │  │  ├─ Header (Company branding)
│     │  │  ├─ Content
│     │  │  │  ├─ Title + Badge (job count)
│     │  │  │  ├─ JobFilters
│     │  │  │  │  ├─ Select (Department)
│     │  │  │  │  ├─ Select (Location)
│     │  │  │  │  ├─ Select (Employment Type)
│     │  │  │  │  └─ Button (Reset)
│     │  │  │  └─ JobList
│     │  │  │     └─ Department Groups
│     │  │  │        └─ JobCard (for each job)
│     │  │  └─ Footer (links)
│     │  │
│     │  └─ Job Detail Page (/jobs/[slug])
│     │     ├─ Layout (Header, Content, Footer)
│     │     │  ├─ Header (same)
│     │     │  ├─ Content
│     │     │  │  ├─ Back button
│     │     │  │  └─ Card
│     │     │  │     ├─ Title + Tags
│     │     │  │     ├─ Location + Salary
│     │     │  │     ├─ Description
│     │     │  │     ├─ Responsibilities
│     │     │  │     ├─ Requirements
│     │     │  │     ├─ Benefits
│     │     │  │     └─ Apply Button
│     │     │  └─ Footer (same)
```

## Development Workflow

```
Developer
    │
    ├─ Code Changes
    │  └─ Hot Module Replacement (HMR)
    │     └─ Instant Browser Update
    │
    ├─ Database Changes
    │  ├─ Modify schema.ts
    │  ├─ npm run db:generate (create migration)
    │  └─ npm run db:migrate (apply migration)
    │
    ├─ View Database
    │  └─ npm run db:studio (Drizzle Studio GUI)
    │
    └─ Code Quality
       ├─ TypeScript compiler checks
       └─ npm run lint (ESLint)
```

## Deployment Architecture

```
                    ┌──────────────┐
                    │   GitHub     │
                    └──────┬───────┘
                           │ Push
                           ▼
                    ┌──────────────┐
                    │   Vercel     │
                    │  (Auto CI/CD)│
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌───────────────┐     ┌──────────────┐
        │  Next.js App  │────▶│  PostgreSQL  │
        │  (Serverless) │     │  (Managed)   │
        └───────────────┘     └──────────────┘
                │
                │ Serve
                ▼
        ┌───────────────┐
        │     Users     │
        │   (Global)    │
        └───────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. Environment Variables               │
│     • DATABASE_URL not exposed          │
│     • NEXT_PUBLIC_* for client-safe     │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│  2. Type Safety                         │
│     • TypeScript prevents type errors   │
│     • Zod validates runtime data        │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│  3. Database Security                   │
│     • Parameterized queries (Drizzle)   │
│     • SQL injection prevention          │
│     • Connection pooling                │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│  4. API Security                        │
│     • Input validation                  │
│     • Error handling                    │
│     • Rate limiting (ready to add)      │
└─────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────┐
│  Frontend                               │
│  • React 19 Compiler optimizations      │
│  • Code splitting (automatic)           │
│  • Image optimization (Next.js)         │
│  • CSS-in-JS (Ant Design)               │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│  API Layer                              │
│  • Efficient database queries           │
│  • Proper indexing (id, slug)           │
│  • Connection pooling                   │
│  • Response caching (ready to add)      │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│  Database                               │
│  • Indexed columns (PK, FK, unique)     │
│  • Optimized JOIN queries               │
│  • Connection pooling                   │
│  • Query plan optimization              │
└─────────────────────────────────────────┘
```

  1. Admin Account

  - Email: admin@tutorhub.com
  - Password: admin123
  - Role: Administrator
  - Access: Full admin dashboard with user management, analytics, etc.

  2. Student Account

  - Email: john@example.com
  - Password: student123
  - Role: Student
  - Name: John Smith
  - Access: Student dashboard to find tutors, book lessons, messages

  3. Tutor Account

  - Email: sarah@example.com
  - Password: tutor123
  - Role: Tutor
  - Name: Sarah Johnson
  - Access: Tutor dashboard to manage schedule, students, earnings, reviews