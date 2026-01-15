# Troubleshooting Localhost Issues

## Issue: Server Not Loading / Permission Errors

If you're experiencing permission errors when running `npm run dev`, this is often due to the project being on an external drive with restrictive permissions.

## Solutions

### Option 1: Run in Your Terminal (Recommended)

Open Terminal and run:

```bash
cd "/Volumes/GROWTHMODO HD/ABAUTAH"
npm run dev
```

This should work because your terminal has full user permissions.

### Option 2: Fix Permissions

Run these commands in your terminal:

```bash
cd "/Volumes/GROWTHMODO HD/ABAUTAH"

# Fix node_modules permissions
sudo chmod -R u+rwX node_modules

# Fix .next directory if it exists
sudo chmod -R u+rwX .next 2>/dev/null || true

# Then try again
npm run dev
```

### Option 3: Move Project to Home Directory

If permissions continue to be an issue, move the project:

```bash
# Copy to home directory
cp -R "/Volumes/GROWTHMODO HD/ABAUTAH" ~/Projects/ABAUTAH

# Navigate to new location
cd ~/Projects/ABAUTAH

# Install dependencies (if needed)
npm install

# Run dev server
npm run dev
```

### Option 4: Use Different Port

If port 3000 is in use:

```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001

## Common Issues

### "Operation not permitted" errors
- This is a macOS external drive permission issue
- Solution: Run commands in your own terminal with full permissions

### Port already in use
- Another process is using port 3000
- Solution: Kill the process or use a different port

### Module not found errors
- Dependencies might not be installed
- Solution: Run `npm install`

## Still Having Issues?

1. Check that Node.js is installed: `node --version`
2. Check that npm is installed: `npm --version`
3. Try deleting `.next` folder and `node_modules`, then reinstall:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```
