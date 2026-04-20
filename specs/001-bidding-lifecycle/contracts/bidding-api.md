# Contract: Bidding API

## Endpoints (RPC)

### `submit_bid`
Submit a new bid for a project.

**Arguments**:
- `p_project_id`: uuid
- `p_amount`: decimal
- `p_days`: integer
- `p_proposal`: text

**Returns**: `bids` record
**Validation**:
- Must be logged in.
- `project_id` must be an "active" project.
- User must be a freelancer.

### `accept_bid`
Accept a bid and move to escrow.

**Arguments**:
- `p_bid_id`: uuid

**Returns**: `projects` record (updated)
**Validation**:
- User must be the owner of the project.

## Realtime Channels

### `public:bids`
- **Filter**: `project_id=eq.{ID}`
- **Events**: `INSERT`, `UPDATE`

### `public:projects`
- **Filter**: `id=eq.{ID}`
- **Events**: `UPDATE` (to track status changes)
