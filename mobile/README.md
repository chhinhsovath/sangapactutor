# SA Jobs Mobile App

React Native mobile application for the SA Jobs tutoring platform, built with Expo.

## Features

- **Authentication**: Login and registration with JWT-based auth
- **Browse Tutors**: Search and filter tutors by subject, country, specialization, and price
- **Book Sessions**: Schedule tutoring sessions with available tutors
- **Manage Bookings**: View, update, and cancel bookings
- **User Profile**: View profile information and credit balance (for students)
- **Secure Storage**: Token management with Expo SecureStore

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Query** for data fetching and caching
- **React Native Paper** for UI components
- **Axios** for API calls
- **Expo SecureStore** for secure token storage

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (installed automatically)
- iOS Simulator (Mac only) or Android Emulator

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

The app connects to the backend API. Make sure the backend is running on `http://localhost:3000`.

If you need to change the API URL, edit `src/constants/config.ts`:

```typescript
export const API_BASE_URL = 'http://your-api-url/api/mobile';
```

### 3. Start the Backend

In the main project directory:

```bash
# Start PostgreSQL
docker-compose up -d

# Start Next.js backend
npm run dev
```

The backend will run on `http://localhost:3000`.

### 4. Run the Mobile App

```bash
# Start Expo
npm start

# Or run on specific platform
npm run ios      # iOS Simulator (Mac only)
npm run android  # Android Emulator
npm run web      # Web browser
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── auth/         # Login, Register
│   │   └── tabs/         # Home, Search, Bookings, Profile
│   ├── navigation/       # Navigation setup
│   ├── components/       # Reusable components
│   ├── services/         # API services
│   │   ├── api.ts       # Axios instance
│   │   ├── auth.service.ts
│   │   ├── tutors.service.ts
│   │   └── bookings.service.ts
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── types/            # TypeScript types
│   ├── constants/        # App constants
│   └── utils/            # Utility functions
│       └── storage.ts   # Secure storage
├── App.tsx              # Root component
└── package.json
```

## API Endpoints

The mobile app connects to these backend endpoints:

### Authentication
- `POST /api/mobile/auth/login` - Login
- `POST /api/mobile/auth/register` - Register
- `POST /api/mobile/auth/refresh` - Refresh access token
- `GET /api/mobile/auth/me` - Get current user

### Tutors
- `GET /api/mobile/tutors` - List tutors (with filters)
- `GET /api/mobile/tutors/:id` - Get tutor details

### Bookings
- `GET /api/mobile/bookings` - List user's bookings
- `POST /api/mobile/bookings` - Create booking
- `GET /api/mobile/bookings/:id` - Get booking details
- `PATCH /api/mobile/bookings/:id` - Update booking
- `DELETE /api/mobile/bookings/:id` - Cancel booking

### Reference Data
- `GET /api/mobile/subjects` - List subjects
- `GET /api/mobile/countries` - List countries

## Authentication Flow

1. User logs in or registers
2. Backend returns JWT access token (15min) and refresh token (7 days)
3. Tokens are stored securely using Expo SecureStore
4. Access token is attached to all API requests
5. When access token expires, refresh token is used to get a new one
6. If refresh fails, user is redirected to login

## Testing

### Test User Registration
1. Open the app
2. Click "Register"
3. Fill in the form (select Student or Tutor)
4. Submit

### Test Login
1. Use the credentials from registration
2. Click "Login"
3. You should be redirected to the home screen

### Test Tutor Search
1. Navigate to "Find Tutors" tab
2. Browse available tutors
3. Use the search bar to filter
4. Click on a tutor to view details

### Test Booking
1. Select a tutor
2. Click "Book Session"
3. Fill in the booking details
4. Submit
5. View the booking in "My Bookings" tab

## Development Tips

### Hot Reload
Expo supports hot reloading. Save any file and the app will automatically update.

### Debugging
- Shake the device/simulator to open the developer menu
- Enable "Debug Remote JS" to use Chrome DevTools
- Use `console.log()` for debugging

### Running on Physical Device
1. Install Expo Go app on your phone
2. Scan the QR code from `npm start`
3. Make sure your phone and computer are on the same network

## Common Issues

### Cannot connect to API
- Make sure the backend is running on `http://localhost:3000`
- For physical devices, use your computer's IP address instead of localhost
- Update `API_BASE_URL` in `src/constants/config.ts`

### iOS Simulator not opening
- Make sure Xcode is installed
- Run `xcode-select --install` if needed

### Android Emulator not opening
- Make sure Android Studio is installed
- Create an AVD (Android Virtual Device) in Android Studio

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## License

MIT
