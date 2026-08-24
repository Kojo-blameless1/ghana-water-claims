# GWL Frontend

## Setup
1. Run `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `NEXT_PUBLIC_API_URL` to your Express backend URL
4. Run `npm run dev`

## Deploy to Vercel
1. Connect your GitHub repo to Vercel
2. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. Deploy

## Notes
- No NextAuth — authentication is handled by the Express backend with JWT cookies
- All API calls go through `src/lib/api.ts`
