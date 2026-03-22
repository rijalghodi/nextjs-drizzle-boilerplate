import { Query, QueryKey } from "@tanstack/react-query";

export const buildQueryKey = <TData extends Record<string, any>>(
  key: string,
  data?: TData
): QueryKey => {
  // convert data to array
  const dataArr = data ? Object.entries(data).map(([key, value]) => `${key}:${value}`) : [];
  return [key, ...dataArr];
};

type Predicate<TData extends Record<string, any>> = {
  key: string;
  data?: TData;
};

export const buildQueryKeyPredicate = <TData extends Record<string, any>>(
  predicates: Predicate<TData>[]
): ((query: Query) => boolean) => {
  return (query: Query) =>
    predicates.some((predicate) => {
      if (!query.queryKey.includes(predicate.key)) return false;
      if (!predicate.data) return true;
      return Object.entries(predicate.data).every(([key, value]) =>
        query.queryKey.includes(`${key}:${value}`)
      );
    });
};
