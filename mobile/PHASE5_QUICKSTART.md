# Phase 5 Quick Start Guide

**Ready to add more professional screens to your app?**

This guide shows you how to use the utilities and components created in Phase 5.

---

## 🚀 Quick Reference

### Form Management Example

```typescript
import { formReducer } from '@/utils/formReducer';
import { validateInput } from '@/utils/validation';

const EditProfileScreen = ({ navigation }) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: { email: '', password: '' },
    inputValidities: { email: false, password: false },
    formIsValid: false,
  });

  const handleEmailChange = (value) => {
    const isValid = validateInput('email', value, 'email');
    dispatch({
      type: 'UPDATE_INPUT',
      payload: { inputId: 'email', inputValue: value, isValid },
    });
  };

  return (
    <Input
      onInputChanged={handleEmailChange}
      value={formState.inputValues.email}
      errorText={
        !formState.inputValidities.email
          ? 'Please enter a valid email'
          : undefined
      }
    />
  );
};
```

---

### Section Headers

```typescript
import { SectionHeader } from '@/components/EducatePro';

<SectionHeader
  title="Popular Courses"
  onSeeAll={() => navigation.navigate('AllCourses')}
  actionText="View All"
  isDark={isDark}
/>
```

---

### Date Picker Modal

```typescript
import { DatePickerModal } from '@/components/EducatePro';
import { useState } from 'react';

const MyScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-01-01');

  return (
    <>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>{selectedDate}</Text>
      </TouchableOpacity>

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        isDark={false}
      />
    </>
  );
};
```

---

## 📋 Validation Functions

### Available Validators

```typescript
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateInput,
  getErrorMessage,
} from '@/utils/validation';

// Email
validateEmail('user@example.com'); // true/false

// Password (requires 8+ chars, uppercase, lowercase, number, special)
validatePassword('SecurePass123!'); // true/false

// Phone
validatePhoneNumber('+1 (555) 123-4567'); // true/false

// Generic input validator
validateInput('email', 'user@example.com', 'email'); // true/false
validateInput('password', 'SecurePass123!', 'password'); // true/false
validateInput('name', 'John', 'text', { minLength: 3 }); // true/false

// Get error message
const error = getErrorMessage('email', 'invalid', 'email');
// Returns: "Please enter a valid email address"
```

---

## 🎨 Creating a New Screen

### Template

```typescript
import React, { useState, useReducer } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '@/constants/educatepro-theme';
import { EDUCATEPRO_ICONS } from '@/constants/educatepro-icons';
import { Header, Button } from '@/components/EducatePro';

interface MyScreenProps {
  navigation: any;
  route?: any;
}

const MyScreen = ({ navigation, route }: MyScreenProps) => {
  const [isDark] = useState(false);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.dark1 : COLORS.white },
      ]}
    >
      <Header
        title="My Screen"
        onBackPress={() => navigation.goBack()}
        isDark={isDark}
      />

      <View style={styles.content}>
        {/* Your content here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
});

export default MyScreen;
```

---

## 📱 HomeScreen Example

The HomeScreen demonstrates all Phase 5 features:

- Banners carousel with pagination
- Category filters
- Course listings
- Mentor directory
- Search integration

**Location**: `/mobile/src/screens/EducatePro/HomeScreen.tsx`

**Use it as reference for:**
- Carousel implementation
- Category filtering
- Mock data structure
- Navigation patterns

---

## 🔄 Form Validation Patterns

### Email + Password Form

```typescript
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        inputValues: {
          ...state.inputValues,
          [action.inputId]: action.inputValue,
        },
        inputValidities: {
          ...state.inputValidities,
          [action.inputId]: action.isValid,
        },
        formIsValid: checkAllValid({
          ...state.inputValidities,
          [action.inputId]: action.isValid,
        }),
      };
    default:
      return state;
  }
};

const LoginScreen = () => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: { email: '', password: '' },
    inputValidities: { email: false, password: false },
    formIsValid: false,
  });

  const handleInputChange = (inputId, value) => {
    let isValid = false;
    if (inputId === 'email') {
      isValid = validateEmail(value);
    } else if (inputId === 'password') {
      isValid = validatePassword(value);
    }

    dispatch({
      type: 'UPDATE_INPUT',
      payload: { inputId, inputValue: value, isValid },
    });
  };

  return (
    <>
      <Input
        id="email"
        placeholder="Email"
        value={formState.inputValues.email}
        onInputChanged={(value) => handleInputChange('email', value)}
        errorText={
          !formState.inputValidities.email ? 'Invalid email' : undefined
        }
      />
      <Input
        id="password"
        placeholder="Password"
        value={formState.inputValues.password}
        onInputChanged={(value) => handleInputChange('password', value)}
        secureTextEntry
        errorText={
          !formState.inputValidities.password
            ? 'Password too weak'
            : undefined
        }
      />
      <Button
        title="Login"
        onPress={() => handleLogin()}
        disabled={!formState.formIsValid}
      />
    </>
  );
};
```

