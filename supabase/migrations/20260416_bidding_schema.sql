-- ════════════════════════════════════════════════════════════════════════════
-- T004 — Bidding Lifecycle Schema Migration
-- Creates: bids table, escrow_ledger table, RPC functions, triggers, RLS
-- ════════════════════════════════════════════════════════════════════════════

-- ── Enable UUID generation ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'draft', 'active', 'in_progress', 'review', 'completed', 'cancelled', 'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE bid_status AS ENUM (
    'open', 'accepted', 'rejected', 'withdrawn'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status AS ENUM (
    'pending', 'held', 'released', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Projects table (ensure status column uses enum) ───────────────────────────
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS status project_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS budget_min DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS budget_max DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS winning_bid_id UUID,
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ── Bids table ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bids (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  freelancer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount            DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  days_to_complete  INTEGER NOT NULL CHECK (days_to_complete > 0),
  proposal          TEXT NOT NULL,
  status            bid_status NOT NULL DEFAULT 'open',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, freelancer_id)   -- one bid per freelancer per project
);

-- ── Escrow ledger table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.escrow_ledger (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id       UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  bid_id           UUID REFERENCES public.bids(id),
  amount           DECIMAL(12,2) NOT NULL,
  status           escrow_status NOT NULL DEFAULT 'pending',
  milestone_title  TEXT NOT NULL DEFAULT 'Initial Deposit',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bids_project_id    ON public.bids(project_id);
CREATE INDEX IF NOT EXISTS idx_bids_status        ON public.bids(status);
CREATE INDEX IF NOT EXISTS idx_escrow_project_id  ON public.escrow_ledger(project_id);

-- ── T005 — Enable Realtime ────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- ── T005 — Row Level Security ─────────────────────────────────────────────────
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_ledger ENABLE ROW LEVEL SECURITY;

-- Bids: anyone can read bids on active projects
CREATE POLICY IF NOT EXISTS "bids_select_public"
  ON public.bids FOR SELECT USING (true);

-- Bids: only authenticated freelancers can insert their own bids
CREATE POLICY IF NOT EXISTS "bids_insert_auth"
  ON public.bids FOR INSERT
  WITH CHECK (auth.uid() = freelancer_id);

-- Bids: freelancers can only update their own open bids
CREATE POLICY IF NOT EXISTS "bids_update_own"
  ON public.bids FOR UPDATE
  USING (auth.uid() = freelancer_id AND status = 'open');

-- Escrow: clients can see escrow for their own projects
CREATE POLICY IF NOT EXISTS "escrow_select_project_owner"
  ON public.escrow_ledger FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE client_id = auth.uid()
    )
  );

-- ════════════════════════════════════════════════════════════════════════════
-- T006 — RPC: submit_bid
-- Validates + inserts a new bid for an active project
-- ════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.submit_bid(
  p_project_id UUID,
  p_amount     DECIMAL,
  p_days       INTEGER,
  p_proposal   TEXT
)
RETURNS public.bids
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_project public.projects;
  v_bid     public.bids;
BEGIN
  -- Validate project exists and is active
  SELECT * INTO v_project FROM public.projects WHERE id = p_project_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found';
  END IF;
  IF v_project.status != 'active' THEN
    RAISE EXCEPTION 'Project is not open for bidding (status: %)', v_project.status;
  END IF;

  -- Validate budget range
  IF v_project.budget_max IS NOT NULL AND p_amount > v_project.budget_max THEN
    RAISE EXCEPTION 'Bid amount exceeds project budget maximum of %', v_project.budget_max;
  END IF;

  -- Insert bid
  INSERT INTO public.bids (project_id, freelancer_id, amount, days_to_complete, proposal)
  VALUES (p_project_id, auth.uid(), p_amount, p_days, p_proposal)
  RETURNING * INTO v_bid;

  RETURN v_bid;
END;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- T007 — RPC: accept_bid
-- Atomically accepts a bid and transitions project to in_progress
-- ════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.accept_bid(p_bid_id UUID)
RETURNS public.projects
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_bid     public.bids;
  v_project public.projects;
BEGIN
  -- Load and validate the bid
  SELECT * INTO v_bid FROM public.bids WHERE id = p_bid_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bid not found';
  END IF;

  -- Verify the caller owns the project
  SELECT * INTO v_project FROM public.projects WHERE id = v_bid.project_id;
  IF v_project.client_id != auth.uid() THEN
    RAISE EXCEPTION 'Only the project owner can accept bids';
  END IF;
  IF v_project.status != 'active' THEN
    RAISE EXCEPTION 'Project is not in bidding phase';
  END IF;

  -- Accept the winning bid, reject all others
  UPDATE public.bids SET status = 'rejected' WHERE project_id = v_bid.project_id AND id != p_bid_id;
  UPDATE public.bids SET status = 'accepted' WHERE id = p_bid_id;

  -- Transition project
  UPDATE public.projects
  SET status = 'in_progress', winning_bid_id = p_bid_id, updated_at = NOW()
  WHERE id = v_bid.project_id
  RETURNING * INTO v_project;

  RETURN v_project;
END;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- T008 — Trigger: initiate_escrow on bid acceptance
-- ════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.create_escrow_on_bid_accept()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'open' THEN
    INSERT INTO public.escrow_ledger (project_id, bid_id, amount, status, milestone_title)
    VALUES (NEW.project_id, NEW.id, NEW.amount, 'held', 'Initial Deposit');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_escrow_on_bid_accept ON public.bids;
CREATE TRIGGER trg_escrow_on_bid_accept
  AFTER UPDATE ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.create_escrow_on_bid_accept();

-- ════════════════════════════════════════════════════════════════════════════
-- T024 — RPC: complete_project
-- Releases escrow and moves project to completed
-- ════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.complete_project(p_project_id UUID)
RETURNS public.projects
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_project public.projects;
BEGIN
  SELECT * INTO v_project FROM public.projects WHERE id = p_project_id;

  IF v_project.client_id != auth.uid() THEN
    RAISE EXCEPTION 'Only the project owner can complete the project';
  END IF;
  IF v_project.status != 'review' THEN
    RAISE EXCEPTION 'Project must be in review phase to complete';
  END IF;

  -- Release escrow
  UPDATE public.escrow_ledger SET status = 'released'
  WHERE project_id = p_project_id AND status = 'held';

  -- Complete project
  UPDATE public.projects SET status = 'completed', updated_at = NOW()
  WHERE id = p_project_id
  RETURNING * INTO v_project;

  RETURN v_project;
END;
$$;
