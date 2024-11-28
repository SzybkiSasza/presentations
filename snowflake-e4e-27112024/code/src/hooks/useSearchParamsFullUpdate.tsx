import { useCallback } from "react";
import {
  DEFAULT_SERIALIZER,
  DEFAULT_DESERIALIZER,
} from "../constants/serialization";
import { buildParamsForUpdate } from "../utils/buildParamsForUpdate";
import { useNav } from "./useNav";

export interface UseUpdateSearchParamsArgs {
  searchParamKey: string;
}

export const useSearchParamsFullUpdate = <T,>({
  searchParamKey,
}: UseUpdateSearchParamsArgs) => {
  const { params, update } = useNav();

  const deserializedParams = DEFAULT_DESERIALIZER(params);

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
    [params, searchParamKey]
  );

  return {
    params: deserializedParams,
    update: updateParams,
  };
};
