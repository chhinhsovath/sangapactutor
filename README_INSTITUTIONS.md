# 🎓 EduConnect - Multi-Institution Social Impact Platform

## 📖 Platform Overview

**EduConnect** transforms your tutoring platform into a **multi-purpose SaaS system** where:
- 🏫 **Universities** can manage their student tutoring programs
- 🎓 **Students** earn academic credits by tutoring others
- 🤝 **Cross-institution matching** creates urban → rural educational equity
- 📊 **Impact tracking** measures social benefit

### The Problem We Solve

Well-educated students in Phnom Penh (RUPP, ITC) have valuable skills (English, Finance, Programming) but remote students (Kampong Cham, Battambang) lack access. Traditional approaches don't scale.

### Our Solution

**Institutional Credit Requirement:**
- Universities require students to tutor **3-6 times per academic year**
- Students earn **0.5 credits per session**
- Credits count toward graduation requirements
- Platform matches urban tutors with rural students automatically

**Result:** Sustainable, scalable knowledge transfer that benefits everyone.

---

## 🚀 Quick Start (5 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npm run db:push

# 3. Seed demo data
npm run db:seed:institutions

# 4. Start dev server
npm run dev

# 5. Open browser
open http://localhost:3000/dashboard/institution
```

---

## 🏗️ What We've Built

### ✅ 1. Institution Management System

**API Endpoints:**
- `GET/POST /api/institutions` - List/create institutions
- `GET/PUT/DELETE /api/institutions/[id]` - Manage institution
- `POST /api/institutions/[id]/enroll` - Enroll students
- `GET /api/institutions/[id]/enroll` - List enrolled students
- `DELETE /api/institutions/[id]/enroll/[userId]` - Unenroll

**Features:**
- Multi-institution SaaS architecture
- Partnership tiers: Free (50 students), Basic (100), Premium (200), Enterprise (unlimited)
- Credit system configuration per institution
- Student enrollment with limits
- Bilingual support (Khmer/English)

**Dashboard:** `/dashboard/institution`
- Real-time enrollment stats
- Credit system overview
- Quick actions panel

---

### ✅ 2. Credit Tracking & Approval Workflow

**The Complete Flow:**
```
1. Student completes tutoring session
   ↓
2. Marks session as completed (earns 0.5 credits)
   ↓
3. Submits for credit approval
   ↓
4. Faculty coordinator reviews
   ↓
5. Approves/rejects with notes
   ↓
6. Credits automatically added to balance
   ↓
7. Student tracks progress toward 3-6 credit requirement
```

**API Endpoints:**
- `GET/POST /api/credits` - List/submit transactions
- `POST /api/credits/[id]/approve` - Faculty approval
- `POST /api/credits/[id]/reject` - Rejection
- `POST /api/credits/[id]/credit` - Apply to balance
- `POST /api/bookings/[id]/complete` - Mark session done

**Dashboards:**
- `/dashboard/institution/credits` - Faculty approval queue
- `/dashboard/student/credits` - Student progress tracker

**States:** Pending → Approved → Credited (or Rejected)

---

### ✅ 3. Cross-Institution Matching Engine

**Smart Algorithm:**
```typescript
Match Score =
  + 30 points (cross-institution - HIGH IMPACT)
  + 20 points per matching subject
  + 10 points (same academic year)
  + 5 points (online availability)

Minimum threshold: 30 points
```

**Two Matching Modes:**
1. **Manual** - Coordinator creates match directly
2. **Algorithm** - AI suggests best matches based on:
   - Subject expertise
   - Geographic diversity (urban→rural priority)
   - Availability compatibility
   - Social impact potential

**API Endpoints:**
- `GET/POST /api/matching/preferences` - Set tutoring preferences
- `GET/POST /api/matching/matches` - List/create matches
- `POST /api/matching/matches/[id]/accept` - Accept match
- `POST /api/matching/matches/[id]/reject` - Reject match

**Dashboards:**
- `/dashboard/student/matching/preferences` - Set availability
- `/dashboard/student/matching` - View & accept matches

**Match Flow:** Proposed → Pending (both accept) → Active → Completed

---

### ✅ 4. Social Impact Analytics

**Metrics Tracked:**
- Total matches created
- Cross-institution matches (%)
- Sessions completed
- Credits earned across platform
- Active student tutors
- Participating institutions

**Impact Score Formula:**
```
Institution Impact Score =
  + 10 points per cross-institution match
  + 5 points per completed session
  + Student satisfaction rating
  + Geographic diversity bonus
```

**Dashboard:** `/dashboard/admin/impact`
- Platform-wide statistics
- Urban → Rural flow visualization (chart)
- Institution rankings
- Academic year filtering

---

## 🗄️ Database Schema

### New Tables (6):

```sql
-- Institution management
institutions          -- Universities/colleges
partnerships          -- Billing tiers (Free/Basic/Premium/Enterprise)

