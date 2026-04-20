# Feature Specification: Functional Bidding & Project Lifecycle

**Feature Branch**: `001-bidding-lifecycle`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Phase 02: Functional Bidding & Project Lifecycle. This covers how users post projects, how freelancers bid in real-time, and how the escrow/delivery cycle works."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Project Creation & Launch (Priority: P1)

As a Client, I want to define a project with specific requirements, budget range, and timeline so that qualified freelancers can discover and bid on my opportunity.

**Why this priority**: Core entry point for the entire marketplace ecosystem. Without projects, there are no bids.

**Independent Test**: Can be fully tested by creating a project and verifying it appears in the "Explore" or "Auctions" feed with all metadata intact.

**Acceptance Scenarios**:

1. **Given** a logged-in Client, **When** they submit a project with title, description, budget, and skills, **Then** the project should enter "Active" state and be visible to freelancers.
2. **Given** an incomplete submission, **When** mandatory fields are missing, **Then** the system prevents submission and highlights the missing data.

---

### User Story 2 - Real-Time Bidding (Priority: P1)

As a Freelancer, I want to place a bid on an active project with my price, estimated duration, and a proposal pitch so that I can compete for the work.

**Why this priority**: Fundamental marketplace mechanism for price discovery and talent selection.

**Independent Test**: Can be tested by placing a bid on an active project and verifying the bid list updates in real-time for both the Client and other Freelancers.

**Acceptance Scenarios**:

1. **Given** an active project, **When** a Freelancer submits a bid within the allowed budget range, **Then** the bid is recorded and the "Current Bid" counter is updated.
2. **Given** a new bid is placed, **When** other active bidders are viewing the project, **Then** they receive a notification or visual update of the new competitive entry.

---

### User Story 3 - Bid Acceptance & Escrow Initiation (Priority: P2)

As a Client, I want to select a winning bid so that the project can start and the funds can be secured in a trusted holding state.

**Why this priority**: Establishes trust and formalizes the work agreement.

**Independent Test**: Can be tested by selecting a bid and verifying the project status changes to "In Progress" while the financial "Deposit" event is logged.

**Acceptance Scenarios**:

1. **Given** multiple bids, **When** the Client selects "Accept", **Then** the project moves to "In Progress" and all other bids are gracefully rejected/closed.
2. **Given** a bid acceptance, **When** the freelancer is notified, **Then** the project dashboard unlocks for shared communication and deliverable tracking.

---

### User Story 4 - Work Delivery & Final Approval (Priority: P2)

As a Freelancer, I want to submit my completed files and documentation for review so that I can receive payment for my work.

**Why this priority**: Completes the value exchange cycle.

**Independent Test**: Can be tested by uploading a "Delivery" and verifying the Client receives an "Approve/Request Change" prompt.

**Acceptance Scenarios**:

1. **Given** a project in progress, **When** the Freelancer marks it as "Delivered", **Then** the Client is prompted to review the deliverables.
2. **Given** a delivery, **When** the Client clicks "Approve", **Then** the held funds are released and the project moves to "Completed".

---

### Edge Cases

- **Retracted Bids**: What happens when a freelancer withdraws a bid after it was placed? (System should allow retraction only before acceptance).
- **Outbid Race Conditions**: How does the system handle two bids arriving at the exact same millisecond? (System must use atomic increments/timestamps to order bids).
- **Expired Projects**: What happens if a project reaches its deadline without any bids? (System moves it to "Expired" and notifies the Client to repost or adjust).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support a Project Post form with multi-field validation (Title, Budget, Category, Deadline).
- **FR-002**: System MUST implement a Real-Time Bidding Engine that updates live values without page refreshes.
- **FR-003**: System MUST enforce budget constraints (e.g., bids cannot exceed a maximum platform cap if one exists).
- **FR-004**: System MUST maintain a Project State Machine (Draft -> Active -> In Progress -> Review -> Completed -> Cancelled).
- **FR-005**: System MUST provide a "Bidding History" log for each project showing time-stamped entries.
- **FR-006**: System MUST authenticate users and verify roles (Client can post, Freelancer can bid).
- **FR-007**: System MUST support an Escrow holding logic where funds are symbolically "Locked" until delivery approval.

### Key Entities *(include if feature involves data)*

- **Project (Auction)**: Represents the task being offered. Attributes: Title, Description, Status, BudgetRange, Deadline, ClientID.
- **Bid**: Represents a freelancer's offer. Attributes: ProjectID, FreelancerID, Amount, ProposalText, Status (Open/Accepted/Rejected).
- **EscrowContract**: Represents the financial agreement. Attributes: BidID, Amount, Status (Pending/Held/Released/Refunded).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can post a new project in under 60 seconds (once logged in).
- **SC-002**: Bids are reflected on the project page within 500ms of submission for all active viewers.
- **SC-003**: 100% of "Accepted" bids result in a corresponding Escrow record creation.
- **SC-004**: System supports a minimum of 100 simultaneous bidding wars on different projects without latency spikes.

## Assumptions

- **Payments Strategy**: We assume for Phase 02 that the "Escrow" is a symbolic/database state before full payment gateway integration (Stripe/Paypal) is finalized.
- **Real-Time Tech**: We assume the use of WebSockets or a real-time database listener (Supabase Realtime) is available.
- **Role Isolation**: We assume a single user account can act as either Client or Freelancer depending on the action taken (or has separate profiles).
- **Notifications**: Internal platform notifications are preferred over external email for real-time bidding updates initially.
