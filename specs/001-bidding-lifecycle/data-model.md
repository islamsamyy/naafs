# Data Model: Functional Bidding & Project Lifecycle

## Entities

### `projects` (Existing/Updated)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary Key |
| title | text | Project title |
| description | text | Full requirements |
| status | enum | draft, active, in_progress, review, completed, cancelled |
| budget_min | decimal | Lower bound |
| budget_max | decimal | Upper bound |
| deadline | timestamp | Auction end date |
| client_id | uuid | FK to profiles.id |
| winning_bid_id | uuid | FK to bids.id (nullable) |

### `bids`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary Key |
| project_id | uuid | FK to projects.id |
| freelancer_id | uuid | FK to profiles.id |
| amount | decimal | Bid price |
| days_to_complete | int | Duration |
| proposal | text | Pitch text |
| status | enum | open, accepted, rejected, withdrawn |
| created_at | timestamp | Auto-generated |

### `escrow_ledger`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary Key |
| project_id | uuid | FK to projects.id |
| amount | decimal | Held amount |
| status | enum | pending, held, released, refunded |
| milestone_title | text | Stage name (e.g. "Initial Deposit") |

## Relationships
- One **Project** has many **Bids**.
- One **Project** has one **EscrowLedger** record (per milestone).
- One **Freelancer** can place one **Bid** per project.

## State Transitions
1. **active** -> **in_progress**: Occurs when Client selects a winning bid.
2. **in_progress** -> **review**: Occurs when Freelancer submits deliverables.
3. **review** -> **completed**: Occurs when Client approves deliverables (Triggers Escrow Release).
