---
name: Petal Path localStorage keys
description: Canonical map of all petal- prefixed localStorage keys, which component owns them, and their data shape.
---

# Petal Path localStorage Key Map

**Why:** GamificationBar was silently reading from wrong keys (`petal-todo` instead of `petal-todos`, `petal-water-logs` instead of `petal-water`), causing XP and streaks to always read as zero. Wrong keys produce empty defaults with no error.

**How to apply:** Any new component reading shared state must use the exact key from this table. Any new key must be added here.

| Key | Owner | Shape |
|-----|-------|-------|
| `petal-todos` | TodoList | `{id, text, done: boolean, priority}[]` — field is `done`, NOT `completed` |
| `petal-habits` | HabitTracker | `{id, name, streak, totalDays}[]` |
| `petal-habit-logs` | HabitTracker | `Record<yyyy-MM-dd, habitId[]>` |
| `petal-planner` | DailyPlanner | `Record<yyyy-MM-dd-HH, {text, done}>` |
| `petal-water` | WaterTracker | `Record<yyyy-MM-dd, number>` (glass count, 0–8) |
| `petal-sleep` | SleepTracker | `Record<yyyy-MM-dd, {sleepTime, wakeTime, quality, duration}>` |
| `petal-exercise` | ExerciseTracker | `{id, date, ...}[]` |
| `petal-meals` | MealTracker | `Record<yyyy-MM-dd, {[meal]: items[]}>` |
| `petal-notes` | Notes | `{id, title, content, color}[]` |
| `petal-affirmations` | Affirmations | `string[]` |
| `petal-mood` | MoodTracker | `Record<yyyy-MM-dd, {emoji, intensity, note}>` |
| `petal-energy` | EnergyTracker | `Record<yyyy-MM-dd, {energy, motivation, stress, social}>` |
| `petal-selfcare-tasks` | SelfCareChecklist | `string[]` (task names) |
| `petal-selfcare-logs` | SelfCareChecklist | `Record<yyyy-MM-dd, string[]>` |
| `petal-littlethings-custom` | LittleThings | `string[]` |
| `petal-littlethings-logs` | LittleThings | `Record<yyyy-MM-dd, string[]>` |
| `petal-gratitude` | GratitudeMini + JournalView | `Record<yyyy-MM-dd, {id, text}[]>` — NOT `string[]` |
| `petal-journal-entries` | JournalView | `{id, date, title, content, ...}[]` |
| `petal-study-sessions` | FocusView | `{id, date, subject, duration, type}[]` |
| `petal-subjects` | FocusView | `string[]` |
| `petal-finance-balance` | FinanceView | `number` |
| `petal-finance-expenses` | FinanceView | `{id, amount, category, note, date}[]` |
| `petal-finance-goals` | FinanceView | `{id, name, target, current, deadline?}[]` |
| `petal-finance-notes` | FinanceView | `{id, content, color}[]` |
| `petal-period-cycles` | WellnessView | `{id, startDate, endDate\|null}[]` |
| `petal-period-logs` | WellnessView | `Record<yyyy-MM-dd, {symptoms, notes}>` |
| `petal-theme-accent` | ThemePanel | `string` (color id: rose/lavender/mint/peach/sky/butter) |
| `petal-theme-font` | ThemePanel | `string` (font id: nunito/quicksand/outfit) |
| `petal-theme-bg` | ThemePanel | `string` (bg id: warm-white/soft-cream) |
| `petal-goals` | MonthlyView | `{id, text, progress: number}[]` |
| `petal-week-notes` | WeeklyView | `Record<yyyy-MM-dd, string>` |
| `petal-highlights` | JournalView | `Record<yyyy-MM-dd, {prompt, answer}[]>` |
