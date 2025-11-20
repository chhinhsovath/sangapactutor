# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SA Jobs Mobile** is a React Native mobile application built with Expo for a tutoring/mentoring platform. The app supports multiple user roles (student, tutor, admin, institution admin, etc.) with role-based navigation and features.

## Development Commands

### Running the App
```bash
npm start           # Start Expo development server
npm run android     # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run web preview
```

### Building & Testing
- No lint or test scripts currently configured
- TypeScript strict mode is enabled in `tsconfig.json`

## Project Structure

```
src/
├── components/      # Reusable UI components
├── constants/       # Configuration (API_BASE_URL, APP_NAME, etc.)
├── contexts/        # React Context providers (AuthContext)
├── hooks/           # Custom React hooks
├── i18n/           # Internationalization (en, km locales)
├── navigation/      # Navigation setup
│   ├── RoleBasedNavigator.tsx      # Routes based on user role
│   ├── AppNavigator.tsx            # Main app navigation
│   └── navigators/                 # Tab navigators per role
├── screens/         # Screen components
│   ├── auth/       # Login/Register screens
│   └── tabs/       # Tab-based screens
├── services/        # API services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions (storage, etc.)
```

## Architecture Patterns

### 1. Authentication Flow
- **AuthContext** (src/contexts/AuthContext.tsx): Manages authentication state globally
- Uses `useAuth()` hook to access auth state in components
- Stores JWT tokens (access + refresh) in secure storage
- Auto-refreshes expired tokens via axios interceptor
- **API Layer**: `/auth/login`, `/auth/register`, `/auth/me` endpoints

### 2. Role-Based Navigation
- **RoleBasedNavigator** switches between tab navigators based on `user.role`
- Supported roles: `student`, `tutor`, `admin`, `super_admin`, `institution_admin`, `faculty_coordinator`, `student_coordinator`, `institution_viewer`, `mentee`, `verified_tutor`, `partner_manager`
- Fallback: Student navigator for unknown roles

### 3. API & HTTP Layer
- **axios instance** (src/services/api.ts) with:
  - Request interceptor: Attaches Bearer token to all requests
  - Response interceptor: Handles 401 errors by attempting token refresh
  - Base URL: `http://192.168.0.162:3003/api/mobile` (configurable via env)
- **Service layer**: Services in `src/services/` wrap API calls
  - `authService`: Login, register, logout, get current user
  - `tutorsService`: Tutor search/filtering
  - `bookingsService`: Booking management
  - `messagesService`: Messaging

### 4. State Management
- **React Query** (@tanstack/react-query): Handles server state caching
- **React Context**: Global auth state
- Queries have 5-minute stale time by default

### 5. Theming & UI
- **React Native Paper**: Material Design 3 components
- **Theme**: Light theme with Hanuman font (Khmer support)
- Safe area handling via `react-native-safe-area-context`

### 6. Storage
- **Secure storage**: src/utils/storage.ts uses `expo-secure-store` for tokens
- Methods: `getToken()`, `setToken()`, `getRefreshToken()`, `setRefreshToken()`, `removeTokens()`

### 7. Localization
- **i18next**: English and Khmer translations
- Location: src/i18n/locales/{en.ts, km.ts}
- Configured in src/i18n/index.ts

## Key Technical Details

### Environment Configuration
- Default API Base URL: `http://192.168.0.162:3003/api/mobile`
- Override via `API_BASE_URL` environment variable
- See: src/constants/config.ts

### Type System
- TypeScript strict mode enabled
- Key types in src/types/index.ts:
  - `User`: Auth user with role, tutorId, institutionId, creditBalance
  - `Tutor`: Full tutor profile with subject, country, rating, availability
  - `Booking`: Lesson booking with student, tutor, scheduling, price
  - `Message`: Direct messaging between users
  - `TutorFilters`: Filtering parameters (subject, country, level, price range)

### Common API Response Pattern
```typescript
interface ApiResponse<T> {
    data: T;
    message?: string;
}

interface ApiError {
    message: string;
    errors?: Record<string, string[]>;  // Field-level validation errors
}
```

### Expo Configuration
- App name: "mobile"
- Version: 1.0.0
- New Architecture enabled (newArchEnabled: true)
- Portrait orientation
- Splash screen & adaptive icons configured
- Tab navigation for iOS

## Database Conventions

**Note**: This mobile app connects to a backend API. The backend likely uses:
- **Naming**: snake_case for API responses (based on field patterns like `firstName`, `tutorId` in TypeScript)
- Refer to backend API documentation for actual field names in API responses

## Important Implementation Notes

### Authentication
- Token refresh happens automatically on 401 responses
- Current user fetched on app startup via `checkAuth()` in AuthContext
- Tokens cleared when refresh fails, user redirected to login

### Navigation Pattern
- Auth screens shown if `user === null`
- Tab navigators shown based on user role
- Loading spinner while checking authentication

### Token Storage
- Using **expo-secure-store** for secure token storage
- Not suitable for sensitive operations requiring expiration checks (use `jwtDecode` if needed)

### Making API Calls
```typescript
import api from '@/services/api';

// Tokens attached automatically
const response = await api.get('/endpoint');
const response = await api.post('/endpoint', data);
```

## Development Workflow

1. **Create services** for new API endpoints in src/services/
2. **Update types** in src/types/index.ts for new data structures
3. **Add screens** in src/screens/ and integrate into appropriate tab navigator
4. **Use Context** for global state (auth already handled)
5. **Use React Query** for server state (caching, refetching)
6. **Add translations** in src/i18n/locales/{en.ts, km.ts}

## Common Gotchas

- **Token refresh**: If 401 occurs, axios will automatically attempt refresh. If refresh fails, tokens are cleared
- **Role-based access**: Always check `user.role` before rendering role-specific features
- **Async storage**: Token operations are async; use `await` or promises
- **API Base URL**: Verify the correct base URL is set in config.ts for your environment
