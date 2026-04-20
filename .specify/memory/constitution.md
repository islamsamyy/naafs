<!--
Sync Impact Report:
- Version change: [INITIAL] → 1.0.0
- List of modified principles:
  * Principle 1: Futuristic & High-Fidelity Design
  * Principle 2: Islamic/Arabic-First UX
  * Principle 3: Real-Time Interactive Marketplace
  * Principle 4: Secure & Transparent Governance
  * Principle 5: Performance & Accessibility
- Added sections: Technology Stack, Development Workflow
- Removed sections: N/A
- Templates requiring updates:
  * .specify/templates/plan-template.md (✅ updated)
  * .specify/templates/spec-template.md (✅ updated)
  * .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: N/A
-->

# Nafis Constitution

## Core Principles

### I. Futuristic & High-Fidelity Design
Every UI component must strictly adhere to the "Neon Nocturne" design language. This includes the extensive use of glassmorphism, kinetic motion, laser-scanline textures, and vibrant high-contrast typography. Basic or generic "MVP-style" layouts are unacceptable. The goal is to "WOW" the user at every interaction.

### II. Islamic/Arabic-First UX
The platform is designed primarily for the MENA region. All layouts MUST be RTL-first, using the 'Cairo' typeface as the primary font. Language and cultural nuances must be respected in both design and tone of voice, ensuring an enterprise-grade experience for Arabic-speaking professionals.

### III. Real-Time Interactive Marketplace
Activity in the marketplace (bids, project status updates, talent activity) MUST be reflected visually in real-time or through high-fidelity simulations. Use pulsing indicators, animated counters, and interactive widgets to make the platform feel alive and bustling.

### IV. Secure & Transparent Governance
Financial security and professional trust are the foundation of Nafis. Secure escrow systems, AI-verified talent scoring, and transparent bidding history must be prominently displayed and verified. Trust signals (badges, verified tags) are mandatory for all marketplace participants.

### V. Performance & Accessibility
While seeking visual excellence, performance must not be compromised. Animations MUST be optimized for smooth execution across various devices and respect 'prefers-reduced-motion' settings. Semantic HTML and accessibility standards (WCAG 2.1) are mandatory for core functional paths.

## Technology Stack
The application uses a modern, high-performance stack:
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Icons & UI**: Lucide React, Radix UI components.
- **Backend & Auth**: Supabase (Postgres, Auth, Storage).
- **Animations**: Custom Tailwind keyframes and raw CSS interactions.

## Development Workflow
- **Spec-Driven**: Every feature must have a corresponding specification before implementation.
- **UI-First**: Frontend changes must pass a 6-pillar visual audit (Clarity, Polish, Motion, Brand, Layout, Accessibility).
- **Verification**: Functional fixes must be verified against high-fidelity UI requirements.

## Governance
This constitution supersedes all ad-hoc development practices. Any amendment to these principles requires a version bump and a documentation of the rationale. All Pull Requests and implementation plans must be audited against these core principles prior to execution.

**Version**: 1.0.0 | **Ratified**: 2026-04-16 | **Last Amended**: 2026-04-16
