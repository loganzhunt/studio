"use client";

import { useState, useEffect, useCallback } from "react";

type StorageItem = {
  key: string;
  value: any;
  timestamp?: number;
};

export interface UseLocalStorageReturn {
  /**
   * Get a value from local storage by key
   * @param key The key to retrieve
   * @param defaultValue Default value if key doesn't exist
   */
  getItem: <T>(key: string, defaultValue?: T) => T | undefined;

  /**
   * Set a value in local storage
   * @param key The key to set
   * @param value The value to store
   */
  setItem: <T>(key: string, value: T) => void;

  /**
   * Remove an item from local storage
   * @param key The key to remove
   */
  removeItem: (key: string) => void;

  /**
   * Clear all stored values with an optional prefix
   * @param prefix Optional prefix for keys to clear
   */
  clearItems: (prefix?: string) => void;

  /**
   * Check if a key exists in local storage
   * @param key The key to check
   */
  hasItem: (key: string) => boolean;

  /**
   * Sync local storage to state or vice versa
   * @param initialValues Optional object with key-value pairs to initialize
   */
  syncStorage: (initialValues?: Record<string, any>) => void;
}

/**
 * Hook for interacting with localStorage while handling SSR and serialization
 */
export function useLocalStorage(): UseLocalStorageReturn {
  const [storageAvailable, setStorageAvailable] = useState<boolean>(false);

  // Check if localStorage is available (runs on client side only)
  useEffect(() => {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
    } catch (e) {
      setStorageAvailable(false);
      console.warn("localStorage is not available:", e);
    }
  }, []);

  const getItem = useCallback(
    <T,>(key: string, defaultValue?: T): T | undefined => {
      if (!storageAvailable || typeof window === "undefined") {
        return defaultValue;
      }

      try {
        const item = localStorage.getItem(key);
        if (item === null) {
          return defaultValue;
        }

        return JSON.parse(item);
      } catch (error) {
        console.error(`Error retrieving item ${key} from localStorage:`, error);
        return defaultValue;
      }
    },
    [storageAvailable]
  );

  const setItem = useCallback(
    <T,>(key: string, value: T): void => {
      if (!storageAvailable || typeof window === "undefined") {
        return;
      }

      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Error storing item ${key} in localStorage:`, error);
      }
    },
    [storageAvailable]
  );

  const removeItem = useCallback(
    (key: string): void => {
      if (!storageAvailable || typeof window === "undefined") {
        return;
      }

      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item ${key} from localStorage:`, error);
      }
    },
    [storageAvailable]
  );

  const clearItems = useCallback(
    (prefix?: string): void => {
      if (!storageAvailable || typeof window === "undefined") {
        return;
      }

      try {
        if (prefix) {
          // Only remove items that start with the prefix
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(prefix)) {
              localStorage.removeItem(key);
            }
          });
        } else {
          // Clear all items
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },
    [storageAvailable]
  );

  const hasItem = useCallback(
    (key: string): boolean => {
      if (!storageAvailable || typeof window === "undefined") {
        return false;
      }

      try {
        return localStorage.getItem(key) !== null;
      } catch (error) {
        console.error(`Error checking for item ${key} in localStorage:`, error);
        return false;
      }
    },
    [storageAvailable]
  );

  const syncStorage = useCallback(
    (initialValues?: Record<string, any>): void => {
      if (!storageAvailable || typeof window === "undefined") {
        return;
      }

      try {
        if (initialValues) {
          // Store initial values that don't exist yet
          Object.entries(initialValues).forEach(([key, value]) => {
            if (!localStorage.getItem(key)) {
              setItem(key, value);
            }
          });
        }
      } catch (error) {
        console.error("Error syncing localStorage:", error);
      }
    },
    [storageAvailable, setItem]
  );

  return {
    getItem,
    setItem,
    removeItem,
    clearItems,
    hasItem,
    syncStorage,
  };
}
