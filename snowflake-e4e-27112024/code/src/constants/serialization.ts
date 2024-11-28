export const SEARCH_PARAM_PARTS_SEPARATOR = "_";

/**
 * The functions below are not necessarily needed here - they were useful in React Router DOM <6,
 * due to the fact that the `useSearchParams` hook was not available in that version.
 *
 * In the version used in the examples, it's React Router DOM that actually encodes/decodes the values in the same way
 * as the code below.
 *
 * They are important from the interface perspective, as they show how the values can be serialized/deserialized in a custom way.
 */
export const DEFAULT_SERIALIZER = <T>(
  val: T
): Record<string, string> | string => {
  if (typeof val === "string") {
    return encodeURIComponent(val);
  }

  try {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(val)) {
      params.set(key, value);
    }
    return Object.fromEntries(params);
  } catch (err: unknown) {
    console.warn(`Could not serialize the value for search params: ${err}`);
    throw err;
  }
};

export const DEFAULT_DESERIALIZER = <T>(
  paramOrParamsObj: Record<string, string> | string
): T | null => {
  if (typeof paramOrParamsObj === "string") {
    // This needs to be here, as otherwise we will get "react/display-name" ESLint error (!)
    // (ESLint will think it's a component)
    const ret =
      paramOrParamsObj !== ""
        ? (decodeURIComponent(paramOrParamsObj) as unknown as T)
        : null;
    return ret;
  }

  const partial: Record<string, string> = {};
  for (const [key, value] of Object.entries(paramOrParamsObj)) {
    try {
      partial[key] = decodeURIComponent(value);
    } catch (err) {
      partial[key] = value;
    }
  }

  return partial as T;
};
