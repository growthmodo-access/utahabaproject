# Environment Variables Setup

## Quick Setup

Create a file named `.env.local` in the root of your project with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ifyrpgyxswdaoyptaxnf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmeXJwZ3l4c3dkYW95cHRheG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODM4OTAsImV4cCI6MjA4NDA1OTg5MH0.x4zMH_D1ug6hi6sMDQbwGlOVW2K6MALuK5cTTxVeXCc

# Klaviyo Configuration (optional)
# KLAVIYO_API_KEY=your_klaviyo_api_key_here
# KLAVIYO_LIST_ID=your_klaviyo_list_id_here
```

## Steps:

1. **Create the file**: In your project root, create `.env.local`
2. **Add the content**: Copy and paste the content above
3. **Restart your dev server**: Stop and restart `npm run dev`

## Important Notes:

- The `.env.local` file is already in `.gitignore` and will NOT be committed to git
- Never share your Supabase keys publicly
- For production deployments (Vercel, etc.), add these as environment variables in your hosting platform's settings

## Next Step:

After creating `.env.local`, you need to run the SQL setup script in Supabase:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase-setup.sql`
