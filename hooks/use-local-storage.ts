import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep an effect just in case we need to sync multiple components using the same hook,
  // but for the initial render, the lazy state initializer covers it.
  useEffect(() => {
    setStoredValue((currentValue) => {
      try {
        const item = window.localStorage.getItem(key);
        const parsed = item ? JSON.parse(item) : initialValue;
        // Only update if different to avoid infinite loops
        if (JSON.stringify(currentValue) !== JSON.stringify(parsed)) {
          return parsed;
        }
        return currentValue;
      } catch (error) {
        return currentValue;
      }
    });
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}
