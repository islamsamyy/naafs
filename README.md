# Naafs (`naafs`) — Full-Stack Next.js & Supabase Application

An internationalized Next.js 16 (`nafis-app`) and Supabase web application with structured specifications, automated test suites, and a modern `shadcn/ui` + Tailwind CSS 4 interface.

## Executive Summary & Purpose
`naafs` is a full-stack TypeScript application built with Next.js App Router, Supabase SSR authentication/database, and `next-intl` for multi-language support.

## Architecture & Tech Stack
- **Framework**: Next.js 16 (`16.2.3`) & React 19 (`19.2.4`)
- **Backend & Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **UI & i18n**: `@base-ui/react`, `shadcn`, `next-intl`, `sonner`, `lucide-react`, Tailwind CSS 4

## Project Structure
```text
├── src/
│   ├── app/              # App Router ((app), (auth), api, etc.)
│   ├── components/       # UI components
│   ├── lib/              # Utilities & Supabase clients
│   ├── types/            # TypeScript definitions
│   └── middleware.ts     # Auth & i18n middleware
├── supabase/             # Database schema & migrations
├── specs/                # Feature specifications
└── tests/                # Automated test suites
```

## Getting Started

```bash
git clone https://github.com/islamsamyy/naafs.git
cd naafs
npm install
cp .env.example .env.local
npm run dev
```
