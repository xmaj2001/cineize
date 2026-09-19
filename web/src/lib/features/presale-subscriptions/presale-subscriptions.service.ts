import { apiFetch } from "@/lib/api/client";
import { CreatePresaleSubscriptionDto, PresaleSubscription } from "./types";

export const presaleSubscriptionService = {
  createSubscription: async (
    data: CreatePresaleSubscriptionDto,
  ): Promise<{ data: PresaleSubscription }> => {
    try {
      return await apiFetch(`presale-subscriptions/${data.movieId}`, {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
        }),
      });
    } catch (error) {
      return {
        data: null as any,
      };
    }
  },
};
