import { useCallback, useMemo } from "react";
import {
  DEFAULT_SERIALIZER,
  DEFAULT_DESERIALIZER,
} from "../constants/serialization";
import { buildParamsForUpdate } from "../utils/buildParamsForUpdate";
import { useNav } from "./useNav";
import { deserializeData } from "../utils/deserializeData";
import {UseUpdateSearchParamsArgs} from "../types.ts";

export interface UseSearchParamsResult<T> {
  update: (values: T[]) => void;
  params: T[] | null;
}

export const useSearchParamsFull = <T,>({
  dataTransformer,
  searchParamKey,
}: UseUpdateSearchParamsArgs<T>) => {
  const { params, update } = useNav();

  const deserializer = dataTransformer?.deserializer ?? DEFAULT_DESERIALIZER;
  const deserialize = useCallback(
    (currentQueryData: Record<string, string>) =>
      deserializeData(searchParamKey, currentQueryData, deserializer),
    [deserializer, searchParamKey]
  );

  const serializer = dataTransformer?.serializer ?? DEFAULT_SERIALIZER;
  const updateParams = useCallback(
    (values: T[]) => {
      const updatedParams = buildParamsForUpdate<T>({
        queryData: params,
        searchParamKey,
        serializer,
        values,
      });

      // Search params are always updated in the proper Analytics IA context - hence `isNewIa` here
      update(updatedParams);
    },
    [params, searchParamKey, serializer, update]
  );

  const value = useMemo(() => deserialize(params), [deserialize, params]);

  return {
    update: updateParams,
    params: value,
  } as UseSearchParamsResult<T>;
};
