export type AllowedSearchParamsEntityTypes = string | Record<string, string>;

export interface SearchParamsDataTransformer<T> {
  serializer: (val: T) => Record<string, string> | string;
  deserializer: (val: Record<string, string> | string) => T | null;
}

export interface UseUpdateSearchParamsArgs<
  T
> {
  dataTransformer?: SearchParamsDataTransformer<T>;
  searchParamKey: string;
}

export interface UseSearchParamsResult<T> {
  update: (values: T[], replaceLastEntry?: boolean) => void;
  value: T[] | null;
}
