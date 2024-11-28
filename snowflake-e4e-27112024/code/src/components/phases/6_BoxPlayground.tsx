import { useCallback, useMemo, useState } from "react";
import { generate } from "randomstring";
import { useSearchParamsFull } from "../../hooks/useSearchParamsFull";
import { SearchParamsDataTransformer } from "../../types";
import { randomPositive } from "../../utils/random";

interface Box {
  content: string;
  amount: number;
}

export const BoxPlayground = () => {
  const [prefix, setPrefix] = useState("123");

  const serializer = useCallback<
    SearchParamsDataTransformer<Box>["serializer"]
  >(
    (val) => {
      return {
        [`${prefix}_amount`]: val.amount + "",
        [`${prefix}_content`]: val.content,
      };
    },
    [prefix]
  );
  const deserializer = useCallback<
    SearchParamsDataTransformer<Box>["deserializer"]
  >(
    (val) => {
      if (typeof val !== "string") {
        return {
          content: val[`${prefix}_content`],
          amount: Number(val[`${prefix}_amount`]),
        };
      }
      return null;
    },
    [prefix]
  );

  const searchParamsDataTransformer = useMemo<SearchParamsDataTransformer<Box>>(
    () => ({
      serializer,
      deserializer,
    }),
    [deserializer, serializer]
  );

  const { params, update } = useSearchParamsFull<Box>({
    searchParamKey: "TEST_KEY",
    dataTransformer: searchParamsDataTransformer,
  });

  const updateParams = useCallback(() => {
    update([
      {
        amount: randomPositive(),
        content: "Apples",
      },
      {
        amount: randomPositive(),
        content: "Oranges",
      },
    ]);
  }, [update]);

  const updatePrefix = useCallback(() => {
    setPrefix(generate(4));
  }, [setPrefix]);

  return (
    <div>
      <h2>Final 📦 🛝</h2>
      <div>Current params: {JSON.stringify(params, null, 4)}</div>
      <br />
      <button onClick={updateParams}>Update with serialization!</button>
      <br />
      <br />
      <button onClick={updatePrefix}>Update prefix!</button>
    </div>
  );
};
