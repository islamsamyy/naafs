# Implementation Plan: Functional Bidding & Project Lifecycle

**Branch**: `001-bidding-lifecycle` | **Date**: 2026-04-16 | **Spec**: [specs/001-bidding-lifecycle/spec.md](spec.md)
**Input**: Feature specification for core bidding mechanisms and project lifecycle state management.

## Summary

Implement the core marketplace engine for Nafis, enabling clients to post projects and freelancers to bid in real-time. The approach utilizes **Supabase Realtime** for live bidding wars and a robust **PostgreSQL State Machine** to track project transitions from inception to escrow-backed delivery.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14+)
**Primary Dependencies**: Supabase SDK, Framer Motion, Lucide React
**Storage**: Supabase (PostgreSQL) with Realtime enabled on `bids` table.
**Testing**: Playwright (E2E for bidding flows)
**Target Platform**: Web (Vercel)
**Project Type**: Web Application (Marketplace Engine)
**Performance Goals**: <500ms bid propagation; 60fps animations for bidding pulses.
**Constraints**: Must support RTL (Arabic-first) layouts for all bidding dashboards.
**Scale/Scope**: ~5 major state transitions, 3 new database tables, 2-3 interactive dashboard views.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Futuristic Design**: Interactive bidding pulses and kinetic counters planned? **PASS**
2. **Arabic-First UX**: RTL-compliant bidding forms and dashboards? **PASS**
3. **Real-Time Interactive**: Supabase Realtime integration for live bid updates? **PASS**
4. **Secure Governance**: Escrow state tracking and transparent bid history? **PASS**
5. **Performance**: GPU-accelerated motion for countdowns/tickers? **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/001-bidding-lifecycle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (generated via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (app)/
│   │   ├── dashboard/       # Client/Freelancer bidding hubs
│   │   └── projects/        # Project detail & bidding pages
│   └── (marketing)/
│       └── auctions/        # Live public feed (updated)
├── components/
│   ├── bidding/             # LiveTicker, PlaceBidForm, BiddingHistory
│   └── lifecycle/           # StatusBadge, DeliveryForm, EscrowStatus
├── lib/
│   ├── supabase/            # Client initialization with Realtime
│   └── utils/               # State machine helpers & currency formatting
└── types/                   # Enums for ProjectStatus, BidStatus
```

**Structure Decision**: Standard Next.js App Router structure with feature-scoped components in `src/components/bidding` and `src/components/lifecycle`. Logic for state transitions remains in `src/lib`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |
