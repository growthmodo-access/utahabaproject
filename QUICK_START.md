# Quick Start Guide

## To Run on Localhost

**IMPORTANT:** Due to external drive permission restrictions, please run these commands in your own Terminal (not through Cursor):

### Step 1: Open Terminal
Open Terminal.app on your Mac

### Step 2: Navigate to Project
```bash
cd "/Volumes/GROWTHMODO HD/ABAUTAH"
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Once you see "Ready" in the terminal, open:
**http://localhost:3000**

## If You See Permission Errors

Run this first:
```bash
sudo chmod -R u+rwX node_modules
```

Then try `npm run dev` again.

## Alternative: Use Different Port

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001

## What You Should See

- ✅ "Ready" message in terminal
- ✅ Local URL: http://localhost:3000
- ✅ Homepage loads with providers and blog posts
- ✅ All navigation links work

## Need Help?

Check TROUBLESHOOTING.md for more solutions.
