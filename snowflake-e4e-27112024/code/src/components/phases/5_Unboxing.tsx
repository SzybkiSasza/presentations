import { useCallback } from "react";
import { useSearchParamsFullGet } from "../../hooks/useSearchParamsFullGet";

export const Unboxing = () => {
  const { params, update } = useSearchParamsFullGet({
    searchParamKey: "TEST_KEY",
  });

  const updateParams = useCallback(() => {
    update([
      {
        c: "DF%JG&",
        d: "e",
      },
      {
        f: "g",
      },
    ]);
  }, [update]);

  return (
    <div>
      <h2>Get stuff from the 📦</h2>
      <div>Current params: {JSON.stringify(params, null, 4)}</div>
      <br/>
      <button onClick={updateParams}>Update with serialization!</button>
    </div>
  );
};
