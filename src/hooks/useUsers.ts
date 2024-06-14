import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/users";
import { User } from "../types";

export const useUsers = () => {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery<{
      nextCursor?: number;
      users: User[];
    }>(
      ["users"], //Key de informacion o query
      fetchUsers,
      {
        staleTime: 1000 * 500,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return {
    isError,
    isLoading,
    users: data?.pages?.flatMap((p) => p.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage,
  };
};
