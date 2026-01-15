# ABA Utah - Directory & Blog Website

A beautiful, SEO-optimized directory and blog website for ABA therapy providers in Utah.

## Features

- **Provider Directory**: Browse top 8 providers from every Utah county
- **Ranking System**: Rank and organize providers
- **Blog System**: SEO-optimized blog posts about ABA therapy
- **Cost Estimator**: Tool to estimate ABA therapy costs
- **ABA Benefit Quiz**: Interactive quiz to determine if ABA therapy is beneficial
- **Email Collection**: Klaviyo integration for email marketing
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file:
```
KLAVIYO_API_KEY=your_klaviyo_api_key
KLAVIYO_LIST_ID=your_klaviyo_list_id
```

3. Import provider data:
- Place your Excel file in the project root
- Use the import API endpoint: `POST /api/providers/import`
- Or manually add providers to the data structure

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── providers/     # Provider endpoints
│   │   └── klaviyo/       # Klaviyo integration
│   ├── blog/              # Blog pages
│   ├── directory/         # Directory pages
│   ├── cost-estimator/    # Cost estimator tool
│   └── quiz/              # ABA benefit quiz
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Importing Provider Data

### Option 1: Excel Import API

1. Make a POST request to `/api/providers/import` with your Excel file
2. The API will parse the Excel file and import providers

### Option 2: Manual Data Entry

Edit the data structure in `lib/data.ts` or create a JSON file with provider data.

### Excel File Format

Your Excel file should include columns such as:
- name / Name / Provider Name
- county / County
- city / City
- phone / Phone / Phone Number
- email / Email
- website / Website
- description / Description
- services (comma-separated or array)
- rating / Rating
- rank / Rank
- certifications (comma-separated)
- insuranceAccepted / Insurance Accepted (comma-separated)

## Klaviyo Integration

1. Get your Klaviyo API key from your Klaviyo account
2. Get your list ID from Klaviyo
3. Add them to `.env.local`
4. Email subscriptions will automatically sync to Klaviyo

## SEO Optimization

- Meta tags configured in `app/layout.tsx`
- Semantic HTML structure
- Open Graph tags for social sharing
- Clean URLs with slugs
- Sitemap and robots.txt (add as needed)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the project:
```bash
npm run build
npm start
```

## Customization

- **Colors**: Edit `tailwind.config.ts` to change the color scheme
- **Content**: Update blog posts in `app/blog/[slug]/page.tsx`
- **Styling**: Modify components in the `components/` directory

## License

MIT
