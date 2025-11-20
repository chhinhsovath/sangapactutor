# Phase 5 - Professional Screens Implementation Plan

**Status**: STARTING
**Total Screens**: 50 (from EducatePro template)
**Estimated Time**: 8-10 hours
**Priority**: High - Core app functionality

---

## 📊 Overview

Phase 5 involves adapting 50 professional screens from the EducatePro template to TypeScript components optimized for SA Jobs mobile app.

### What's Already Done:
✅ Phase 1: Theme System (colors, sizes, fonts)
✅ Phase 2: Core UI Components (Button, Input, Card)
✅ Phase 3: Domain Components (CourseCard, ReviewCard, Header, etc.)
✅ Phase 4: Assets (199 icons, 8 illustrations, 18 fonts)

### What Phase 5 Does:
- Adapt complete screen templates from EducatePro
- Convert JavaScript to TypeScript
- Integrate with existing components
- Add form validation and state management
- Implement navigation flows
- Dark mode support

---

## 🎯 Priority Tiers

### TIER 1: Critical for Initial Release (Days 1-2)
These screens are essential for core functionality:

1. **Home.js** (447 lines)
   - Main dashboard/feed
   - Course/lesson listings
   - Announcements/banners
   - Quick actions
   - Status: Ready to adapt

2. **Profile.js** (323 lines)
   - User profile display
   - Stats and achievements
   - Navigation to other features
   - Status: Ready to adapt

3. **EditProfile.js** (475 lines)
   - Form with validation
   - Image upload
   - Gender/category selection
   - Date picker integration
   - Status: Ready to adapt

4. **CourseDetails.js** (343 lines)
   - Course/lesson information
   - Reviews integration
   - Enrollment/booking
   - Related content
   - Status: Ready to adapt

5. **Search.js**
   - Search functionality
   - Filters and sorting
   - Results display
   - Status: Ready to adapt

### TIER 2: Important Features (Days 3-4)
These screens add significant value:

6. **Chat.js** - Messaging interface
7. **Login.js** - Authentication
8. **Signup.js** - Registration
9. **MyBookmark.js** - Saved items
10. **MyCourse.js** - My courses/registrations
11. **Notifications.js** - Notification center
12. **ConfirmPayment.js** - Payment flow
13. **CourseDetailsLessons.js** - Course structure
14. **CourseDetailsReviews.js** - Review section
15. **CourseVideoPlay.js** - Video player

### TIER 3: Enhanced Features (Days 5-6)
Nice-to-have features:

16. **SelectPaymentMethods.js**
17. **AddNewCard.js**
18. **Transactions.js**
19. **HelpCenter.js**
20. **InviteFriends.js**

### TIER 4: Settings & Admin (Later)
Configuration screens:

21. **SettingsSecurity.js**
22. **SettingsPrivacyPolicy.js**
23. **SettingsNotifications.js**
24. **SettingsLanguage.js**

---

## 📋 Adaptation Process

### Step 1: Code Analysis
- [ ] Read source JavaScript file
- [ ] Identify components used
- [ ] List data dependencies
- [ ] Note navigation flows
- [ ] Check for API calls

### Step 2: TypeScript Conversion
- [ ] Create TypeScript interface for props
- [ ] Define state types
- [ ] Add proper typing to functions
- [ ] Import types from existing files

### Step 3: Component Integration
- [ ] Replace EducatePro components with SA Jobs equivalents
- [ ] Update icon references (use new EDUCATEPRO_ICONS)
- [ ] Adapt image imports
- [ ] Update data sources

### Step 4: Styling Adaptation
- [ ] Update COLORS/SIZES imports
- [ ] Replace hardcoded values with theme constants
- [ ] Ensure dark mode support
- [ ] Test responsive layout

### Step 5: Testing & Polish
- [ ] Verify all imports work
- [ ] Test on simulator
- [ ] Check navigation flows
- [ ] Validate dark mode
- [ ] Performance check

---

## 🔄 Adaptation Patterns

