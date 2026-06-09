import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state from localStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Setter that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((current) => {
        const valueToStore =
          value instanceof Function ? value(current) : value;
        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(
            `[useLocalStorage] Failed to save key "${key}":`,
            error
          );
        }
        return valueToStore;
      });
    },
    [key]
  );

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
