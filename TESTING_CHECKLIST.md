# ✅ Testing Checklist - EduConnect Platform

## 🚀 Quick Start (5 Minutes)

### Step 1: Verify Database Connection
```bash
# Check your .env.local file has:
DATABASE_URL=postgresql://user:password@host:port/database

# Test connection
npm run db:studio
# Should open Drizzle Studio successfully
```

### Step 2: Apply Database Schema
```bash
# Push all schema changes
npm run db:push

# Expected output:
# ✓ Pulling schema from database...
# ✓ Changes applied
```

### Step 3: Seed Demo Data
```bash
# Run the comprehensive seed script
npm run db:seed:institutions

# Expected output:
# 🏫 Seeding institutions...
#   ✓ Created institution: Royal University of Phnom Penh
#   ✓ Created institution: Institute of Technology of Cambodia
#   ... (etc)
# ✅ Seed completed successfully!
```

### Step 4: Start Development Server
```bash
npm run dev

# Should start on http://localhost:3000
```

---

## 📋 Feature Testing Checklist

### 1. Institution Management System

#### 1.1 View Institution Dashboard
- [ ] Navigate to: http://localhost:3000/dashboard/institution
- [ ] Verify displays: Institution name, type, tier
- [ ] Check stats cards show correct numbers:
  - [ ] Enrolled Students count
  - [ ] Total Credits Earned
  - [ ] Credits Approved count
  - [ ] Pending Approval count
- [ ] Verify credit system configuration displays correctly
- [ ] Test "Quick Actions" buttons navigate correctly

**Expected Data (from seed):**
- Institution: Royal University of Phnom Penh
- Type: university
- Tier: PREMIUM
- Enrolled Students: ~12 users

#### 1.2 Manage Enrolled Students
- [ ] Navigate to: http://localhost:3000/dashboard/institution/students
- [ ] Verify table displays all enrolled students
- [ ] Test search functionality (search by name)
- [ ] Test role filter dropdown
- [ ] Check credit balance displays correctly
- [ ] Test "Unenroll" button (should show confirmation modal)
- [ ] Test "Enroll Student" button:
  - [ ] Modal opens
  - [ ] Try enrolling user ID: 1
  - [ ] Check for partnership limit validation

**Expected Data:**
- Should see: Sokha Chan, Dara Meas, Veasna Keo (RUPP students)
- Roles: verified_tutor, faculty_coordinator
- Credit balances: 2.5, 3.0, 1.5

---

### 2. Credit Tracking & Approval System

#### 2.1 Faculty Credit Approvals
- [ ] Navigate to: http://localhost:3000/dashboard/institution/credits
- [ ] Check "Pending Review" tab has transactions
- [ ] Click "Review" on a pending transaction
- [ ] Verify modal shows:
  - [ ] Student details
  - [ ] Credits earned
  - [ ] Booking ID
  - [ ] Submission date
- [ ] Test "Quick Approve" button
- [ ] Test "Approve & Apply Credits" button in modal
- [ ] Verify transaction moves to "Approved" tab
- [ ] Check "Credited" tab shows credited transactions
- [ ] Test "Rejected" tab

**Expected Data:**
- Should see ~10 credit transactions
- Mix of pending, approved, and credited statuses
- Students: Sokha, Dara, Veasna, Rith, Thida

#### 2.2 Student Credit Tracker
- [ ] Navigate to: http://localhost:3000/dashboard/student/credits
- [ ] Verify credit balance card shows correct total
- [ ] Check progress bar displays percentage
- [ ] Verify "Minimum required" message is accurate
- [ ] Check "Sessions Completed" stat is correct
- [ ] Verify transaction history table:
  - [ ] Shows all transactions for student
  - [ ] Status tags are correct colors
  - [ ] Credited dates display correctly
- [ ] Check timeline view shows chronological history
- [ ] Verify review notes display if present

**Test with User IDs:**
- User ID 1 (Sokha): Should have 2.5 credits
- User ID 2 (Dara): Should have 3.0 credits

**Expected UI:**
- Progress bar: 2.5/6 = ~42%
- Status: "You need 0.5 more credits to meet minimum requirement"

---

### 3. Matching System

#### 3.1 Matching Preferences
- [ ] Navigate to: http://localhost:3000/dashboard/student/matching/preferences
- [ ] Verify all form fields render correctly:
  - [ ] Subjects dropdown (multi-select)
  - [ ] Preferred institutions (multi-select)
  - [ ] Session types checkboxes
  - [ ] Max sessions per week input
  - [ ] Available days checkboxes
  - [ ] Online only switch
  - [ ] Prioritize remote students switch
  - [ ] Activate matching switch
- [ ] Test saving preferences:
  - [ ] Select 2-3 subjects
  - [ ] Select max 3 sessions/week
  - [ ] Check Monday, Wednesday, Friday
  - [ ] Enable "Prioritize Remote Students"
  - [ ] Click "Save Preferences"
  - [ ] Should show success message
- [ ] Refresh page - verify preferences persisted

**Expected Data (from seed):**
- Existing preferences for tutors (Users 1-5)
- Subjects: [1, 2, 3] (Math, English, Programming)
- Available days: Monday, Wednesday, Friday

#### 3.2 View and Accept Matches
- [ ] Navigate to: http://localhost:3000/dashboard/student/matching
- [ ] Check "Pending Matches" tab shows matches
- [ ] Verify match cards display:
  - [ ] Partner name/ID
  - [ ] Match score (stars rating)
  - [ ] Cross-institution tag
  - [ ] Match reason
  - [ ] Status tag
