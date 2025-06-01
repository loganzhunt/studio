# Development Server Guide

## 🚀 Quick Start (Recommended)

### Persistent Development Server
```bash
npm run start-dev
```
**This is the best option** - it automatically:
- Finds an available port (starting from 3000)
- Clears cache for fresh starts
- Auto-restarts if it crashes
- Runs persistently until you stop it
- Shows clear status messages

### Development Dashboard
Open the dashboard for easy access to all pages:
```
file:///Users/loganzanehunt/Downloads/studio-master%202/dev-dashboard.html
```
Or just double-click `dev-dashboard.html` in Finder.

## Alternative Options

### Option 1: Specific Port
```bash
npm run dev:3000    # Start on port 3000
npm run dev:3001    # Start on port 3001
```

### Option 2: Clean Start
```bash
npm run dev:clean   # Clears cache and starts fresh
```

### Option 3: Stable Script
```bash
npm run dev:stable  # Auto port detection
```

## 🔧 Troubleshooting

### Server Won't Start
1. Use the persistent server: `npm run start-dev`
2. It handles port conflicts automatically
3. Auto-restarts on crashes
4. Shows clear error messages

### Still Having Issues?
1. Kill all processes: `pkill -f "next"`
2. Clear everything: `rm -rf .next`
3. Start fresh: `npm run start-dev`

### Development Dashboard Features
- ✅ Real-time server status checking
- 🔗 Quick links to all important pages
- 📱 Responsive testing shortcuts
- ⚡ Cache clearing tools
- 📋 Copy URLs for sharing

## 📍 Important URLs

- **Main Site**: http://localhost:3000/
- **Design System**: http://localhost:3000/design-system
- **Dashboard**: file:///Users/loganzanehunt/Downloads/studio-master%202/dev-dashboard.html

## 💡 Pro Tips

1. **Bookmark the dashboard** - it auto-refreshes server status
2. **Use `npm run start-dev`** - most reliable option
3. **The server auto-restarts** - no need to manually restart on crashes
4. **Check the dashboard** - shows server status and quick links
5. **Clear cache from dashboard** - if you see old styles

## 🚨 No More Manual Clicking!

The persistent server eliminates the need for:
- ❌ Multiple restart attempts
- ❌ Clicking "continue" repeatedly  
- ❌ Manual port switching
- ❌ Cache clearing commands

Just run `npm run start-dev` once and you're good to go!
