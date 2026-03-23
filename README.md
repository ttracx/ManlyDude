# ManlyDude

AI-powered strength training and fitness coaching app.

## Tech Stack

- **Mobile**: React Native + Expo SDK 52, TypeScript, Expo Router, NativeWind
- **Backend**: Next.js 14 App Router, Supabase (Auth, Database, Realtime, Storage)
- **AI**: Claude API (workout generation, nutrition plans)
- **Payments**: Stripe subscriptions (Free / Plus / Premium)
- **State**: Zustand (global) + TanStack Query (server state)

## Project Structure

```
apps/
  mobile/     # Expo React Native app
  web/        # Next.js API + web app (deployed on Vercel)
packages/
  shared/     # Shared types, utilities, and database migrations
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the mobile app
pnpm dev:mobile

# Start the web/API server
pnpm dev:web

# Type check all packages
pnpm typecheck
```

## Environment Variables

Copy `.env.example` to `.env.local` (web) and configure your Supabase, Stripe, and Anthropic keys.

## Deployment

The web app deploys to Vercel. Set the root directory to `apps/web` in Vercel project settings.
