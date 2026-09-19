import { useQuery } from "@tanstack/react-query";
import { locationService } from "../location.service";

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await locationService.getLocations();
      return response.data;
    },
  });
}
