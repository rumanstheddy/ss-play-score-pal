import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue]: [
    string,
    (debouncedValue: string) => void
  ] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
