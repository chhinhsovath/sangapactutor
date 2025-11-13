# SA Jobs - Modern Job Board Platform

A modern, full-featured job board clone built with **Next.js 14**, **Ant Design**, and **PostgreSQL**. Inspired by AshbyHQ's job board design.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **UI Library**: Ant Design 5 (antd)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS + Ant Design
- **Validation**: Zod

## Features

✅ **Job Listings** - Display all open positions with rich metadata
✅ **Advanced Filtering** - Filter by department, location, and employment type
✅ **Job Details** - Comprehensive job detail pages
✅ **Responsive Design** - Mobile-first, works on all devices
✅ **Type-Safe** - Full TypeScript coverage
✅ **Database Schema** - Normalized PostgreSQL schema with Drizzle ORM
✅ **API Routes** - RESTful API endpoints for jobs, departments, and locations
✅ **Grouping** - Jobs grouped by department
✅ **Salary Display** - Formatted salary ranges (yearly/hourly)
✅ **Work Arrangement Tags** - On-site, Remote, Hybrid indicators

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your database:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sajobs
NEXT_PUBLIC_COMPANY_NAME=Sesame
NEXT_PUBLIC_COMPANY_WEBSITE=https://sesame.com
```

3. **Generate and run database migrations**:
```bash
npm run db:generate
npm run db:migrate
```

4. **Seed the database** (optional):
```bash
npm run db:seed
```

5. **Start the development server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

**departments**
- `id` (serial, primary key)
- `name` (varchar, unique)
- `slug` (varchar, unique)
- `created_at` (timestamp)

**locations**
- `id` (serial, primary key)
- `name` (varchar, unique)
- `slug` (varchar, unique)
- `created_at` (timestamp)

**jobs**
- `id` (serial, primary key)
- `title` (varchar)
- `slug` (varchar, unique)
- `department_id` (integer, foreign key)
- `location_id` (integer, foreign key)
- `employment_type` (enum: Full time, Part time, Contract, Internship)
- `work_arrangement` (enum: On-site, Remote, Hybrid)
- `salary_min` (integer, nullable)
- `salary_max` (integer, nullable)
- `salary_period` (varchar: 'year' or 'hour')
- `description` (text)
- `requirements` (text, nullable)
- `responsibilities` (text, nullable)
- `benefits` (text, nullable)
- `is_active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Project Structure

```
sa-jobs/
├── app/
│   ├── api/
│   │   ├── departments/route.ts    # GET departments
│   │   ├── locations/route.ts      # GET locations
│   │   └── jobs/
│   │       ├── route.ts            # GET jobs (with filters)
│   │       └── [slug]/route.ts     # GET job by slug
│   ├── jobs/
│   │   └── [slug]/page.tsx         # Job detail page
│   ├── layout.tsx                  # Root layout with AntD
│   └── page.tsx                    # Home page (job listings)
├── components/
│   ├── filters/
│   │   └── JobFilters.tsx          # Filter controls
│   └── job-list/
│       ├── JobCard.tsx             # Individual job card
│       └── JobList.tsx             # Jobs list with grouping
├── lib/
│   ├── db/
│   │   ├── index.ts                # Database client
│   │   ├── schema.ts               # Drizzle schema
│   │   ├── migrate.ts              # Migration runner
│   │   └── seed.ts                 # Database seeder
│   └── types.ts                    # TypeScript types
├── drizzle.config.ts               # Drizzle Kit config
└── package.json
```

## API Endpoints

### GET `/api/jobs`
Retrieve all active jobs with optional filters.

**Query Parameters**:
- `department` - Filter by department slug
- `location` - Filter by location slug
- `employmentType` - Filter by employment type

**Response**:
```json
[
  {
    "id": 1,
    "title": "Senior Software Engineer",
    "slug": "senior-software-engineer",
    "department": { "id": 1, "name": "Software", "slug": "software" },
    "location": { "id": 1, "name": "San Francisco", "slug": "san-francisco" },
    "employmentType": "Full time",
    "workArrangement": "Hybrid",
    "salaryMin": 150000,
    "salaryMax": 220000,
    "salaryPeriod": "year",
    ...
  }
]
```

### GET `/api/jobs/[slug]`
Retrieve a single job by slug.

### GET `/api/departments`
Retrieve all departments.

### GET `/api/locations`
Retrieve all locations.

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with sample data |

## Database Management

### Using Drizzle Studio

Drizzle Studio provides a GUI for your database:

```bash
npm run db:studio
```

Access at [https://local.drizzle.studio](https://local.drizzle.studio)

### Adding New Jobs

You can:
1. Use Drizzle Studio GUI
2. Add seed data to `lib/db/seed.ts`
3. Create an admin API endpoint (future enhancement)

## Customization

### Branding

Update environment variables in `.env.local`:
```env
NEXT_PUBLIC_COMPANY_NAME=Your Company
NEXT_PUBLIC_COMPANY_WEBSITE=https://yourcompany.com
NEXT_PUBLIC_COMPANY_LOGO=/your-logo.svg
```

### Theme Colors

Edit `app/layout.tsx` to customize Ant Design theme:
```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#your-color',
      borderRadius: 8,
    },
  }}
>
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Hosting

- **Vercel Postgres** - Integrated with Vercel
- **Supabase** - Free tier available
- **Neon** - Serverless Postgres
- **Railway** - Full Postgres instance

## License

MIT
# sangapactutor
