import { useCallback, useMemo } from "react";
import {
  DEFAULT_SERIALIZER,
  DEFAULT_DESERIALIZER,
} from "../constants/serialization";
import { buildParamsForUpdate } from "../utils/buildParamsForUpdate";
import { useNav } from "./useNav";
import { deserializeData } from "../utils/deserializeData";

export interface UseUpdateSearchParamsArgs {
  searchParamKey: string;
}

export const useSearchParamsFullGet = <T,>({
  searchParamKey,
}: UseUpdateSearchParamsArgs) => {
  const { params, update } = useNav();

  const deserialize = useCallback(
    (currentQueryData: Record<string, string>) =>
      deserializeData(searchParamKey, currentQueryData, DEFAULT_DESERIALIZER),
    [searchParamKey]
  );
  const value = useMemo(() => deserialize(params), [deserialize, params]);

  const updateParams = useCallback(
    (values: T[]) => {
      const paramsForUpdate = buildParamsForUpdate({
        queryData: params,
        searchParamKey,
        serializer: DEFAULT_SERIALIZER,
        values,
      });
      update(paramsForUpdate);
    },
    [params, searchParamKey, update]
  );

  return {
    params: value,
    update: updateParams,
  };
};