---

## 🎯 Next Screens to Build

### ProfileScreen (Easy - 20 mins)
**Features:**
- User profile header
- Stats display
- Menu options
- No forms

### EditProfileScreen (Medium - 40 mins)
**Features:**
- Form with validation
- Image upload
- Date picker
- Gender selection
- All form utilities needed

### CourseDetailsScreen (Medium - 40 mins)
**Features:**
- Course header
- Tab navigation
- Reviews section
- Enrollment button

### SearchScreen (Medium - 40 mins)
**Features:**
- Search input
- Filters
- Results list
- No forms

---

## 📚 Available Components

### Phase 2 Core
- **Button** - Filled/outlined buttons with loading states
- **Input** - Text inputs with icons and error messages
- **Card** - Generic container with shadow

### Phase 3 Domain
- **CourseCard** - Course display with image, price, rating
- **ReviewCard** - User review with avatar, rating, like
- **Header** - Screen header with back button and title
- **MentorCard** - Mentor profile card
- **StudentCard** - Student profile card

### Phase 5 Utility
- **SectionHeader** - Section titles with actions
- **DatePickerModal** - Date selection modal

---

## 🎨 Using Theme Constants

```typescript
import { COLORS, SIZES } from '@/constants/educatepro-theme';

// Colors
COLORS.primary       // #335EF7
COLORS.secondary     // #FFD300
COLORS.success       // #0ABE75
COLORS.error         // #F75555
COLORS.white         // #FFFFFF
COLORS.black         // #000000
COLORS.dark1         // #191919
COLORS.dark2         // #282828
COLORS.gray          // #8A8D9F
COLORS.greyscale100  // #F2F2F2
COLORS.greyscale200  // #E0E0E0

// Sizes
SIZES.base           // 8
SIZES.padding        // 16
SIZES.padding2       // 12
SIZES.padding3       // 20
SIZES.width          // Device width
SIZES.height         // Device height

// Never hardcode!
// ❌ BAD:   backgroundColor: '#335EF7'
// ✅ GOOD:  backgroundColor: COLORS.primary
```

---

## 📱 Icons Reference

```typescript
import { EDUCATEPRO_ICONS, ICON_SIZES } from '@/constants/educatepro-icons';

// Common icons
EDUCATEPRO_ICONS.home
EDUCATEPRO_ICONS.search
EDUCATEPRO_ICONS.heart
EDUCATEPRO_ICONS.bookmark
EDUCATEPRO_ICONS.settings
EDUCATEPRO_ICONS.notificationBell
EDUCATEPRO_ICONS.arrowLeft

// Usage
<Image
  source={EDUCATEPRO_ICONS.home}
  style={{
    width: ICON_SIZES.md,
    height: ICON_SIZES.md,
  }}
/>
```

---

## ✅ Checklist for New Screens

Before submitting a new screen, check:

- [ ] Uses COLORS constant (no hardcoded colors)
- [ ] Uses SIZES constant (no hardcoded padding)
- [ ] Dark mode supported (isDark prop and conditional styling)
- [ ] Navigation integrated properly
- [ ] TypeScript typed correctly
- [ ] No console errors/warnings
- [ ] Responsive on different sizes
- [ ] Form validation (if applicable)
- [ ] Comments and JSDoc added
- [ ] Mock data included for testing

---

## 🚀 Performance Tips

1. **Use FlatList for lists** - Never use ScrollView for large lists
2. **Memoize callbacks** - Use useCallback for navigation/press handlers
3. **Lazy load images** - Use Image with loading states
4. **Avoid inline styles** - Use StyleSheet.create()
5. **Don't render unnecessary components** - Use conditional rendering

---

## 📞 Common Issues & Solutions

### "Icon not found"
- Check EDUCATEPRO_ICONS spelling
- Verify icon name matches list in constants/educatepro-icons.ts

### "Color is undefined"
- Import COLORS: `import { COLORS } from '@/constants'`
- Don't use COLORS. before importing

### "Form not validating"
- Check reducer function is correct
- Verify validateInput is imported
- Ensure dispatch is being called

### "Dark mode not working"
- Pass isDark to all components
- Check conditional styling: `isDark ? dark : light`
- Test on simulator with theme toggle

---

## 📖 Documentation Files

- **PHASE5_IMPLEMENTATION_PLAN.md** - Complete plan for all screens
- **PHASE5_PROGRESS.md** - Current progress and achievements
- **ASSETS_USAGE_GUIDE.md** - Icons, illustrations, fonts reference
- **PHASE4_ASSETS_COMPLETE.md** - Asset migration details

---

## 🎯 Goal

Adapt remaining 49 screens from EducatePro template with:
- Full TypeScript typing
- Dark mode support
- Component integration
- Navigation setup
- Form validation (where needed)

---

**Ready to build your first new screen? Copy this template and start coding!**

*Generated: November 20, 2025*
*Phase 5 - Professional Screens Quick Start*
