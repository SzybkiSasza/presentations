import { useCallback } from "react";
import { URLSearchParamsInit } from "react-router-dom";
import {
  DEFAULT_DESERIALIZER,
  DEFAULT_SERIALIZER,
} from "../constants/serialization";
import { useNav } from "./useNav";

export const useSearchParamsBasic = () => {
  const { params, update } = useNav();

  const deserializedParams = DEFAULT_DESERIALIZER(params);
  const updateParams = useCallback(
    (params: object) => {
      const updated = DEFAULT_SERIALIZER(params);
      update(updated as URLSearchParamsInit);
    },
    [update]
  );

  return {
    params: deserializedParams,
    update: updateParams,
  };
};
