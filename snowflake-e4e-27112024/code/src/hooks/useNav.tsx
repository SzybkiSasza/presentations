import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const useNav = () => {
  const [searchParams, updateSearchParams] = useSearchParams();
  const parsedParams = useMemo(
    () => Object.fromEntries(searchParams),
    [searchParams]
  );

  return {
    params: parsedParams,
    update: updateSearchParams,
  };
};
