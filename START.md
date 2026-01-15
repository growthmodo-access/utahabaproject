# Quick Start Guide

## To Run the Website on Localhost

Open your terminal and run these commands:

### 1. Navigate to the project directory
```bash
cd "/Volumes/GROWTHMODO HD/ABAUTAH"
```

### 2. Install dependencies
```bash
npm install
```

If you encounter permission issues, try:
```bash
sudo npm install
```

Or use yarn instead:
```bash
yarn install
```

### 3. Start the development server
```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

### 4. Open in your browser
Once the server starts, you'll see:
```
✓ Ready in [time]
○ Local:        http://localhost:3000
```

Open **http://localhost:3000** in your browser!

## Troubleshooting

### If npm install fails:
1. Try clearing npm cache: `npm cache clean --force`
2. Try using yarn: `yarn install`
3. Check your internet connection
4. Try: `npm install --legacy-peer-deps`

### If the server won't start:
1. Make sure port 3000 is not in use
2. Check for any error messages in the terminal
3. Try: `npm run dev -- -p 3001` to use a different port

## What You'll See

- **Homepage**: Beautiful landing page with links to all features
- **Directory**: `/directory` - Browse providers (will show sample data)
- **Blog**: `/blog` - Read blog posts
- **Cost Estimator**: `/cost-estimator` - Calculate ABA costs
- **Quiz**: `/quiz` - Take the ABA benefit quiz
- **Admin**: `/admin` - Manage provider rankings

## Next Steps After Starting

1. Import your Excel file with provider data (see SETUP.md)
2. Configure Klaviyo in `.env.local` (optional for now)
3. Customize content and styling
