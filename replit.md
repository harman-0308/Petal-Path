# Petal Path

A luxury kawaii personal productivity and wellness dashboard — all data in localStorage, no backend.

## Run & Operate

- `pnpm --filter @workspace/petal-path run dev` — start the app (port auto-assigned via PORT env var)
- Preview at `/` in the Replit webview

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite (no backend)
- Tailwind CSS v4, shadcn/ui components
- Framer Motion animations
- Recharts for data visualization
- All persistence via localStorage (no API, no DB)

## Where things live

- `artifacts/petal-path/src/pages/Dashboard.tsx` — main layout and tab routing
- `artifacts/petal-path/src/components/dashboard/` — all feature widgets
- `artifacts/petal-path/src/hooks/use-local-storage.ts` — shared persistence hook
- `artifacts/petal-path/src/index.css` — global styles + utility classes
- `artifacts/petal-path/src/components/ui/` — shadcn primitives

## localStorage key map

| Key | Component | Data shape |
|-----|-----------|------------|
| `petal-todos` | TodoList | `{id, text, done, priority}[]` |
| `petal-habits` | HabitTracker | `{id, name, streak, totalDays}[]` |
| `petal-habit-logs` | HabitTracker | `Record<yyyy-MM-dd, habitId[]>` |
| `petal-planner` | DailyPlanner | `Record<yyyy-MM-dd-HH, {text,done}>` |
| `petal-water` | WaterTracker | `Record<yyyy-MM-dd, number>` |
| `petal-sleep` | SleepTracker | `Record<yyyy-MM-dd, {sleepTime,wakeTime,quality,duration}>` |
| `petal-exercise` | ExerciseTracker | `{id,date,...}[]` |
| `petal-meals` | MealTracker | `Record<yyyy-MM-dd, {[meal]: items[]}>` |
| `petal-notes` | Notes | `{id,title,content,color}[]` |
| `petal-affirmations` | Affirmations | `string[]` |
| `petal-mood` | MoodTracker | `Record<yyyy-MM-dd, {emoji,intensity,note}>` |
| `petal-energy` | EnergyTracker | `Record<yyyy-MM-dd, {energy,motivation,stress,social}>` |
| `petal-selfcare-tasks` | SelfCareChecklist | `string[]` |
| `petal-selfcare-logs` | SelfCareChecklist | `Record<yyyy-MM-dd, string[]>` |
| `petal-littlethings-custom` | LittleThings | `string[]` |
| `petal-littlethings-logs` | LittleThings | `Record<yyyy-MM-dd, string[]>` |
| `petal-gratitude` | GratitudeMini + JournalView | `Record<yyyy-MM-dd, {id,text}[]>` |
| `petal-journal-entries` | JournalView | `{id,date,title,content,...}[]` |
| `petal-study-sessions` | FocusView | `{id,date,subject,duration,type}[]` |
| `petal-finance-*` | FinanceView | various |
| `petal-period-*` | WellnessView | various |
| `petal-theme-accent` | ThemePanel | `string` (color id) |
| `petal-theme-font` | ThemePanel | `string` (font id) |
| `petal-theme-bg` | ThemePanel | `string` (bg id) |
| `petal-goals` | MonthlyView | `{id,text,progress}[]` |
| `petal-week-notes` | WeeklyView | `Record<yyyy-MM-dd, string>` |

## Architecture decisions

- **No backend** — 100% localStorage. All keys prefixed `petal-`. JSON serialized.
- **Named React imports only** — NEVER `import React from "react"`. Vite JSX transform breaks hooks with default import. Always: `import { useState, useEffect } from "react"`.
- **useLocalStorage hook** — wraps `useState` + `useCallback(setValue, [key])`. Adding/removing hooks (e.g. adding useCallback) changes the hook count and causes HMR "Rendered more hooks" error — requires workflow restart after such changes.
- **Theme** — CSS vars (`--primary`, `--ring`, `--background`, `--app-font-sans`) applied directly to `:root` by ThemePanel on mount. Persisted via localStorage.
- **GamificationBar** reads multiple keys for XP: `petal-habit-logs`, `petal-todos` (field: `done`), `petal-journal-entries`, `petal-water` (≥8 for 15XP), `petal-mood`, `petal-study-sessions`, `petal-gratitude`.

## Product

7-tab wellness & productivity dashboard:
- **Daily** — To-Do, Habits, Planner, Notes, Mood, Energy, Self-Care, Little Things, Gratitude, Affirmations, Water, Sleep, Exercise, Meals
- **Weekly** — Habit heatmap, stats, editable week-at-a-glance notes
- **Monthly** — Calendar heatmap, deletable goals with progress
- **Wellness** — Cycle tracker, charts (mood/energy/sleep), gratitude streak
- **Focus** — Pomodoro timer, study session logging, analytics
- **Journal** — Rich entry editor, highlights, gratitude, weekly/monthly resets
- **Finance** — Balance, expenses, goals, charts, sticky notes

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- NEVER use default React import — breaks hooks at runtime with Vite auto-JSX transform
- Adding `useCallback` to `useLocalStorage` changed hook count — caused HMR error, required workflow restart
- `Progress` component: `indicatorClassName` prop supported via custom interface (not default shadcn)
- GamificationBar streak loop is bounded at 365 days with a `for` loop (not `while(true)`)
- ThemePanel wrapper must be `relative inline-block` (not `fixed`) so the dropdown `absolute` child positions correctly

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
