import { useQuery, QueryKey } from "@tanstack/react-query";
import { useState } from "react";

export default function useDebouncedQuery<T>(
  body: string,
  queryKey: QueryKey,
  queryFn: (body: string) => Promise<T>,
  delay: number = 500
) {
  const [debouncedBody, setDebouncedBody]: [
    string,
    (debouncedValue: string) => void
  ] = useState<string>(body);

  if (debouncedBody !== body) {
    const timeOutId = setTimeout(() => setDebouncedBody(body), delay);
    () => clearTimeout(timeOutId);
  }

  return useQuery<T>({
    queryKey: [...queryKey, debouncedBody],
    queryFn: () => queryFn(debouncedBody),
  });
}
