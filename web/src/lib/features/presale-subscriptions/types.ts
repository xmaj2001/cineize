export interface CreatePresaleSubscriptionDto {
  movieId: string;
  email?: string;
  whatsapp?: string;
}

export interface PresaleSubscription {
  id: string;
  movieId: string;
  email: string | null;
  whatsapp: string | null;
  notifiedAt: string | null;
  createdAt: string;
}
