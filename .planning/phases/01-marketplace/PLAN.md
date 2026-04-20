# Phase Plan: 01-marketplace (Explorer & Talent Discovery)

## Goal
Implement the core talent discovery workflow, allowing business users to find, filter, and review freelancer profiles using live data from Supabase.

---

## 1. Directory Structure
- Create `src/app/(app)/explore/page.tsx` (Main explorer container).
- Link to existing components in `src/components/marketplace`.

## 2. Supabase Data Integration
- Connect `TalentFilters` to the explore page state.
- Implement fetching from `public.profiles` (where `role='freelancer'`).
- Ensure RLS policies in Supabase allow read access to freelancer profiles.

## 3. Page Layout
- **Hero Section:** "Find your next creative partner" search bar.
- **Main Feed:** Two-column layout (Left: `TalentFilters`, Right: `TalentCard` grid).
- **Infinite Scroll or Load More:** Handling large lists of freelancers.

## 4. Search & Filtering Logic
- [ ] Text search by name/title.
- [ ] Category filtering (Skills/Tags).
- [ ] Price range filtering (Hourly Rate).
- [ ] Experience level filtering (Years of experience logic).

## 5. Visual Excellence (Phase 01)
- Skeleton loaders for profile cards.
- "Glow-up" transitions when filters are applied.
- Empty states with "No talent found" illustrations.

---

## Verification Plan (UAT)
1.  **Talent discovery:** Verify searching for "designer" returns designers.
2.  **Filter logic:** Verify price filters correctly update the list locally.
3.  **Supabase Sync:** Verify newly registered freelancers appear in the feed.
4.  **Mobile view:** Verify filter sidebar handles responsive views (Drawer/Bottom sheet).
