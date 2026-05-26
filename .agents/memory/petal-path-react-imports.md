---
name: Petal Path — React import pattern
description: This Vite project auto-transforms JSX, so explicit React imports in dashboard components break at runtime.
---

# Rule
Never use `import React from "react"` or `React.useState` / `React.useEffect` / `React.useMemo` etc. in any file under `artifacts/petal-path/src/components/dashboard/` or `src/pages/`.

**Why:** The Vite config uses the automatic JSX runtime (`react/jsx-runtime`). Adding a default `React` import introduces a second copy of the React module, causing "Invalid hook call" / "Cannot read properties of null (reading 'useRef')" at runtime for hooks inside Radix UI components like `<Slider>`. Removing the import entirely and using named hooks from `"react"` fixes it immediately.

**How to apply:**
- Correct: `import { useState, useEffect, useMemo, useRef, FormEvent } from "react";`
- Wrong: `import React, { useState } from "react";` then using `React.useState()`
- The shadcn UI files in `src/components/ui/` DO use explicit React imports — that is fine because they use a different import style that works with forwardRef patterns. Do not touch those files.
- When subagents write new dashboard components, always grep for `React\.` before shipping to catch `React.useMemo`, `React.useState`, `React.FormEvent` etc.
