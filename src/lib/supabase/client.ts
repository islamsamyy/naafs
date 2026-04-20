// ── Supabase Client with Realtime Support ─────────────────────────────────────
// T003 — Configure Supabase for Realtime subscriptions on bids + projects

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton client with Realtime enabled
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ── Realtime Channel Helpers ───────────────────────────────────────────────────

/**
 * Subscribe to live bid events for a specific project.
 * Used by the LiveTicker component.
 */
export function subscribeToBids(
  projectId: string,
  onInsert: (bid: unknown) => void,
  onUpdate?: (bid: unknown) => void
) {
  const channel = supabase
    .channel(`bids:project:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "bids",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => onInsert(payload.new)
    );

  if (onUpdate) {
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "bids",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => onUpdate(payload.new)
    );
  }

  channel.subscribe();
  return channel;
}

/**
 * Subscribe to project status changes.
 * Used to detect when an auction moves to in_progress or completed.
 */
export function subscribeToProject(
  projectId: string,
  onUpdate: (project: unknown) => void
) {
  const channel = supabase
    .channel(`project:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "projects",
        filter: `id=eq.${projectId}`,
      },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();

  return channel;
}
