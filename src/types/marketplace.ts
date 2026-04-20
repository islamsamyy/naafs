// ── Marketplace Type Definitions ─────────────────────────────────────────────
// Enums and interfaces for the Nafis Bidding Lifecycle (Phase 02)

export type ProjectStatus =
  | "draft"
  | "open"
  | "awarded"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BidStatus = "open" | "accepted" | "rejected" | "withdrawn";

export type EscrowStatus = "pending" | "held" | "released" | "refunded";

// ── Core Entities ─────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget_min: number;
  budget_max: number;
  deadline: string; // ISO timestamp
  client_id: string;
  awarded_freelancer_id?: string | null;
  category?: string;
  skills?: string[];
  currency?: string;
  created_at: string;
  updated_at?: string;
  // Joined fields
  client?: {
    name: string;
    avatar_url: string;
  };
  bids?: Bid[];
}

export interface Bid {
  id: string;
  project_id: string;
  freelancer_id: string;
  amount: number;
  delivery_time?: string;
  message?: string;
  status?: BidStatus;
  created_at: string;
  // Backward compat aliases
  days_to_complete?: number;
  proposal?: string;
  // Joined fields
  freelancer?: FreelancerProfile;
  project?: Project;
}

export interface EscrowLedger {
  id: string;
  project_id: string;
  amount: number;
  status: EscrowStatus;
  milestone_title: string;
  created_at: string;
}

export interface FreelancerProfile {
  id: string;
  name?: string;
  avatar_url?: string;
  title?: string;
  rating?: number;
  reviews_count?: number;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
  // Backward compat aliases
  full_name?: string;
  review_count?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  is_read: boolean;
  metadata: any;
  created_at: string;
}

// ── RPC Arguments ─────────────────────────────────────────────────────────────

export interface SubmitBidArgs {
  p_project_id: string;
  p_amount: number;
  p_days: number;
  p_proposal: string;
}

export interface AcceptBidArgs {
  p_bid_id: string;
}

export interface CreateProjectArgs {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  category?: string;
  skills?: string[];
}
