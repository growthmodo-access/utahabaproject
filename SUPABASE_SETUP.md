# Supabase Setup Guide

This guide will help you set up Supabase for persistent blog post storage.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Your project name (e.g., "ABA Utah Blog")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 3: Set Up the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

## Step 4: Configure Environment Variables

1. Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace `your_project_url_here` with your Project URL from Step 2
3. Replace `your_anon_key_here` with your anon/public key from Step 2

## Step 5: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

This will install `@supabase/supabase-js` which was added to `package.json`.

## Step 6: Restart Your Development Server

1. Stop your development server (Ctrl+C)
2. Start it again:

```bash
npm run dev
```

## Step 7: Test the Integration

1. Go to `/admin/blog` in your application
2. Try creating a new blog post
3. Check your Supabase dashboard → **Table Editor** → **blog_posts** to see if the post was created

## Migration from File Storage

If you have existing blog posts in `data/blog-posts.json`, you can migrate them:

1. The system will automatically use Supabase once configured
2. Existing posts in the JSON file will remain, but new posts will go to Supabase
3. To migrate existing posts, you can:
   - Manually create them through the admin interface, or
   - Use the Supabase dashboard to import them

## Troubleshooting

### "Supabase is not configured" error
- Make sure your `.env.local` file has the correct variables
- Restart your development server after adding environment variables
- Check that variable names start with `NEXT_PUBLIC_`

### "relation 'blog_posts' does not exist" error
- Make sure you ran the SQL setup script in Step 3
- Check the Supabase SQL Editor for any errors

### Posts not appearing
- Check the Supabase dashboard → **Table Editor** → **blog_posts** to see if data is there
- Check browser console for errors
- Verify your Supabase credentials are correct

## Security Notes

The current setup allows all operations on blog posts. For production:

1. Set up authentication in Supabase
2. Update the RLS policies to restrict access
3. Only allow authenticated admins to create/update/delete posts
4. Keep read access public for blog visitors

## Next Steps

- Set up authentication for admin access
- Configure proper RLS policies
- Set up backups in Supabase
- Consider adding more tables (e.g., for providers)
