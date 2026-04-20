import { useState, useEffect } from 'react';

/**
 * useLocalStorage — syncs a state value with localStorage.
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage('theme', 'dark');
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (value: T) => void]}
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn(`[useLocalStorage] Could not persist key "${key}"`);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
