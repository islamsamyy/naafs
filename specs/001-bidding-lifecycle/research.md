# Research: Functional Bidding & Project Lifecycle

## Decision 1: Real-Time Communication
**Decision**: Use **Supabase Realtime (Cdc)** on the `bids` and `projects` tables.
**Rationale**: Native to the stack, incredibly low latency, and avoids the complexity of setting up a separate Pusher/Socket.io service.
**Alternatives considered**: 
- HTTP Polling: Rejected due to battery/data drain and poor UX for "bidding wars."
- Custom WebSockets: Rejected as unnecessary overhead given Supabase availability.

## Decision 2: State Management
**Decision**: Implement a **PostgreSQL Check Constraint** for `status` enums combined with **Supabase Database Webhooks** for state-change side effects (e.g., notifying the winner).
**Rationale**: Ensures data integrity at the database layer (source of truth) while allowing the app layer to react to changes.
**Alternatives considered**: 
- Application-level enums only: Dangerous if multiple services (or direct SQL edits) bypass validation.

## Decision 3: "Shadow" Escrow Implementation
**Decision**: Create an `escrow_ledger` table that tracks virtual credit transfers.
**Rationale**: Allows for complete flow testing in Phase 02 without needing a sandbox Stripe account yet. Each "Accepted Bid" creates a ledger entry that "locks" the project budget.
**Alternatives considered**:
- Integration with real Payment Gateway: Postponed to Phase 03 to ensure core marketplace cycles are solid first.

## Decision 4: Interactive Bidding Pulse
**Decision**: Use **Framer Motion `LayoutGroup`** and **CSS animations** for the bidding ticker.
**Rationale**: High-performance animations that follow the "Neon Nocturne" constitution without taxing the main thread.
