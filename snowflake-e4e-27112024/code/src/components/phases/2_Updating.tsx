import { useCallback } from "react";
import { useNav } from "../../hooks/useNav";

export const Updating = () => {
  const { params, update } = useNav();

  const updateParams = useCallback(() => {
    update({
      c: "d",
    });
  }, [update]);

  return (
    <div>
      <h2>Updating</h2>
      <div>Current params: {JSON.stringify(params, null, 4)}</div>
      <br />
      <button onClick={updateParams}>Update!</button>
    </div>
  );
};
