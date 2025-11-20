# EducatePro Assets Usage Guide

Quick reference for using icons, illustrations, and fonts in SA Jobs mobile app.

---

## 🎨 Icons (199 Total)

### Basic Usage

```typescript
import { Image } from 'react-native';
import { EDUCATEPRO_ICONS, ICON_SIZES } from '@/constants/educatepro-icons';

// Simple icon
<Image
  source={EDUCATEPRO_ICONS.home}
  style={{ width: ICON_SIZES.md, height: ICON_SIZES.md }}
/>
```

### Available Icon Sizes

```typescript
ICON_SIZES = {
  xs: 16,    // Extra small (badges, small indicators)
  sm: 20,    // Small (navigation bar icons)
  md: 24,    // Medium (standard UI icons)
  lg: 32,    // Large (prominent icons)
  xl: 48,    // Extra large (hero sections)
  xxl: 64,   // Double extra large (illustrations)
}
```

### Common Icons

```typescript
// Navigation
EDUCATEPRO_ICONS.home
EDUCATEPRO_ICONS.arrowLeft
EDUCATEPRO_ICONS.arrowRight
EDUCATEPRO_ICONS.menu

// Communication
EDUCATEPRO_ICONS.email
EDUCATEPRO_ICONS.call
EDUCATEPRO_ICONS.chat
EDUCATEPRO_ICONS.send

// User
EDUCATEPRO_ICONS.user
EDUCATEPRO_ICONS.userDefault
EDUCATEPRO_ICONS.profile

// Interaction
EDUCATEPRO_ICONS.heart
EDUCATEPRO_ICONS.heartOutline
EDUCATEPRO_ICONS.bookmark
EDUCATEPRO_ICONS.star
EDUCATEPRO_ICONS.share

// Commerce
EDUCATEPRO_ICONS.cart
EDUCATEPRO_ICONS.wallet
EDUCATEPRO_ICONS.creditCard
EDUCATEPRO_ICONS.discount

// Settings
EDUCATEPRO_ICONS.settings
EDUCATEPRO_ICONS.lock
EDUCATEPRO_ICONS.shield
EDUCATEPRO_ICONS.logout

// Utility
EDUCATEPRO_ICONS.search
EDUCATEPRO_ICONS.filter
EDUCATEPRO_ICONS.download
EDUCATEPRO_ICONS.trash
```

### Search Icons

```typescript
import { getAvailableIconNames } from '@/constants/educatepro-icons';

// Get all icon names
const allIcons = getAvailableIconNames();
console.log(allIcons);

// Find icons by name
import { getIconByName } from '@/constants/educatepro-icons';

const homeIcon = getIconByName('home');
const searchIcon = getIconByName('search-outline');
```

---

## 🖼️ Illustrations (8 Total)

### Basic Usage

```typescript
import { Image } from 'react-native';
import {
  EDUCATEPRO_ILLUSTRATIONS,
  ILLUSTRATION_SIZES
} from '@/constants/educatepro-illustrations';

// Success illustration
<Image
  source={EDUCATEPRO_ILLUSTRATIONS.success}
  style={ILLUSTRATION_SIZES.large}
/>
```

### Available Illustrations

```typescript
// Authentication
EDUCATEPRO_ILLUSTRATIONS.fingerprint     // Biometric/security
EDUCATEPRO_ILLUSTRATIONS.password        // Password reset
EDUCATEPRO_ILLUSTRATIONS.passwordDark    // Password reset (dark)
EDUCATEPRO_ILLUSTRATIONS.passwordSuccess // Password success

// Status
EDUCATEPRO_ILLUSTRATIONS.success         // Success confirmation
EDUCATEPRO_ILLUSTRATIONS.successDark     // Success (dark mode)

// Errors
EDUCATEPRO_ILLUSTRATIONS.notFound        // 404/not found

// Backgrounds
EDUCATEPRO_ILLUSTRATIONS.background      // Background pattern
```

### Illustration Sizes

```typescript
ILLUSTRATION_SIZES = {
  small: { width: 100, height: 100 },        // Small inline
  medium: { width: 200, height: 200 },       // Dialog/modal
  large: { width: 300, height: 300 },        // Full section
  extraLarge: { width: 400, height: 400 },   // Splash/onboarding
  fullScreen: { width: '100%', height: '100%' }, // Full screen
}
```

### Dark Mode Variations

```typescript
// Check if dark mode and use appropriate illustration
const illustration = isDark
  ? EDUCATEPRO_ILLUSTRATIONS.successDark
  : EDUCATEPRO_ILLUSTRATIONS.success;

<Image
  source={illustration}
  style={ILLUSTRATION_SIZES.large}
/>
```

