# Presto - AI-Powered Restaurant Customer Service

This is a Next.js application that allows restaurants to create AI-powered customer service agents. The app uploads PDF menus, processes them with Google Gemini AI to extract menu items and nutrition information, and stores everything in Supabase.

## Features

- **Restaurant Management**: Create and manage restaurant profiles
- **PDF Menu Processing**: Upload PDF menus and automatically extract menu items using Google Gemini AI
- **AI Customer Service**: Generate AI-powered customer service agents for each restaurant
- **Nutrition Information**: Extract and store detailed nutrition facts, ingredients, and allergen information

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

## Vercel Deployment

This app is optimized for Vercel deployment. Key considerations:

- **File Uploads**: Files are processed in memory and may expire after 5 minutes
- **Serverless Functions**: The app uses in-memory storage for file processing
- **API Limits**: Google Gemini API has rate limits; the app includes retry logic with exponential backoff

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