-- Credit system
credit_transactions   -- Student credit earning history

-- Matching system
matching_preferences  -- Tutor availability & preferences
matches              -- Tutor-mentee pairs with scores
```

### Extended Tables:

```sql
users
  + institution_id    -- Which university
  + student_id        -- Institution's student ID
  + credit_balance    -- Total credits earned
  + academic_year     -- e.g., "2024-2025"

bookings
  + is_credit_eligible  -- Can earn credits?
  + session_type        -- tutoring/mentoring/counseling
  + credit_value        -- Credits for this session
  + completed_at        -- When finished
  + institution_approved -- Faculty approved?
```

### New User Roles (11 total):

```typescript
'student'              // Original
'tutor'                // Original
'admin'                // Original
'institution_admin'    // Manages university account ✨
'faculty_coordinator'  // Approves credits ✨
'student_coordinator'  // Matches students ✨
'verified_tutor'       // Credit-earning student tutor ✨
'mentee'               // Rural student receiving help ✨
'institution_viewer'   // Read-only analytics ✨
'super_admin'          // Platform-wide management ✨
'partner_manager'      // Manages partnerships ✨
```

---

## 📦 Demo Data (Seed Script)

Run: `npm run db:seed:institutions`

**Creates:**
- ✅ 4 institutions (RUPP, ITC, Kampong Cham, Battambang)
- ✅ 12 users (5 tutors, 5 mentees, 2 faculty coordinators)
- ✅ Matching preferences for all tutors
- ✅ 5 cross-institution matches (3 accepted, 2 pending)
- ✅ 10 completed sessions with credit transactions
- ✅ Partnership tiers assigned

**Test Users Created:**

| Name | Institution | Role | User ID |
|------|------------|------|---------|
| Sokha Chan | RUPP | verified_tutor | 1 |
| Dara Meas | RUPP | verified_tutor | 2 |
| Rith Sambo | ITC | verified_tutor | 4 |
| Sophea Prak | Kampong Cham | mentee | 6 |
| Dr. Sovan Kim | RUPP | faculty_coordinator | 11 |

**Test Scenarios:**
1. **Sokha (RUPP)** tutoring **Sophea (Kampong Cham)** - Cross-institution match (Score: 85)
2. **Dara (RUPP)** tutoring **Bopha (Kampong Cham)** - Already 3 sessions completed
3. **Pending credit approval** - Faculty can test approval workflow

---

## 🎯 Complete User Journeys

### Journey 1: Student Tutor Earns Credits

```
1. Sokha (RUPP student) sets matching preferences
   → /dashboard/student/matching/preferences
   → Subjects: Math, Finance
   → Prefer remote students: ✓

2. Algorithm matches him with Sophea (rural student)
   → Match score: 85 (cross-institution + subject match)
   → Both accept

3. They complete 3 tutoring sessions
   → Each session: 60 minutes
   → Mark as completed via API

4. Sokha submits for credits
   → POST /api/credits
   → 3 sessions × 0.5 = 1.5 credits

5. Dr. Sovan (faculty) reviews
   → /dashboard/institution/credits
   → Approves with note

6. Credits applied automatically
   → Sokha's balance: 0 → 1.5 credits
   → Progress: 50% toward minimum (3 credits)
```

### Journey 2: Institution Admin Manages Program

```
1. View enrolled students
   → /dashboard/institution/students
   → See all RUPP students

2. Review credit requests
   → /dashboard/institution/credits
   → 10 pending approvals

3. Approve credits
   → Click "Review" → "Approve & Apply Credits"
   → Student balance updates instantly

4. Track institution impact
   → /dashboard/institution
   → Total credits earned: 211.5
   → Students served: 67
```

### Journey 3: Admin Tracks Social Impact

```
1. View platform metrics
   → /dashboard/admin/impact
   → 156 total matches
   → 98 cross-institution (63%)

2. Analyze flow
   → Chart shows RUPP sent 25 tutors
   → Kampong Cham received 22 students
   → High impact achieved

3. Institution rankings
   → RUPP: Impact Score 85 (Top)
   → Cross-institution prioritization working
```

---

## 📁 File Structure

```
/app/api/
├── institutions/
│   ├── route.ts              # List/create institutions
│   ├── [id]/route.ts          # CRUD operations
│   └── [id]/enroll/           # Student enrollment
│       ├── route.ts           # Enroll/list students
│       └── [userId]/route.ts  # Unenroll
├── credits/
│   ├── route.ts              # List/submit transactions
│   ├── [id]/approve/route.ts # Approve
│   ├── [id]/reject/route.ts  # Reject
│   └── [id]/credit/route.ts  # Apply to balance
├── bookings/
│   └── [id]/complete/route.ts # Mark session done
└── matching/
    ├── preferences/route.ts   # Get/set preferences
    └── matches/
        ├── route.ts           # List/create matches
        ├── [id]/accept/route.ts
        └── [id]/reject/route.ts

