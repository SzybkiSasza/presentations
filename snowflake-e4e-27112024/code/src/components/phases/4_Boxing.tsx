import { useCallback } from "react";
import { useSearchParamsFullUpdate } from "../../hooks/useSearchParamsFullUpdate";

export const Boxing = () => {
  const { params, update } = useSearchParamsFullUpdate({
    searchParamKey: "TEST",
  });

  const updateParams = useCallback(() => {
    update([
      {
        c: "DF%JG&",
        d: "ABC",
      },
      {
        e: "DEF",
      },
    ]);
  }, [update]);

  return (
    <div>
      <h2>More complex stuff in the 📦</h2>
      <div>Current params: {JSON.stringify(params, null, 4)}</div>
      <br />
      <button onClick={updateParams}>Update!</button>
    </div>
  );
};
