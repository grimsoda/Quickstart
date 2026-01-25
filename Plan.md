# Quickstart App Plan

Quickstart is a do/decide/drift menu app.

## Goals \& design principles

**Do/Decide/Drift Menu** is a “state router” that intercepts post-busy ambiguity (blankness + boredom + feed-refreshing) and converts it into one of three explicit modes: *Do* (action), *Decide* (small choice), or *Drift* (bounded recovery).

Design is grounded in two realities: (1) after many prior decisions, people commonly show patterns consistent with decision fatigue (reduced initiative/avoidance), so the app must reduce choice cost at the moment of use; and (2) algorithmic feeds exploit reward-learning dynamics that make repeated refreshing feel compelling, so the app must intervene at the cue (new tab / phone unlock), not only via willpower.

Principles:

- **Local-first**: works offline; “backend optional.”
- **Cue-level interception**: new-tab, lock-screen widget, quick actions.
- **Minimize decisions**: show 3–7 options max per mode; defaults everywhere.
- **Small starts beat perfect plans**: 2-minute and 10-minute “wedges” as primary affordances.
- **Career capital + tomorrow-wins**: every recommended action must cash out into either compounding career assets or improved next-day experience.


## Core UX \& features (with justifications)

### Primary objects

- **Menu Item**: a concrete action with an initiation step (“Open repo → write 3 bullets”), expected duration, and a category on the task's type
- **Mode**: Do / Decide / Drift.

### Do mode (action menu)

Purpose: kill initiation resistance by offering *immediately startable* actions.

- **Do Now (2 minutes)**: tasks with the lowest activation energy
- **Do (10 minutes)**: “maintenance sprint” actions (cleanup, prep, tiny admin).
- **Do (25 minutes)**: one career-capital rep (deep work starter, *not* the whole project).

Do-mode item types (defaults provided out of the box):

- **Career-capital micro-reps**
    - Ship friction reducers: “write next-step plan,” “open PR stub,” “add 1 benchmark run,” “write 1 paragraph of notes.”
- **Tomorrow-wins**
    - “Seed tomorrow’s first block,” “prep workspace,” “set shutdown plan,” “pack bag.”


### Decide mode (micro-decision menu)

Purpose: when you’re looping, the smallest useful action is often making *one* bounded choice.

- **One decision at a time**: show a single decision card (e.g., “Pick 1 of these 2 tasks”).
- **Decision templates** (user-configurable):
    - “Pick the next constraint” (time/energy/location).
    - “Pick the next deliverable” (artifact-based).
    - “Pick the next risk reducer” (reduce uncertainty).
- **Anti-rumination reminder**: “Remind the user to decide in <90 seconds or defer with a rule.”
    - Why: decision fatigue patterns can drive avoidance; forcing closure prevents Decide mode from becoming another stall tactic.


### Drift mode (bounded recovery that doesn’t metastasize)

Purpose: allow recovery without turning into infinite sampling.

- **Finite drift cards**: “Watch 1 saved video,” “20-min Twitch block,” “10-min walk,” “stretch,” “shower,” “music.”
    - Why: repeated refresh loops are reinforced by variable rewards; converting drift into a bounded choice interrupts the cue→refresh chain.


## Data model, scoring, and architecture (low-backend)

### Data model (minimal but extensible)

- `MenuItem`: `id`, `mode`, `title`, `start_step`, `duration_bucket`, `category` (career / tomorrow / drift), `tags`, `friction_score`, `enabled`, `created_at`, `updated_at`
- `Rule`: `id`, `trigger` (new_tab, unlock, time_window, post_busy_block), `conditions`, `action` (show_mode, pin_item, start_timer)
- `Session`: `id`, `item_id`, `started_at`, `ended_at`, `device`, `outcome` (done/partial/aborted), `notes` (optional)
- `Preference`: caps, ordering, widget config, blocklists

### Local-first storage

- Mobile: SQLite (expo-sqlite) or MMKV
- Web: IndexedDB (via Dexie or similar).


### Optional sync (free-tier friendly)

Two-tier approach:

1) **No account needed**: everything local; export/import JSON.
2) Import from a github gist link that stores the JSON

## Mobile app (Expo iOS) + widgets spec

### Stack

- Expo (managed workflow), TypeScript, React Navigation / Expo Router.
- Build for iOS distribution in a macos runner using GitHub Actions.


### iOS widgets (Expo-compatible approach)

Implement a native SwiftUI Widget Extension alongside the Expo app, using an Expo-supported path for adding iOS widget targets to an Expo project.
A practical route is leveraging “Expo Apple Targets” / related tooling to generate and manage widget targets and share data between the main app and the widget.
Config plugins are the mechanism Expo provides for extending native configuration in a managed project, so any widget integration should be packaged as a config plugin (internal or open-sourced).

### Widget families (v1)

- **Small widget**: “Top Do (2 min)” + “Top Tomorrow-win (10 min)” + one-tap “Open Menu.”
- **Medium widget**: Do/Decide/Drift three-column with 1-2 random items each.


### Widget behaviors

- Always shows *finite* choices (max 3).
- Tapping the widget opens the specific menu for the task (do/decide/drift), elsewhere should just be the menu to choose one of those
- Widget refresh strategy:
    - Conservative periodic refresh to preserve battery.


### Mobile UX screens

- **Home (Menu)**: segmented control Do/Decide/Drift + “Start wedge” buttons.
- **Item Editor**: templates for career micro-reps and tomorrow-wins; enforce “start_step required.”
- **Settings**: export/import.

