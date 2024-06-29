import { useQuery, QueryKey } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type providerFnArgs = {
  fields?: string[];
  limit?: number;
  search?: string;
  filters?: string[];
};

export default function useDebouncedQuery<T>(
  args: providerFnArgs,
  queryKey: QueryKey,
  providerFn: ({
    fields,
    limit,
    search,
    filters,
  }: providerFnArgs) => Promise<T>,
  delay: number = 500
) {
  const { fields, limit, search, filters } = args;
  const [debouncedText, setDebouncedText]: [
    string,
    (debouncedValue: string) => void
  ] = useState<string>(search || "");

  useEffect(() => {
    const timeOutId = setTimeout(() => setDebouncedText(search || ""), delay);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search, delay]);

  return useQuery<T>({
    queryKey: [...queryKey, debouncedText],
    queryFn: () =>
      providerFn({ fields, limit, search: debouncedText, filters }),
    enabled: !!debouncedText,
  });
}
