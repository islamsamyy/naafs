# Tasks: Functional Bidding & Project Lifecycle

**Input**: Design documents from `/specs/001-bidding-lifecycle/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core type definitions

- [ ] T001 Create project structure for bidding components in `src/components/bidding` and `src/components/lifecycle`
- [ ] T002 Define TypeScript enums for `ProjectStatus`, `BidStatus`, and `EscrowStatus` in `src/types/marketplace.ts`
- [ ] T003 Configure Supabase client to support Realtime subscriptions in `src/lib/supabase/client.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema and RPC functions that MUST be complete before ANY user story implementation

- [ ] T004 Setup database schema for `bids` and `escrow_ledger` in `supabase/migrations/20260416_bidding_schema.sql`
- [ ] T005 [P] Enable Row Level Security (RLS) and Realtime for `bids` and `projects` tables
- [ ] T006 [P] Implement `submit_bid` PostgreSQL RPC function with validation logic
- [ ] T007 [P] Implement `accept_bid` PostgreSQL RPC function with atomic state transition to `in_progress`
- [ ] T008 [P] Implement `initiate_escrow` trigger to create `escrow_ledger` entry upon bid acceptance
- [ ] T009 Configure unified error handling for bidding RPC failures in `src/lib/utils/error-handler.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Project Creation & Launch (Priority: P1) 🎯 MVP

**Goal**: Enable Clients to post projects with budget and timeline constraints.

**Independent Test**: Successfully submit the project form and see it appear in the `/auctions` feed.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create Project Post form component in `src/components/projects/ProjectPostForm.tsx`
- [ ] T011 [US1] Implement project submission logic using `create_project` RPC in `src/app/(app)/projects/new/page.tsx`
- [ ] T012 [P] [US1] Update `ProjectCard` to display budget range and deadline in `src/components/projects/ProjectCard.tsx`
- [ ] T013 [US1] Add frontend validation for budget constraints and required fields

**Checkpoint**: User Story 1 functional - Projects can be created and listed.

---

## Phase 4: User Story 2 - Real-Time Bidding (Priority: P1)

**Goal**: Allow Freelancers to place bids that reflect instantly for all users.

**Independent Test**: Place a bid and verify the `LiveTicker` updates without page refresh.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create high-fidelity `PlaceBidForm` with Cairo typography in `src/components/bidding/PlaceBidForm.tsx`
- [ ] T015 [P] [US2] Implement `LiveTicker` component with Realtime subscription in `src/components/bidding/LiveTicker.tsx`
- [ ] T016 [US2] Integrate `LiveTicker` and `PlaceBidForm` into the project detail page `src/app/(app)/projects/[id]/page.tsx`
- [ ] T017 [US2] Add kinetic "Pulse" animation to `LiveTicker` upon new bid arrival using Framer Motion

**Checkpoint**: User Story 2 functional - Real-time bidding war experience is live.

---

## Phase 5: User Story 3 - Bid Acceptance & Escrow (Priority: P2)

**Goal**: Enable Client to select a winner and secure funds in virtual escrow.

**Independent Test**: Select a bid, verify project status changes to `in_progress`, and check `escrow_ledger` for the entry.

### Implementation for User Story 3

- [ ] T018 [P] [US3] Create `BidSelectionList` for the Client dashboard in `src/components/bidding/BidSelectionList.tsx`
- [ ] T019 [US3] Implement "Accept Bid" interaction logic in `src/app/(app)/dashboard/client/projects/[id]/page.tsx`
- [ ] T020 [P] [US3] Create `EscrowBadge` component to show "Funds Secured" status in `src/components/lifecycle/EscrowBadge.tsx`
- [ ] T021 [US3] Add "Secure Holding" visualization to the project header upon acceptance

**Checkpoint**: User Story 3 functional - Contract agreement and virtual payment locking works.

---

## Phase 6: User Story 4 - Delivery & Approval (Priority: P2)

**Goal**: Facilitate final work submission and payment release.

**Independent Test**: Submit a deliverable, approve as client, and verify project status becomes `completed`.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Create `DeliveryUploadForm` for freelancers in `src/components/lifecycle/DeliveryUploadForm.tsx`
- [ ] T023 [P] [US4] Create `ClientReviewPanel` for approving/rejecting work in `src/components/lifecycle/ClientReviewPanel.tsx`
- [ ] T024 [US4] Implement `complete_project` RPC to release escrow and update final project status
- [ ] T025 [US4] Implement notification UI for the "Payment Released" event

**Checkpoint**: Full lifecycle functional from post to paid.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Update `ROADMAP.md` to reflect Phase 02 completion
- [ ] T027 [P] Perform 6-pillar visual audit on the Bidding Dashboard
- [ ] T028 Optimize Realtime channel cleanup on component unmount
- [ ] T029 Ensure all bidding forms support RTL layouts and Cairo font
- [ ] T030 Final validation of `quickstart.md` procedures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- T005, T006, T007 (SQL Tasks) can run in parallel.
- US1 (Project Creation) and US2 (Real-Time Bidding) can be developed in parallel once Phase 2 is done.
- UI components marked [P] can be scaffolded simultaneously.

---

## Implementation Strategy

### MVP First (US1 & US2)

1. Complete Phase 1 & 2 (Foundation).
2. Complete US1 (Project Creation) and US2 (Real-Time Bidding).
3. **STOP and VALIDATE**: Test the bidding loop independently.

### Incremental Delivery

1. Add US3 (Acceptance) to close the deal.
2. Add US4 (Delivery) to complete the value cycle.
