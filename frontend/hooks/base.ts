import { useQuery } from "@tanstack/react-query";

export const useQueryBase = (key: string[], queryFn: () => Promise<any>) => {
    return useQuery({
      queryKey: key,
      queryFn,
    });
  };