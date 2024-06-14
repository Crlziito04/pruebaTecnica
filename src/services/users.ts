const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  await delay(1000);
  return await fetch(
    `https://randomuser.me/api?results=10&seed=crlz&page=${pageParam}`
  )
    .then(async (res) => {
      if (!res.ok) throw new Error("Error en peticion");
      return await res.json();
    })
    .then((res) => {
      const currentPage = Number(res.info.page);
      const nextCursor = currentPage > 10 ? undefined : currentPage + 1;
      return {
        users: res.results,
        nextCursor,
      };
    });
};