---

## 🔤 Fonts (Urbanist - 18 Files)

### Setup (One Time)

Add fonts to App.tsx:

```typescript
import { useFonts } from 'expo-font';
import { EDUCATEPRO_FONTS } from '@/constants/educatepro-fonts';

export default function App() {
  const [fontsLoaded] = useFonts({
    Hanuman_400Regular,  // Existing font
    Hanuman_700Bold,     // Existing font
    ...EDUCATEPRO_FONTS, // Add Urbanist fonts ← Add this line
  });

  // Rest of component...
}
```

### Using Typography Presets

```typescript
import { StyleSheet } from 'react-native';
import { URBANIST_TYPOGRAPHY } from '@/constants/educatepro-fonts';

const styles = StyleSheet.create({
  heading: URBANIST_TYPOGRAPHY.h1,
  subheading: URBANIST_TYPOGRAPHY.h3,
  body: URBANIST_TYPOGRAPHY.body1,
  caption: URBANIST_TYPOGRAPHY.caption,
  button: URBANIST_TYPOGRAPHY.button,
});

// Usage
<Text style={styles.heading}>Main Title</Text>
<Text style={styles.body}>Regular paragraph text</Text>
<Text style={styles.button}>Button Text</Text>
```

### Available Typography Presets

```typescript
// Headings
URBANIST_TYPOGRAPHY.h1    // 32px, Bold
URBANIST_TYPOGRAPHY.h2    // 28px, Bold
URBANIST_TYPOGRAPHY.h3    // 24px, Semi-Bold
URBANIST_TYPOGRAPHY.h4    // 20px, Semi-Bold
URBANIST_TYPOGRAPHY.h5    // 18px, Semi-Bold
URBANIST_TYPOGRAPHY.h6    // 16px, Semi-Bold

// Body text
URBANIST_TYPOGRAPHY.body1  // 16px, Regular
URBANIST_TYPOGRAPHY.body2  // 14px, Regular
URBANIST_TYPOGRAPHY.body3  // 12px, Regular

// Special
URBANIST_TYPOGRAPHY.button     // 14px, Semi-Bold
URBANIST_TYPOGRAPHY.caption    // 11px, Light
URBANIST_TYPOGRAPHY.overline   // 10px, Semi-Bold, uppercase
```

### Manual Font Selection

```typescript
import { FONT_FAMILIES } from '@/constants/educatepro-fonts';

const styles = StyleSheet.create({
  // By family name
  boldText: {
    fontFamily: FONT_FAMILIES.URBANIST_BOLD,
    fontSize: 18,
  },

  // By weight
  lightText: {
    fontFamily: FONT_FAMILIES.URBANIST_LIGHT,
    fontSize: 14,
  },

  // Italic
  italicText: {
    fontFamily: FONT_FAMILIES.URBANIST_REGULAR_ITALIC,
    fontSize: 16,
  },
});
```

### Available Font Weights

```typescript
FONT_FAMILIES.URBANIST_THIN              // 100
FONT_FAMILIES.URBANIST_EXTRA_LIGHT       // 200
FONT_FAMILIES.URBANIST_LIGHT             // 300
FONT_FAMILIES.URBANIST_REGULAR           // 400
FONT_FAMILIES.URBANIST_MEDIUM            // 500
FONT_FAMILIES.URBANIST_SEMI_BOLD         // 600
FONT_FAMILIES.URBANIST_BOLD              // 700
FONT_FAMILIES.URBANIST_EXTRA_BOLD        // 800
FONT_FAMILIES.URBANIST_BLACK             // 900

// All weights also available with _Italic suffix
FONT_FAMILIES.URBANIST_BOLD_ITALIC
FONT_FAMILIES.URBANIST_SEMI_BOLD_ITALIC
// etc.
```

---

## 📚 Complete Examples

### Example 1: Icon Button Component

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { EDUCATEPRO_ICONS, ICON_SIZES } from '@/constants/educatepro-icons';

interface IconButtonProps {
  icon: any;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  icon,
  onPress,
  size = 'md',
}: IconButtonProps) {
  const sizeMap = {
    sm: ICON_SIZES.sm,
    md: ICON_SIZES.md,
    lg: ICON_SIZES.lg,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Image
        source={icon}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
      />
    </TouchableOpacity>
  );
}

// Usage
<IconButton
  icon={EDUCATEPRO_ICONS.heart}
  onPress={() => toggleLike()}
  size="md"
