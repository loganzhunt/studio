# Google Authentication Setup Guide

This guide will help you set up Google authentication for your Next.js application using Firebase.

## Overview

The application supports dual authentication modes:
- **Google Authentication** (requires Firebase setup)
- **Local Demo Mode** (works without Firebase, stores data in localStorage)

If Firebase is not configured, the app automatically falls back to local demo mode.

## Quick Start

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Click **Add app** and select **Web** (</>) if you haven't already
6. Register your app with a nickname (e.g., "My Worldview App")

### 2. Get Firebase Configuration

1. In your Firebase project, go to **Project Settings > General**
2. Scroll down to **Your apps** and find your web app
3. Copy the configuration object values

### 3. Environment Variables Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your Firebase config:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBmguxfiSSsfRw1OoUSFLK3h9_mo_GtBNY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
   ```

### 4. Enable Google Authentication in Firebase

1. In Firebase Console, go to **Authentication**
2. Click **Get started** if this is your first time
3. Go to **Sign-in method** tab
4. Find **Google** in the list and click on it
5. Click **Enable**
6. Set the public-facing name for your project
7. Choose a support email
8. Click **Save**

### 5. Configure Authorized Domains

1. Still in **Authentication > Sign-in method**
2. Scroll down to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `yourapp.com`)
   - Your Firebase hosting domain (e.g., `your-project-id.web.app`)

### 6. Restart Development Server

After setting up `.env.local`, restart your development server:
```bash
npm run dev
```

## Testing the Setup

1. **Local Demo Mode**: If Firebase isn't configured, you'll see "Sign In (Local Demo)"
2. **Google Auth Mode**: If Firebase is configured, you'll see both Google sign-in and local demo options

### Verification Steps

1. Open your app in the browser
2. Click the **Sign In** button
3. You should see:
   - **With Firebase**: Google sign-in button + local demo option
   - **Without Firebase**: Only local demo with a warning message

## Troubleshooting

### Common Issues

#### "Firebase environment variables not configured"
- Make sure you've created `.env.local` (not `.env.local.example`)
- Verify all required environment variables are set
- Restart your development server

#### "Google Sign-In Unavailable" 
- Check that Google authentication is enabled in Firebase Console
- Verify your domain is in the authorized domains list
- Make sure your Firebase project is active

#### "Auth domain not authorized"
- Add your domain to Firebase Console > Authentication > Settings > Authorized domains
- Include both `localhost` and your production domain

#### API key errors
- Double-check your `NEXT_PUBLIC_FIREBASE_API_KEY` value
- Make sure there are no extra spaces or quotes in `.env.local`

### Debug Mode

The app logs helpful information to the browser console:
- ✅ Firebase initialized successfully
- 🔧 Running in local demo mode - Firebase disabled
- ⚠️ Firebase environment variables not configured

## Security Notes

- Environment variables starting with `NEXT_PUBLIC_` are included in your built app
- These Firebase config values are meant to be public and are not sensitive
- Actual security is handled by Firebase's authentication and security rules
- Local demo mode data is stored only in browser localStorage

## Production Deployment

### Firebase Hosting

1. Make sure your production domain is added to Firebase authorized domains
2. Set your environment variables in your hosting platform
3. For Firebase Hosting, the environment variables are automatically available

### Other Hosting Platforms

Make sure to set the same environment variables in your hosting platform's environment variable settings.

## Features

### Dual Authentication System
- **Google OAuth**: Full Firebase authentication with profile pictures
- **Local Demo**: Browser-only authentication for testing/demo purposes

### User Profile Features
- Display name and email
- Profile pictures (Google users)
- Provider badges (Google/Local Demo)
- Persistent login state

### Automatic Fallback
- If Firebase is not configured, automatically switches to local demo mode
- No code changes needed to switch between modes
- Graceful error handling and user feedback

## Next Steps

Once Google authentication is working:
1. Test the sign-in/sign-out flow
2. Verify user profile information displays correctly
3. Test on different devices and browsers
4. Set up production environment variables
5. Test production deployment

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Firebase project settings
3. Ensure environment variables are correctly set
4. Try the local demo mode to isolate Firebase issues