/app/dashboard/
├── institution/
│   ├── page.tsx              # Overview
│   ├── students/page.tsx     # Manage students
│   └── credits/page.tsx      # Approve credits
├── student/
│   ├── credits/page.tsx      # Track progress
│   └── matching/
│       ├── page.tsx          # View matches
│       └── preferences/page.tsx
└── admin/
    └── impact/page.tsx       # Platform metrics

/lib/db/
├── schema.ts                 # Extended schema
└── seed-institutions.ts      # Demo data
```

---

## 🧪 Testing

See **`TESTING_CHECKLIST.md`** for comprehensive testing guide.

**Quick Test:**
```bash
# 1. Seed data
npm run db:seed:institutions

# 2. Test institution dashboard
open http://localhost:3000/dashboard/institution

# 3. Test credit approvals
open http://localhost:3000/dashboard/institution/credits

# 4. Test student credits
open http://localhost:3000/dashboard/student/credits

# 5. Test matching
open http://localhost:3000/dashboard/student/matching
```

**API Testing (Postman):**
```bash
# Get institution with stats
GET http://localhost:3000/api/institutions/1

# List credit transactions
GET http://localhost:3000/api/credits?institutionId=1&status=pending

# Get matches for user
GET http://localhost:3000/api/matching/matches?userId=1&role=tutor
```

---

## 📚 Documentation

- **`NEXT_STEPS.md`** - Implementation roadmap (Weeks 1-5)
- **`TESTING_CHECKLIST.md`** - Comprehensive testing guide
- **`ARCHITECTURE.md`** - Original vision and architecture

---

## ⚠️ Known Limitations

### Current State:
1. **No Authentication** - Uses hardcoded user IDs
   - Institution ID: `1` (RUPP)
   - User ID: `123` (various pages)
   - Need to implement NextAuth

2. **Missing Pages:**
   - `/dashboard/institution/settings` - Edit institution
   - `/dashboard/institution/analytics` - Detailed charts
   - `/login` - Auth system

3. **No Real-time:**
   - Manual page refresh needed
   - Need WebSocket for notifications

4. **No File Uploads:**
   - Institution logos (URL only)
   - User avatars (URL only)

### Next Phase (Week 1-2):
- [ ] Add NextAuth authentication
- [ ] Build login/registration pages
- [ ] Add notifications system
- [ ] Enable messaging between users
- [ ] Complete missing dashboards

---

## 🎯 Success Metrics

### Platform Impact:
- **Educational Equity:** % of cross-institution matches
- **Student Participation:** Active tutors per institution
- **Credit Achievement:** % students meeting requirements
- **Geographic Reach:** Provinces served

### Business Metrics:
- **Institutions Onboarded:** Target 10 in Year 1
- **Student Tutors Active:** Target 500 in Year 1
- **Sessions Completed:** Target 5,000 in Year 1
- **Revenue (SaaS):** Premium tier adoption rate

---

## 🚀 Deployment Checklist

### Before Production:
- [ ] Set up authentication (NextAuth)
- [ ] Add environment variables for production
- [ ] Set up production database (Neon/Supabase)
- [ ] Configure email service (Resend/SendGrid)
- [ ] Add error monitoring (Sentry)
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Domain and SSL configuration
- [ ] Security audit
- [ ] Load testing
- [ ] Backup strategy

### Launch Plan:
1. **Week 1-2:** Pilot with RUPP (50 students)
2. **Week 3-4:** Add ITC (30 students)
3. **Month 2:** Expand to rural institutions
4. **Month 3:** Full platform launch

---

## 🙏 Acknowledgments

Built with:
- **Next.js 16** - React framework
- **Ant Design 5** - UI component library
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Database
- **NextAuth** - Authentication (coming soon)

---

## 📞 Support

For questions or issues:
- GitHub Issues: [Create Issue]
- Documentation: See `/docs` folder
- Email: support@educonnect.kh

---

## 🎉 What's Next?

See **`NEXT_STEPS.md`** for detailed roadmap.

**Immediate priorities:**
1. Run the demo (`npm run db:seed:institutions`)
2. Test all features (see `TESTING_CHECKLIST.md`)
3. Add authentication system
4. Schedule stakeholder demo
5. Begin pilot program planning

**Your platform is ready to transform education in Cambodia! 🇰🇭**
