import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const SearchParams = () => {
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  return (
    <div>
      <h2>Search params:</h2>
      {JSON.stringify(Object.fromEntries(searchParams), null, 4)}
    </div>
  );
};
