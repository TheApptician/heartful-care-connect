# Heems - UK's Trusted On-Demand Care Marketplace

Heems is a comprehensive care marketplace platform connecting families with verified carers across the UK. The platform provides CQC-compliant clinical vetting, real-time booking, and secure payment processing.

## Features

- **For Families**: Find verified, DBS-checked carers for home care needs
- **For Carers**: Set your own rates and build your independent care practice  
- **For Organisations**: Access talent pools and compliance management tools
- **Admin Dashboard**: Complete platform management and verification workflows

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Stripe Connect

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EmmanuelEdward2019/heartful-care-connect.git
cd heartful-care-connect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Supabase and Stripe credentials.

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages (client, carer, admin dashboards)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and helpers
├── integrations/   # Supabase client and API integrations
└── types/          # TypeScript type definitions
```

## Deployment

Build the production bundle:
```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## License

Copyright © 2026 Heems Care Ltd. All rights reserved.
