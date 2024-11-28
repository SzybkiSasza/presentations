import {
  SearchParamsDataTransformer,
} from "../types";
import isEmpty from "lodash-es/isEmpty";

import { SEARCH_PARAM_PARTS_SEPARATOR } from "../constants/serialization";

/**
 * Prepares a deserializer that is able to deconstruct search params into meaningful data
 */
export const deserializeData = <T>(
  searchParamKey: string,
  searchParams: Record<string, string> | null,
  deserializer: SearchParamsDataTransformer<T>["deserializer"]
) => {
  const keyPrefix = `${searchParamKey}${SEARCH_PARAM_PARTS_SEPARATOR}`;
  const searchParamNamesRelatedToKey = Object.keys(searchParams ?? {}).filter(
    (key) => key === searchParamKey || key.startsWith(keyPrefix)
  );

  if (!searchParams || searchParamNamesRelatedToKey.length === 0) {
    return null;
  }

  // Case 1 - a plain value - just a string/serialized object
  if (searchParams[searchParamKey] !== undefined) {
    const oneKeyValueDeserialized = deserializer(
      searchParams[searchParamKey] ?? ""
    );
    return [oneKeyValueDeserialized];
  }

  // If one-key deserialization fails, fallback to array/object deserializer
  const orderedData: Record<string, string>[] | string[] = [];
  searchParamNamesRelatedToKey.forEach((fullQueryParamKey) => {
    const strippedPrefix = fullQueryParamKey.replace(keyPrefix, "");
    const searchParamsParts = strippedPrefix.split(
      SEARCH_PARAM_PARTS_SEPARATOR
    );

    const [keyOrIndex, ...objectKeyParts] = searchParamsParts;
    const index = parseInt(keyOrIndex, 10);
    const value = searchParams[fullQueryParamKey];

    if (isNaN(index)) {
      // Case 2 - a single object
      orderedData[0] = {
        ...(orderedData[0] as Record<string, string>),
        [strippedPrefix]: value,
      };
    } else {
      if (objectKeyParts.length) {
        // Case 4 - an array of objects
        orderedData[index] = {
          ...(orderedData[index] as Record<string, string>),
          [objectKeyParts.join(SEARCH_PARAM_PARTS_SEPARATOR)]: value,
        };
      } else {
        // Case 3 - an array of strings
        orderedData[index] = value;
      }
    }
  });

  const final: T[] = [];
  orderedData.forEach((entry: Record<string, string> | string) => {
    const deserialized = deserializer(entry);
    if (deserialized && !isEmpty(deserialized)) {
      final.push(deserialized);
    }
  });

  return final;
};
