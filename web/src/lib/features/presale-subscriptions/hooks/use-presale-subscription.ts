import { useMutation } from "@tanstack/react-query";
import { presaleSubscriptionService } from "../presale-subscriptions.service";
import { CreatePresaleSubscriptionDto } from "../types";

export function useCreatePresaleSubscription() {
  return useMutation({
    mutationFn: (data: CreatePresaleSubscriptionDto) => {
      return presaleSubscriptionService.createSubscription(data);
    },
  });
}
