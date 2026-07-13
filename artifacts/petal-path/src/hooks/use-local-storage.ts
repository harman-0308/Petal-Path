import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue(prev => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch custom event for same-window syncing
          window.dispatchEvent(
            new CustomEvent("local-storage-sync", {
              detail: { key, newValue: valueToStore },
            })
          );
          
          return valueToStore;
        });
      } catch (e) {
        console.error("useLocalStorage write error:", e);
      }
    },
    [key]
  );

  useEffect(() => {
    // Sync same-window changes
    const handleCustomStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; newValue: T }>;
      if (customEvent.detail && customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.newValue);
      }
    };

    // Sync cross-tab changes
    const handleNativeStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("local-storage-sync", handleCustomStorageChange);
    window.addEventListener("storage", handleNativeStorage);

    return () => {
      window.removeEventListener("local-storage-sync", handleCustomStorageChange);
      window.removeEventListener("storage", handleNativeStorage);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}
