# Setup Guide

Complete setup instructions for the SA Jobs platform.

## Option 1: Quick Setup with Docker

### 1. Start PostgreSQL with Docker Compose

```bash
docker-compose up -d
```

This will start a PostgreSQL database on `localhost:5432`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

The `.env.local` file is already configured for Docker PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sajobs
NEXT_PUBLIC_COMPANY_NAME=Sesame
NEXT_PUBLIC_COMPANY_WEBSITE=https://sesame.com
NEXT_PUBLIC_COMPANY_LOGO=/logo.svg
```

### 4. Run Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Option 2: Using Existing PostgreSQL

### 1. Create Database

```sql
CREATE DATABASE sajobs;
```

### 2. Update Environment Variables

Edit `.env.local`:

```env
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/sajobs
```

### 3. Follow Steps 2-6 from Option 1

---

## Option 3: Using Cloud PostgreSQL

### Vercel Postgres

1. Create Vercel Postgres database
2. Copy connection string
3. Update `.env.local`:

```env
DATABASE_URL=your_vercel_postgres_url
```

### Supabase

1. Create Supabase project
2. Get connection string from Settings > Database
3. Update `.env.local`

### Neon

1. Create Neon project
2. Copy connection string
3. Update `.env.local`

---

## Verification

After setup, verify everything works:

### 1. Check Database Connection

```bash
npm run db:studio
```

This opens Drizzle Studio. If it connects, your database is configured correctly.

### 2. Check API Endpoints

Start the dev server and test:

- [http://localhost:3000/api/jobs](http://localhost:3000/api/jobs)
- [http://localhost:3000/api/departments](http://localhost:3000/api/departments)
- [http://localhost:3000/api/locations](http://localhost:3000/api/locations)

### 3. Check Frontend

Visit [http://localhost:3000](http://localhost:3000) and verify:
- Job listings appear
- Filters work
- Job detail pages load
- No console errors

---

## Troubleshooting

### Database Connection Errors

**Error**: `Connection refused`

- Check PostgreSQL is running: `docker ps` or `pg_isready`
- Verify DATABASE_URL in `.env.local`
- Check firewall/network settings

**Error**: `Authentication failed`

- Verify username/password in DATABASE_URL
- Check PostgreSQL user permissions

### Migration Errors

**Error**: `Relation already exists`

- Drop and recreate database:
```bash
docker-compose down -v
docker-compose up -d
npm run db:migrate
```

### Build Errors

**Error**: `Module not found`

```bash
rm -rf node_modules package-lock.json
npm install
```

**Error**: TypeScript errors

```bash
npm run lint
```

---

## Next Steps

1. **Customize Branding** - Edit `.env.local` company settings
2. **Add More Jobs** - Use Drizzle Studio or seed script
3. **Customize Theme** - Edit `app/layout.tsx` ConfigProvider
4. **Add Application Form** - Create `/app/apply/[slug]/page.tsx`
5. **Add Admin Panel** - Build protected routes for job management

---

## Production Deployment

### Environment Variables Required

```env
DATABASE_URL=your_production_postgres_url
NEXT_PUBLIC_COMPANY_NAME=Your Company
NEXT_PUBLIC_COMPANY_WEBSITE=https://yourcompany.com
NEXT_PUBLIC_COMPANY_LOGO=/logo.svg
```

### Vercel Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Run migrations: Use Vercel CLI or connect to DB directly

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm run start
```
