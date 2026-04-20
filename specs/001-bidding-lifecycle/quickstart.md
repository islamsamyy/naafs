# Quickstart: Bidding & Project Lifecycle

## Setup

1. **Database Migrations**:
   - Run `sql/001_bidding_schema.sql` (to be created in tasks phase).
   - Enable Realtime on `bids` and `projects` tables in Supabase Dashboard.

2. **Environment Variables**:
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.

## Primary Flows

### 1. The Bidding War
- Navigate to `/auctions/[id]`
- The `LiveTicker` component subscribes to `public:bids` filtered by `project_id`.
- Use the `PlaceBidForm` to trigger an RPC call `submit_bid(amount, pitch)`.

### 2. The Selection
- Real-time updates reflect the new bid in the Client's dashboard.
- Clicking "Accept" triggers the `initiate_escrow` RPC which atomicaly updates `projects.status` and `bids.status`.

### 3. Verification
- Use `npm run test:e2e` to run the bidding race condition simulation.
