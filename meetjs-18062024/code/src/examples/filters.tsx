import {useMemo} from "react";

/**
 * GENERIC TYPES
 */
interface SQLQueryHookResult<T> {
  result: T;
  query: string;
  onRefresh: () => void;
}

interface FilterDefinition<T = object, U = unknown> {
  type: 'global' | 'local';
  defaultValue: T;
  useValues: (args: U) => SQLQueryHookResult<T[]>;
}

// Type guards - allow for getting information about generics from the FilterDefinition in any place
type FilterDefinitionValueType<S extends FilterDefinition<unknown, unknown>> =
  S extends FilterDefinition<infer T, unknown> ? T : never;
type FilterDefinitionHookArgType<S extends FilterDefinition<unknown, unknown>> =
  S extends FilterDefinition<unknown, infer T> ? T : never;

/**
 * IMPLEMENTATION
 */
interface FilterDefinitions {
  TEST_1: FilterDefinition<{ a: string }, { input1: string; }>;
  TEST_2: FilterDefinition<{ c: number }, { input2: number; }>;
}

const filterDefinitions: FilterDefinitions = {
  TEST_1: {
    type: 'local',
    defaultValue: {a: 'b'},
    useValues: ({input1}) => ({
      result: [{a: input1}], query: '', onRefresh: () => {
      }
    })
  },
  TEST_2: {
    type: 'global',
    defaultValue: {c: 1},
    useValues: ({input2}) => ({
      result: [{c: input2}], query: '', onRefresh: () => {
      }
    })
  }
};

/**
 * TYPES GENERATED FROM THE DEFINITIONS
 */
type FilterKeys = keyof FilterDefinitions;
type FilterTypes = {
  [K in FilterKeys]: FilterDefinitionValueType<FilterDefinitions[K]>;
};
type FilterHookArgTypes = {
  [K in FilterKeys]: FilterDefinitionHookArgType<FilterDefinitions[K]>;
};

const getFilterDefinition = <T extends FilterKeys = FilterKeys>(filterId: T) => {
  const filter = filterDefinitions[filterId];
  if (!filter) {
    throw new Error(`No such filter: ${filterId}, check if the filter ID is correct!`);
  }

  return filter as FilterDefinition<FilterTypes[T], FilterHookArgTypes[T]>;
};


/**
 * HOOK
 */
interface UseFiltersArgs<T extends FilterKeys = FilterKeys> {
  filterId: T;
  filterHookArgs?: FilterHookArgTypes[T];
}

interface UseFiltersResult<T> {
  onChange: (newValue: T) => void;
  currentValue: T;
  values: T[];
}

export const useFilters = <T extends FilterKeys = FilterKeys>({
  filterId,
  filterHookArgs,
}: UseFiltersArgs<T>): UseFiltersResult<FilterTypes[T]> => {
  type ReturnedType = FilterTypes[typeof filterId];

  const def = getFilterDefinition(filterId);
  console.log(def);

  const hookResult: SQLQueryHookResult<ReturnedType[]> = def.useValues(filterHookArgs);

  return useMemo(() => ({
    onChange: () => {},
    currentValue: hookResult.result[0],
    values: hookResult.result,
  }), [hookResult]);
};