### Pattern 1: Simple Display Screen (e.g., Home)
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@/constants/educatepro-theme';
import { EDUCATEPRO_ICONS } from '@/constants/educatepro-icons';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [isDark] = useState(false);

  return (
    <View style={[styles.container, {
      backgroundColor: isDark ? COLORS.dark1 : COLORS.white
    }]}>
      {/* Screen content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
});

export default HomeScreen;
```

### Pattern 2: Form Screen (e.g., EditProfile)
```typescript
import React, { useReducer, useState } from 'react';
import { useCallback } from 'react';
import { formReducer } from '@/utils/formReducer';

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [image, setImage] = useState<string | null>(null);

  const handleInputChange = useCallback((inputId: string, value: string) => {
    // Validate and dispatch
  }, [dispatch]);

  const handleSave = async () => {
    // Save form data
  };

  return (
    // Form UI
  );
};

export default EditProfileScreen;
```

### Pattern 3: Navigation/List Screen (e.g., Search)
```typescript
import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';

interface SearchScreenProps {
  navigation: any;
  route: any;
}

const SearchScreen = ({ navigation, route }: SearchScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, filters]);

  const performSearch = async () => {
    // Fetch search results
  };

  return (
    // Search UI with FlatList
  );
};

export default SearchScreen;
```

---

## 📦 Dependencies Needed

### Already Available:
✅ COLORS, SIZES, FONTS from educatepro-theme.ts
✅ EDUCATEPRO_ICONS from educatepro-icons.ts
✅ EDUCATEPRO_ILLUSTRATIONS from educatepro-illustrations.ts
✅ Button, Input, Card components
✅ CourseCard, ReviewCard, Header, MentorCard, StudentCard components

### To Create:
- [ ] SectionHeader component (grouping headers with actions)
- [ ] DatePickerModal component
- [ ] ImagePicker utility
- [ ] Form reducer utilities
- [ ] Data/mock data for testing
- [ ] Navigation types/interfaces

---

## 🛠️ Implementation Steps

### Phase 5A: Setup & Utilities (1-2 hours)
1. Create utility files:
   - `utils/form-reducer.ts` - Form state management
   - `utils/validation.ts` - Form validation rules
   - `components/SectionHeader.tsx` - Screen section headers
   - `components/DatePickerModal.tsx` - Date picker component

2. Create types/interfaces:
   - `types/screens.ts` - Screen component interfaces
   - `types/forms.ts` - Form data interfaces

### Phase 5B: Core Screens (2-3 hours)
1. **HomeScreen.tsx**
   - Banner carousel
   - Category grid
   - Course listings
   - Mentor recommendations

2. **ProfileScreen.tsx**
   - User info display
   - Stats/achievements
   - Navigation menu

3. **EditProfileScreen.tsx**
   - Form with validation
   - Image upload
   - Field selection

### Phase 5C: Detail/Content Screens (2-3 hours)
1. **CourseDetailsScreen.tsx**
   - Course header/banner
   - Tabs for lessons, reviews, instructor
   - Enrollment CTA

2. **SearchScreen.tsx**
   - Search input
   - Filters
   - Results list

3. **ChatScreen.tsx**
   - Message list
   - Input/send
   - Real-time sync

### Phase 5D: Secondary Screens (2-3 hours)
1. **BookmarkScreen.tsx**
2. **MyCourseScreen.tsx**
3. **NotificationsScreen.tsx**
4. **PaymentScreens.tsx** (multiple)

### Phase 5E: Testing & Polish (1-2 hours)
- Integration testing
- Navigation verification
- Dark mode validation
- Performance optimization

---

## 📁 Directory Structure (After Phase 5)

```
mobile/src/
├── screens/
│   ├── EducatePro/
│   │   ├── HomeScreen.tsx (NEW)
│   │   ├── ProfileScreen.tsx (NEW)
│   │   ├── EditProfileScreen.tsx (NEW)
│   │   ├── CourseDetailsScreen.tsx (NEW)
│   │   ├── SearchScreen.tsx (NEW)
│   │   ├── ChatScreen.tsx (NEW)
│   │   ├── BookmarkScreen.tsx (NEW)
│   │   ├── MyCourseScreen.tsx (NEW)
│   │   ├── NotificationsScreen.tsx (NEW)
│   │   ├── PaymentScreen.tsx (NEW)
│   │   └── ... (40+ more screens)
│   └── ... (existing screens)
├── components/
│   ├── EducatePro/ (Phase 2-3 components)
│   │   ├── SectionHeader.tsx (NEW)
│   │   └── DatePickerModal.tsx (NEW)
│   └── ... (existing components)
├── constants/
│   ├── educatepro-theme.ts (Phase 1)
│   ├── educatepro-icons.ts (Phase 4)
│   ├── educatepro-illustrations.ts (Phase 4)
│   ├── educatepro-fonts.ts (Phase 4)
│   └── index.ts
├── types/
│   ├── screens.ts (NEW)
│   ├── forms.ts (NEW)
│   └── ... (existing types)
└── utils/
    ├── form-reducer.ts (NEW)
    ├── validation.ts (NEW)
    └── ... (existing utils)
```

---

## 🔑 Key Considerations

### 1. TypeScript Best Practices
- Use strict typing for all props and state
- Create interfaces for each screen's navigation props
- Define types for all complex objects

### 2. Navigation Integration
- All screens must support navigation prop
- Implement route parameter passing
- Handle stack/tab navigation properly

### 3. Dark Mode Support
- All screens must use theme constants
- Never use hardcoded colors
- Test both light and dark modes

### 4. Form Handling
- Use form reducer for complex forms
- Implement validation before submission
- Show clear error messages
- Provide success feedback

### 5. Performance
- Lazy load images
- Memoize expensive calculations
- Use FlatList for large lists
- Optimize re-renders with useCallback/useMemo

### 6. Accessibility
- Proper touch targets (minimum 48x48)
- Semantic HTML for web
- Screen reader friendly labels
- Keyboard navigation support

---

## 📊 Progress Tracking

### Phase 5A: Utilities
- [ ] form-reducer.ts
- [ ] validation.ts
- [ ] SectionHeader component
- [ ] DatePickerModal component
- [ ] Screen types

### Phase 5B: Core Screens
- [ ] HomeScreen.tsx
- [ ] ProfileScreen.tsx
- [ ] EditProfileScreen.tsx
- [ ] CourseDetailsScreen.tsx
- [ ] SearchScreen.tsx

### Phase 5C: Content Screens
- [ ] ChatScreen.tsx
- [ ] BookmarkScreen.tsx
- [ ] MyCourseScreen.tsx
- [ ] NotificationsScreen.tsx
- [ ] ReviewsScreen.tsx

### Phase 5D: Secondary Screens
- [ ] PaymentScreens
- [ ] SettingsScreens
- [ ] HelpCenter
- [ ] Others

### Phase 5E: Testing
- [ ] All screens build without errors
- [ ] Navigation flows work
- [ ] Dark mode functions
- [ ] Performance acceptable

---

## 🚀 Getting Started

### Immediate Next Steps:
1. Create utilities (form reducer, validation)
2. Adapt HomeScreen.tsx
3. Adapt ProfileScreen.tsx
4. Adapt EditProfileScreen.tsx
5. Integrate navigation

### Success Criteria:
- All Tier 1 screens implemented
- Navigation between screens working
- Dark mode supported
- No TypeScript errors
- Simulator tests pass

---

## 📚 Reference Files

- **Source Screens**: `/Users/chhinhsovath/Documents/GitHub/sa-jobs/EducatePro/screens/`
- **Components**: `/mobile/src/components/EducatePro/`
- **Constants**: `/mobile/src/constants/`
- **Navigation**: `/mobile/src/navigation/`

---

## 💡 Tips for Success

1. **Start Small**: Don't try to adapt all 50 screens at once
2. **One Screen at a Time**: Complete each screen fully before moving to next
3. **Test After Each**: Verify each screen works on simulator
4. **Reuse Components**: Leverage existing EducatePro components
5. **Keep Constants**: Never hardcode values - use COLORS, SIZES, FONTS
6. **Document as You Go**: Add JSDoc comments to new screens
7. **Version Control**: Commit after each major screen
8. **Dark Mode First**: Always support dark mode from the start

---

**Ready to start Phase 5? Let's begin with HomeScreen.tsx!**

*Generated: November 20, 2025*
*SA Jobs Mobile - EducatePro Integration Phase 5 Plan*
