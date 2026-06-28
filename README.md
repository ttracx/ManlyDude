# ManlyDude

<!-- THOX-BADGES:START -->
[![Repository](https://img.shields.io/badge/repository-ttracx/ManlyDude-0B1220)](https://github.com/ttracx/ManlyDude)
![THOX.ai LLC](https://img.shields.io/badge/owner-THOX.ai%20LLC-00A676)
![Visibility](https://img.shields.io/badge/visibility-public-00A676)
![Leadership](https://img.shields.io/badge/CTO-Tommy%20Xaypanya-1F6FEB)
![Leadership](https://img.shields.io/badge/CEO-Craig%20Ross-6F42C1)
<!-- THOX-BADGES:END -->


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

<!-- THOX-DOCS-STANDARD:START -->
## Repository Description

THOX.ai LLC repository for ManlyDude, including project documentation, release readiness, and legal baseline.

## Documentation

- [Repository documentation](docs/README.md)
- [Security policy](SECURITY.md)
- [Contributing guide](CONTRIBUTING.md)
- [Legal notice](NOTICE.md)

## THOX.ai LLC

This repository is maintained by THOX.ai LLC.

- Tommy Xaypanya is CTO.
- Craig Ross is CEO.

## Copyright and Legal

Copyright (c) 2026 THOX.ai LLC. All rights reserved unless this repository includes a separate license file that states otherwise.

THOX-specific documentation, configuration, branding, product definitions, and integration work are owned by THOX.ai LLC unless explicitly noted. Third-party dependencies, forks, vendored components, and upstream source materials remain governed by their original licenses and notices.
<!-- THOX-DOCS-STANDARD:END -->
