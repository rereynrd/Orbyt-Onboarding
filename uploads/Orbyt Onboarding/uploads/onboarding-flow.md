# Onboarding Flow

Route: `/onboarding` → `OnboardingPage` → `OnboardingWizard`

Progress is tracked in a 6-step wizard with a progress bar. State is stored in
both `localStorage` (`orbyt:onboarding`) and the server DB, and is hydrated from
the server on WebSocket connect (falling back to localStorage on failure).

---

## Steps

### Step 1 — Welcome
Component: `WelcomeStep`  
Required: no  

Intro screen. Describes the app in two sentences and shows an estimated setup
time (~5 min). Single "Get Started" button advances to step 2. No back button
on this step.

---

### Step 2 — AI Connection
Component: `AiAuthStep`  
Required: no  

Prompts the user to connect a ChatGPT account via `connectCodexAccount()`, which
opens a browser window for OAuth. Phases: `idle → connecting → connected | error`.

- **Connected**: "Next" button advances.
- **Not connected / error**: the "Next" button label becomes "Skip", which calls
  `setAiAuthStatus("skipped")` and fires `onboarding.setAiAuth({ status: "skipped" })`
  to the server before advancing.
- An inline "Skip for now" link does the same thing.

`aiAuthStatus` (`pending | connected | skipped`) is stored separately from step
status and drives redirect logic on subsequent launches.

---

### Step 3 — Study Preferences
Component: `PreferencesStep`  
Required: no  

Allows the user to configure:
- **Preferred study times**: Morning / Afternoon / Evening (multi-select toggles)
- **Max session duration**: 30 min – 3 h (single-select from 6 options)
- **Off-limit days**: Mon – Sun (multi-select toggles)
- **Notifications**: enable/disable switch + quiet-hours time range (HH:MM)

Each change fires `onboarding.setPreferences(patch)` immediately (fire-and-forget).
Preferences are loaded from the server on mount via `onboarding.getPreferences()`.

Skippable via the "Skip" button (step is not required).

---

### Step 4 — Weekly Routines
Component: `RoutinesStep`  
Required: no  

A 7-column × 16-row grid (6 AM – 9 PM, Mon – Sun). Users click cells to mark
recurring commitments (classes, work, etc.) so the scheduler avoids those slots.

Each toggle fires `onboarding.setRoutines({ cells })` immediately.
Existing routine cells are loaded from `onboarding.getRoutines()` on mount.

Skippable.

---

### Step 5 — Canvas Sync
Component: `FirstSyncStep`  
Required: no  

**Placeholder** — Canvas integration is not yet implemented. Displays a static
message and a "Continue" button that advances to step 6 without doing anything.

> `TODO(canvas-mcp)`: Replace with real sync progress once Canvas MCP is landed.
> Plan: call `client.canvas.sync()`, subscribe to `canvas.syncProgress` push events,
> show a Progress bar, and auto-advance on `"done"` status.

---

### Step 6 — Dashboard Tour
Component: `DashboardWalkthrough` + `WalkthroughOverlay`  
Required: no  

A spotlight walkthrough with 5 sequential steps:

| # | Target | Title | Notes |
|---|--------|-------|-------|
| 1 | `dashboard-filter-tabs` | Filters | Today / This Week / Upcoming / Overdue |
| 2 | `dashboard-assignments` | Coursework | Assignments grouped by course |
| 3 | `grade-insights-widget` | Grade Insights | Standings, projected GPA, trend |
| 4 | `weekly-outlook-widget` | Weekly Outlook | Timeline of sessions and deadlines |
| 5 | `plan-my-week` | Plan my week | Chat shortcut for building a study plan |

Completing the last walkthrough step (or dismissing at any point) calls
`completeOnboarding()` + `persistOnboardingState()`, sets `overallStatus =
"completed"` on the server, and navigates to `/`.

---

## State Management

### Client-side atom (`onboarding-wizard`)
```ts
{
  currentStep: number          // 0–5
  steps: OnboardingStepState[] // { status: "pending"|"completed"|"skipped", completedAt }
  overallStatus: "in_progress" | "completed"
  aiAuthStatus: "pending" | "connected" | "skipped"
}
```

### Persistence
- **localStorage** key: `orbyt:onboarding` — written on every step advance/skip.
- **Server DB** — each step synced via `onboarding.setStepStatus()`; overall
  status via `onboarding.setOverallStatus()`; AI auth via `onboarding.setAiAuth()`.
- Server sync is fire-and-forget; localStorage is the fallback if the server is
  unreachable.

### Hydration on startup
`hydrateOnboardingStateFromServer()` runs after WebSocket connects:
1. Fetches `onboarding.getSnapshot()` + `onboarding.getAiAuth()` in parallel.
2. Derives `overallStatus` (server OR localStorage OR aiAuth = connected → completed).
3. Derives `currentStep` as the index of the first non-completed step.
4. Falls back to `hydrateOnboardingState()` (localStorage only) on any error.
5. Sets `serverHydrationCompleteAtom = true` so the guard doesn't redirect
   prematurely.

### Routing guard (`AppShell`)
After hydration is complete, if `overallStatus !== "completed"` and the user is
not already at `/onboarding`, `AppShell` navigates to `/onboarding` automatically.

---

## Dev Controls

`DevOnboardingControls` exposes two resets (dev mode only):
- **Soft reset** — clears wizard step state, keeps Canvas token + AI auth.
- **Hard reset** — clears everything including AI auth.
