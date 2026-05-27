---
name: Petal Path hook count rule
description: useLocalStorage now uses two hooks (useState + useCallback). Changing hook count breaks HMR and requires workflow restart.
---

# useLocalStorage Hook Count

The `use-local-storage.ts` hook uses **two hooks per call**: `useState` (stored value) and `useCallback` (setter). This means every component calling `useLocalStorage` N times has 2N hook slots from this hook alone.

**Why this matters:** React's HMR (hot module reload) tracks hook order from the previous render. If you add or remove a hook inside `useLocalStorage`, HMR will throw "Rendered more hooks than during the previous render" on every component that uses it. This crashes the app in dev.

**How to apply:**
- After any change to `use-local-storage.ts` that adds/removes hooks, you MUST restart the workflow (not just save the file).
- `restart_workflow("artifacts/petal-path: web")` clears the HMR state.
- In production builds this is never an issue — only affects dev HMR.

**Current shape:**
```ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(...);   // hook 1
  const setValue = useCallback((value) => { ... }, [key]);   // hook 2
  return [storedValue, setValue] as const;
}
```