/>
```

### Example 2: Success Screen

```typescript
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  EDUCATEPRO_ILLUSTRATIONS,
  ILLUSTRATION_SIZES,
} from '@/constants/educatepro-illustrations';
import { URBANIST_TYPOGRAPHY, COLORS } from '@/constants';

export function SuccessScreen({ isDark }: { isDark: boolean }) {
  const illustration = isDark
    ? EDUCATEPRO_ILLUSTRATIONS.successDark
    : EDUCATEPRO_ILLUSTRATIONS.success;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <Image
        source={illustration}
        style={ILLUSTRATION_SIZES.large}
      />

      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        Success!
      </Text>

      <Text style={[styles.message, { color: isDark ? '#ccc' : '#666' }]}>
        Your action has been completed successfully.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: URBANIST_TYPOGRAPHY.h1,
  message: {
    ...URBANIST_TYPOGRAPHY.body1,
    marginTop: 16,
    textAlign: 'center',
  },
});
```

### Example 3: Navigation Icons

```typescript
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { EDUCATEPRO_ICONS, ICON_SIZES } from '@/constants/educatepro-icons';

const BOTTOM_TABS = [
  { name: 'Home', icon: EDUCATEPRO_ICONS.home },
  { name: 'Search', icon: EDUCATEPRO_ICONS.search },
  { name: 'Messages', icon: EDUCATEPRO_ICONS.chat },
  { name: 'Profile', icon: EDUCATEPRO_ICONS.profile },
];

export function BottomTabBar() {
  return (
    <View style={styles.container}>
      {BOTTOM_TABS.map((tab) => (
        <Image
          key={tab.name}
          source={tab.icon}
          style={{
            width: ICON_SIZES.md,
            height: ICON_SIZES.md,
            tintColor: '#335EF7',
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
```

---

## 🔍 Finding Icons

All 199 icons are available. To find specific icons:

```typescript
// List all available icons
import { getAvailableIconNames } from '@/constants/educatepro-icons';
console.log(getAvailableIconNames());

// Get icon by name
import { getIconByName } from '@/constants/educatepro-icons';
const searchIcon = getIconByName('search');
const heartIcon = getIconByName('heart-outline');
```

---

## 📋 Common Patterns

### Loading Icons from API Response

```typescript
import { getIconByName } from '@/constants/educatepro-icons';
import { ICON_SIZES } from '@/constants/educatepro-icons';

// From API response: { iconName: 'heart', label: 'Like' }
function IconFromAPI({ iconName }) {
  const icon = getIconByName(iconName);

  if (!icon) {
    return null; // Icon not found
  }

  return (
    <Image
      source={icon}
      style={{ width: ICON_SIZES.md, height: ICON_SIZES.md }}
    />
  );
}
```

### Dynamic Icon Color

```typescript
import { Image } from 'react-native';
import { EDUCATEPRO_ICONS } from '@/constants/educatepro-icons';

<Image
  source={EDUCATEPRO_ICONS.heart}
  style={{
    width: 24,
    height: 24,
    tintColor: isLiked ? '#FF6B6B' : '#ccc',
  }}
/>
```

### Animated Icon (with React Native Animated)

```typescript
import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from 'react-native';
import { EDUCATEPRO_ICONS, ICON_SIZES } from '@/constants/educatepro-icons';

export function AnimatedIconButton() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <Animated.Image
        source={EDUCATEPRO_ICONS.heart}
        style={{
          width: ICON_SIZES.lg,
          height: ICON_SIZES.lg,
          transform: [{ scale: scaleAnim }],
        }}
      />
    </TouchableOpacity>
  );
}
```

---

## 🎯 Integration Tips

1. **Consistency**: Use `ICON_SIZES` constants for consistent sizing
2. **Dark Mode**: Check `isDark` prop and select appropriate illustrations
3. **Fonts**: Load `EDUCATEPRO_FONTS` once in App.tsx, use `URBANIST_TYPOGRAPHY` presets
4. **Organization**: Group related icons using `ICON_CATEGORIES`
5. **Performance**: Icons are lightweight PNG files, safe to use liberally

---

## 📞 Reference

- **Icons**: 199 PNG files in `/mobile/assets/icons/`
- **Illustrations**: 8 PNG files in `/mobile/assets/illustrations/`
- **Fonts**: 18 TTF files in `/mobile/assets/fonts/`
- **Constants**: 3 files in `/mobile/src/constants/`

---

*For detailed documentation, see PHASE4_ASSETS_COMPLETE.md*
