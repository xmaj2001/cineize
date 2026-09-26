export const MOVIE_QUERY_KEYS = {
  all: ["movies"] as const,
  lists: () => [...MOVIE_QUERY_KEYS.all, "list"] as const,
  list: (params: Record<string, any>) =>
    [...MOVIE_QUERY_KEYS.lists(), params] as const,
  home: () => [...MOVIE_QUERY_KEYS.all, "home"] as const,
  details: () => [...MOVIE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string, params?: Record<string, any>) =>
    [...MOVIE_QUERY_KEYS.details(), id, params] as const,
};
