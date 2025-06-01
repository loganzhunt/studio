# 🌈 Meta-Prism: Worldview Assessment Platform

A Next.js 15 application for personal worldview assessment and exploration, featuring **dynamic triangle visualization** with ROYGBIV color mapping, Google authentication, and Firebase integration.

## ✨ Key Features

### 🌈 **Dynamic Triangle Color System** *(Latest Feature)*
- **ROYGBIV Hue Mapping**: Each facet uses specific spectrum hues (Violet to Red)
- **Score-Based Color Generation**: Colors change based on individual domain scores
- **Dynamic Opacity**: Visual intensity reflects score strength
- **Enhanced Saturation**: Vivid center boost for mid-range scores (0.5-0.7)
- **Real-time Visualization**: Each worldview displays unique color patterns

### 🔐 Dual Authentication System
- **Google OAuth** - Sign in with your Google account (requires Firebase setup)
- **Local Demo Mode** - Quick access for testing (localStorage-based)
- **Automatic Fallback** - Seamlessly switches to demo mode if Firebase isn't configured

### 📊 Advanced Worldview Assessment
- **7-Facet Analysis**: Ontology, Epistemology, Praxeology, Axiology, Mythology, Cosmology, Teleology
- **Interactive Triangle Visualization**: Dynamic color-coded results
- **Comprehensive Codex**: 100+ philosophical worldviews with detailed profiles
- **Persistent Results**: Cross-session data persistence

### 🎨 Modern Glass Design System
- **Living Glass Elements**: Responsive glassmorphic components
- **Spectrum Gradients**: ROYGBIV-based design language
- **Dark/Light Themes**: Adaptive color schemes
- **Microinteractions**: Smooth animations and transitions

## Quick Start

### Development (Local Demo Mode)
```bash
npm install
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) - The app runs in local demo mode by default.

### Google Authentication Setup
For full Google authentication, see [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for detailed instructions.

Quick setup:
1. Create a Firebase project
2. Enable Google authentication
3. Copy `.env.local.example` to `.env.local`
4. Add your Firebase config values
5. Restart the dev server

## Project Structure

- `src/app/` - Next.js 15 app router pages
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/lib/` - Utility functions and Firebase config
- `src/types/` - TypeScript type definitions

## Authentication Modes

### Local Demo Mode
- No setup required
- Data stored in browser localStorage
- Perfect for development and testing
- Shows warning about data persistence

### Google Authentication Mode
- Requires Firebase setup
- Secure user authentication
- Profile pictures and user info
- Persistent across devices

## Deployment

The app can be deployed to:
- **Firebase Hosting** (recommended) - See [DEPLOY.md](./DEPLOY.md)
- **Vercel** - Push to GitHub and connect
- **Netlify** - Build command: `npm run build`
- **Any static hosting** - Uses Next.js static export

## Environment Variables

Create `.env.local` with your Firebase configuration:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... see .env.local.example for complete list
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Firebase** - Authentication and hosting
- **React Context** - State management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both authentication modes
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
