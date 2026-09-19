export const SESSION_QUERY_KEYS = {
  all: ["sessions"] as const,
  detail: (id: string) => ["sessions", id] as const,
};
