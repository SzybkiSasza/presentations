/**
 * CAMEL CASED MAGIC
 */
import camelCase from 'lodash/camelCase';
import {useMemo} from "react";

/**
 * SNAKE_CASE -> camelCase for string types
 */
type InferCamelCase<S> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<InferCamelCase<U>>}`
  : S;

type SnakeCaseToCamelCase<S extends string = string> = InferCamelCase<Lowercase<S>>;

/**
 * Ensure we only process string keys
 * Works as long as called for the interface
 */
type StringOnlyKey<K> = K extends string ? string : never;

type StringOnlyKeyTypes<T> = {
  [K in keyof T]: StringOnlyKey<K>;
}[keyof T];

type KeyOfType<T, KeyType extends string = StringOnlyKeyTypes<T>> = Extract<
  keyof T,
  KeyType
>;

/**
 * Converts SNAKE_CASED interfaces to camelCased ones
 */
type CamelCasedInterface<T extends object> = {
  [K in KeyOfType<T> as SnakeCaseToCamelCase<K>]: T[K];
};

const convertObjToCamelCase = <T extends object>(obj: T): CamelCasedInterface<T> => {
  return Object.keys(obj).reduce((acc, key) => {
    const camelCasedKey = camelCase(key) as InferCamelCase<typeof key>;
    return {
      ...acc,
      [camelCasedKey]: obj[key],
    };
  }, {} as CamelCasedInterface<T>) as CamelCasedInterface<T>;
};

const COL_TYPE_IMPL_FOR_COL_TYPE_ID = {
  date: Date,
  fixed: Number,
  text: String,
  variant: String,
} as const;

/**
 * Possible values of column type id
 */
export type ColTypeId = keyof typeof COL_TYPE_IMPL_FOR_COL_TYPE_ID;

export interface TableDataCol<T extends ColTypeId = ColTypeId> {
  name: string;
  type: T;
  format?: unknown;
}

export type TableData = {
  cols: TableDataCol[];
  rows: string[][];
  totalRows?: number;
};

/**
 * Maps column definitions to their indexes for easier retrieval later
 * Also, checks if there are any leftover columns in either the query or the class
 */
const getColsWithIndexes = <T extends object>(
  cols: TableDataCol[],
  ColDefinitionsCls: new () => T,
): Record<number, TableDataCol> => {
  const clsInstance = new ColDefinitionsCls() as T;
  const colDefinitionChecks = Object.getOwnPropertyNames(clsInstance);

  return cols.reduce((acc, colVal, idx) => {
    if (colDefinitionChecks.findIndex((name) => colVal.name === name) === -1) {
      return acc;
    }
    return {
      ...acc,
      [idx]: colVal,
    };
  }, {});
};

const mapTypeToValue = (val: string, colType: ColTypeId) => {
  switch (colType) {
    case 'date':
      return new Date(val);
    default:
      return val + '';
  }
};

/**
 *
 * Gets available data and returns it in a form of a given interface
 */
const getRow = <T extends object>(
  row: string[],
  colInfo: Record<number, TableDataCol>,
  ColDefinitionsCls: new () => T,
): T => {
  const clsInstance = new ColDefinitionsCls() as T;
  const results = row.reduce((acc, cellVal, idx) => {
    const currentColDefinition = colInfo[idx];
    const existsInColDefinition = clsInstance[currentColDefinition?.name] !== undefined;
    if (existsInColDefinition) {
      const mappedValue = mapTypeToValue(cellVal, currentColDefinition.type);
      return {
        ...acc,
        [currentColDefinition.name]: mappedValue,
      };
    }
    return acc;
  }, {} as T);

  return results as T;
};

/**
 * Returns the data in a shape determined by column-to-field mapping,
 * A simplified version of: src/ui/src/strictNullChecks/shared/functions/tableDataTransformers.ts
 */
const transformData = <T extends object>(
  input: TableData,
  ColDefinitionsCls: new () => T,
): CamelCasedInterface<T>[] => {
  if (input.totalRows === 0) {
    return [];
  }

  const colsWithIndexes = getColsWithIndexes(input.cols, ColDefinitionsCls);
  return input.rows.map((row) => {
    const snakeCasedRowData = getRow<T>(row, colsWithIndexes, ColDefinitionsCls);
    return convertObjToCamelCase(snakeCasedRowData);
  });
};

interface SQLQueryHookResult<T> {
  result: T;
  query: string;
  onRefresh: () => void;
}

/**
 * QUERY BASICS
 */
const QUERY = `\
SELECT 
  listing_global_name AS listing_name,
  listing_display_name,
FROM 
  snowflake.data_sharing_usage.listing_events_daily`;

class ListingNamesSQL {
  EVENT_DATE = '';
  LISTING_DISPLAY_NAME = '';
}

type ListingNames = CamelCasedInterface<ListingNamesSQL>;

interface UseListingNamesArgs {
  consumerOrganization?: string;
}

const processQuery = (query: string): TableData => {
  console.log('PROCESSING QUERY: ', query);
  return {
    cols: [
      {
        name: 'EVENT_DATE',
        type: 'date',
      },
      {
        name: 'LISTING_GLOBAL_NAME',
        type: 'text',
      },
      {
        name: 'LISTING_DISPLAY_NAME',
        type: 'text',
      },
      {
        name: 'TOTAL',
        type: 'fixed',
      },
    ],
    rows: [
      ['2024-02-28', 'GZNZ2VVL4WC', 'test app access expires', '10000'],
      ['2024-03-13', 'GZNZ2VVL33O', 'ghenry-paid-listing-1', '20152'],
      ['2024-03-13', 'GZNZ2VVL2GE', '[PI] DSU Tests Data Paid Usage 2', '5013'],
    ],
    totalRows: 3,
  }
};

export const useListingNames = ({
                                  consumerOrganization,
                                }: UseListingNamesArgs): SQLQueryHookResult<ListingNames[]> => {
  const sqlQuery = useMemo(() => {
    let query = '' + QUERY;
    if (consumerOrganization) {
      query += (`\nWHERE CONSUMER_ORGANIZATION = ${consumerOrganization}`);
    }
    return query;
  }, [consumerOrganization]);

  const sqlResult = processQuery(sqlQuery);
  const result = transformData(sqlResult, ListingNamesSQL);

  return useMemo(
    () => ({
      result,
      query: sqlQuery,
      onRefresh: () => {
      },
    }),
    [result, sqlQuery],
  );
};
