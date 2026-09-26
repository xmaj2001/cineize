import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { MOVIE_QUERY_KEYS } from "../cache.keys";
import { movieService } from "../movie.service";

export const useMovies = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(params || {}),
    queryFn: () => movieService.getMovies(params),
  });
};

export const useInfiniteMovies = (params?: Record<string, any>, initialData?: any) => {
  return useInfiniteQuery({
    queryKey: MOVIE_QUERY_KEYS.list({ ...params, infinite: true }),
    queryFn: ({ pageParam }) => movieService.getMovies({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    initialData: initialData ? { pages: [initialData], pageParams: [undefined] } : undefined,
  });
};

export const useHomeFeed = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.home(),
    queryFn: () => movieService.getHomeFeed(),
  });
};

export const useMovie = (id: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.detail(id, params),
    queryFn: () => movieService.getMovieById(id, params),
    enabled: !!id,
  });
};
