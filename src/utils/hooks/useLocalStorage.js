import { useEffect, useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading local storage\n", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (storedValue !== null) {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error seting local storage key\n", error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue];
};
