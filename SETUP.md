# Setup Guide for ABA Utah Website

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
KLAVIYO_API_KEY=your_klaviyo_api_key_here
KLAVIYO_LIST_ID=your_klaviyo_list_id_here
```

**To get your Klaviyo credentials:**
1. Log in to your Klaviyo account
2. Go to Account > Settings > API Keys
3. Create a new API key or use an existing one
4. Go to Lists & Segments to find your List ID

### 3. Import Provider Data

You have three options to import your Excel data:

#### Option A: Use the Import API Endpoint (Recommended)

1. Start the development server: `npm run dev`
2. Use a tool like Postman or curl to POST your Excel file:
   ```bash
   curl -X POST http://localhost:3000/api/providers/import \
     -F "file=@/path/to/your/providers.xlsx"
   ```

#### Option B: Use the Import Script

1. Place your Excel file in the project root
2. Run the import script:
   ```bash
   node scripts/import-providers.js /path/to/your/providers.xlsx
   ```
3. The script will create `data/providers.json`
4. Restart your dev server to load the data

#### Option C: Manual JSON Entry

1. Edit `data/providers.json` directly
2. Follow the format of the sample provider
3. Restart your dev server

### 4. Excel File Format

Your Excel file should have these columns (case-insensitive):

**Required:**
- `name` or `Name` or `Provider Name` - Provider name
- `county` or `County` - County name

**Optional but Recommended:**
- `city` or `City` - City name
- `phone` or `Phone` or `Phone Number` - Contact phone
- `email` or `Email` - Contact email
- `website` or `Website` or `Web Site` - Provider website
- `description` or `Description` - Provider description
- `rating` or `Rating` - Rating (0-5)
- `rank` or `Rank` - Ranking number (lower = higher rank)
- `services` - Comma-separated list of services
- `certifications` - Comma-separated list of certifications
- `insuranceAccepted` or `Insurance Accepted` - Comma-separated list
- `ageGroups` or `Age Groups` - Comma-separated list
- `yearsExperience` or `Years Experience` - Number of years

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### Directory Page (`/directory`)
- Browse providers by county
- View top 8 providers per county
- Search functionality
- Filter by county

### Admin Page (`/admin`)
- Manage provider rankings
- Reorder providers within counties
- Save ranking changes

### Cost Estimator (`/cost-estimator`)
- Calculate estimated ABA therapy costs
- Factor in insurance coverage
- Location-based pricing

### ABA Quiz (`/quiz`)
- Interactive quiz to determine if ABA is beneficial
- Score-based recommendations
- Email capture integration

### Blog (`/blog`)
- SEO-optimized blog posts
- Individual post pages
- Email capture on blog pages

## Customization

### Update Site Metadata

Edit `app/layout.tsx` to update:
- Site title
- Meta description
- Keywords
- Open Graph tags

### Change Colors

Edit `tailwind.config.ts` to customize the color scheme.

### Add Blog Posts

1. Add a new entry in `app/blog/page.tsx` (blogPosts array)
2. Create the post content in `app/blog/[slug]/page.tsx`
3. Or integrate with a CMS like Contentful, Sanity, or WordPress

### Update Sitemap

Edit `app/sitemap.ts` and replace `yourdomain.com` with your actual domain.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Configure environment variables on your hosting platform

## Troubleshooting

### Providers Not Showing

1. Check that `data/providers.json` exists and has data
2. Verify the API endpoint: `http://localhost:3000/api/providers`
3. Check browser console for errors

### Klaviyo Not Working

1. Verify your API key and List ID in `.env.local`
2. Check that the Klaviyo API key has proper permissions
3. Review server logs for API errors

### Excel Import Fails

1. Ensure the Excel file is in `.xlsx` format
2. Check that required columns (name, county) are present
3. Review the API response for error messages

## Next Steps

- [ ] Add your actual provider data
- [ ] Configure Klaviyo integration
- [ ] Customize colors and branding
- [ ] Add more blog posts
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure domain and SSL
- [ ] Set up email notifications
- [ ] Add provider images/logos
- [ ] Implement user reviews/ratings
- [ ] Add provider comparison feature

## Support

For issues or questions, check the README.md or review the code comments.
