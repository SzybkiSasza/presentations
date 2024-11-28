import { useCallback } from "react";
import { useSearchParamsBasic } from "../../hooks/useSearchParamsBasic";

export const Deserializer = () => {
  const { params, update } = useSearchParamsBasic();

  const updateParams = useCallback(() => {
    update({
      c: "DF%JG&",
    });
  }, [update]);

  return (
    <div>
      <h2>Putting simple stuff in the 📦</h2>
      <div>Current params: {JSON.stringify(params, null, 4)}</div>
      <br />
      <button onClick={updateParams}>Update!</button>
    </div>
  );
};