- [ ] Click "View Details" on a match
- [ ] Verify modal shows complete information
- [ ] Test "Accept Match" button:
  - [ ] Should show success message
  - [ ] If other party already accepted, status → "Active"
  - [ ] Otherwise shows "Waiting for other party"
- [ ] Test "Reject Match" button
- [ ] Check "Active Matches" tab
- [ ] Verify accepted matches show in Active tab

**Expected Data (from seed):**
- 5 matches created
- 3 accepted (both parties)
- 2 pending (waiting acceptance)
- Match scores: 85, 78, 92, 88, 75

---

### 4. Admin Impact Dashboard

#### 4.1 View Platform Metrics
- [ ] Navigate to: http://localhost:3000/dashboard/admin/impact
- [ ] Verify all stat cards display:
  - [ ] Total Matches Created
  - [ ] Total Sessions Completed
  - [ ] Credits Earned
  - [ ] Active Student Tutors
  - [ ] Institutions Participating
  - [ ] Cross-Institution Impact %
- [ ] Check chart renders correctly:
  - [ ] Shows urban→rural flow
  - [ ] Displays tutors sent vs students received
  - [ ] Bars are grouped by institution
- [ ] Verify institution rankings table:
  - [ ] Shows all institutions
  - [ ] Tutors provided count
  - [ ] Students helped count
  - [ ] Total sessions
  - [ ] Credits earned
  - [ ] Impact score with color coding
- [ ] Test sorting by clicking column headers
- [ ] Test academic year dropdown filter

**Expected Data:**
- 5 institutions seeded
- Cross-institution percentage: ~60%
- RUPP should have highest impact score

---

## 🔗 API Endpoint Testing

### Use Postman/Thunder Client to test:

#### Institution APIs
```bash
# List institutions
GET http://localhost:3000/api/institutions

# Get specific institution
GET http://localhost:3000/api/institutions/1

# Enroll a student
POST http://localhost:3000/api/institutions/1/enroll
Content-Type: application/json
{
  "userId": 10,
  "studentId": "TEST-2024-001",
  "academicYear": "2024-2025"
}

# List enrolled students
GET http://localhost:3000/api/institutions/1/enroll
```

#### Credit APIs
```bash
# List credit transactions
GET http://localhost:3000/api/credits?userId=1

# Approve a credit
POST http://localhost:3000/api/credits/1/approve
Content-Type: application/json
{
  "reviewedBy": 11,
  "reviewNotes": "Approved - session verified"
}

# Apply credits
POST http://localhost:3000/api/credits/1/credit
```

#### Matching APIs
```bash
# Get user preferences
GET http://localhost:3000/api/matching/preferences?userId=1

# Create match (manual)
POST http://localhost:3000/api/matching/matches
Content-Type: application/json
{
  "mode": "manual",
  "tutorUserId": 1,
  "menteeUserId": 6,
  "subjectId": 1
}

# Get matches
GET http://localhost:3000/api/matching/matches?userId=1&role=tutor

# Accept match
POST http://localhost:3000/api/matching/matches/1/accept
Content-Type: application/json
{
  "userId": 1,
  "role": "tutor"
}
```

---

## 🐛 Known Issues / Limitations

### Current Limitations:
1. **No Authentication** - All pages use hardcoded user IDs
   - Institution ID: 1 (RUPP)
   - User ID: 123 (various pages)
   - Faculty ID: 10 (for approvals)

2. **No Real-time Updates** - Need to manually refresh pages

3. **Missing Pages**:
   - `/dashboard/institution/settings` - 404
   - `/dashboard/institution/analytics` - 404
   - `/login` - No auth system yet

4. **No File Uploads** - Institution logos, user avatars are URLs only

5. **No Notifications** - No alerts for new matches or approvals

### Workarounds:
- Use browser's localStorage to simulate user sessions
- Hard refresh (Cmd+Shift+R) after data changes
- Navigate using direct URLs for testing

---

## ✅ Success Criteria

### Minimum Viable Demo:
- [x] Database schema applied
- [x] Seed data loaded successfully
- [ ] All API endpoints return 200
- [ ] All dashboard pages load without errors
- [ ] Can complete one full workflow:
  - [ ] View enrolled students
  - [ ] Approve a credit transaction
  - [ ] Credits reflect in student balance
  - [ ] Accept a match proposal
  - [ ] View impact metrics

### Ready for Stakeholder Demo:
- [ ] All features tested and working
- [ ] No console errors
- [ ] Mobile responsive (test on phone)
- [ ] Can walk through complete user journey
- [ ] Screenshots prepared for presentation

---

## 📸 Screenshot Checklist

Take screenshots of these for documentation:

1. **Institution Dashboard** - Overview with stats
2. **Enrolled Students Table** - Full list with filters
3. **Credit Approval Queue** - Pending transactions
4. **Student Credit Tracker** - Progress visualization
5. **Matching Preferences** - Form filled out
6. **Match Acceptance** - Modal with details
7. **Impact Dashboard** - Full metrics view
8. **Cross-Institution Flow Chart** - Visual representation

---

## 🎯 Next Testing Phase

After basic testing passes:
1. **Load Testing** - Create 100+ institutions, 1000+ students
2. **Edge Cases** - Test limits, nulls, errors
3. **Security Testing** - SQL injection, XSS attempts
4. **Performance** - Check API response times
5. **Mobile Testing** - All pages on phone/tablet

---

## 📞 Report Issues

If you find bugs, document:
- Page URL
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots

Create issues in: GitHub Issues or JIRA

---

**Testing completed by:** _____________
**Date:** _____________
**Pass Rate:** _____ / 50 checks
**Critical Issues:** _____________
**Ready for Demo:** ☐ Yes ☐ No (if no, list blockers)
