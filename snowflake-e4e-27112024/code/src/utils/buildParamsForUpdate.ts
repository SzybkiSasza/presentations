import {
  SearchParamsDataTransformer,
} from "../types";

import { SEARCH_PARAM_PARTS_SEPARATOR } from "../constants/serialization";

const prefixObjectKeys = (
  obj: Record<string, string>,
  prefixKey: string
): object =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [`${prefixKey}${SEARCH_PARAM_PARTS_SEPARATOR}${key}`]: obj[key],
    }),
    {}
  );

/**
 * Prepares search params payload that are encoded and may be used to update the browser bar
 *
 * Note that we use `queryData` is coming from `useHistory()` hook within `useNav()` here,
 * which means that it is tied to React rendering cycle - it won't work if components are updating the search params
 * in parallel (for that you might replace it with `getQueryDataFromSearch(controllerHistory.location.search)`
 * which is not tied to React rendering cycle).
 *
 * This is, however, highly discouraged - ALWAYS try to build your code so that it follows React principles!
 */
export const buildParamsForUpdate = <T>({
  queryData,
  searchParamKey,
  serializer,
  values,
}: {
  queryData: Record<string, string>;
  searchParamKey: string;
  serializer: SearchParamsDataTransformer<T>["serializer"];
  values: T[];
}) => {
  let params = { ...queryData };

  // Clear the params, if there are any array left-overs
  Object.entries(params).forEach(([key]) => {
    if (key.startsWith(searchParamKey)) {
      delete params[key];
    }
  });

  if (values.length === 1) {
    const serialized = serializer(values[0]);

    if (typeof serialized === "string") {
      // Case 1 - a plain value
      params[searchParamKey] = serialized;
    } else {
      // Case 2 - a single object
      params = {
        ...params,
        ...prefixObjectKeys(serialized, searchParamKey),
      };
    }
  } else {
    values.forEach((value, i) => {
      const serialized = serializer(value);
      const arrayPrefix = `${searchParamKey}${SEARCH_PARAM_PARTS_SEPARATOR}${i}`;
      if (typeof serialized === "string") {
        // Case 3 - an array of strings
        params[arrayPrefix] = serialized;
      } else {
        // Case 4 - an array of objects
        params = {
          ...params,
          ...prefixObjectKeys(serialized, arrayPrefix),
        };
      }
    });
  }

  // Clean up unused params
  Object.entries(params).forEach(([key, paramVal]) => {
    if (!paramVal) {
      delete params[key];
    }
  });

  return params;
};
