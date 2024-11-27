import {useCallback, useMemo, useState} from "react";
import isEqual from "lodash-es/isEqual";

/**
 * TYPES
 */
type Action<P extends object = object, T extends string = string> = {
  payload: P;
  type: T;
};
type AnyAction = Action;

type Reducer<S = object, A extends Action = AnyAction> = (state: S, action: A) => S;

interface SliceDefinition<SliceShape = object, Actions = AnyAction> {
  initialState: SliceShape;
  reducer: (state: SliceShape, action: Actions) => SliceShape;
}

// Type guards - allow for knowing about slice type generics when interacting with slice
type SliceStateType<S extends SliceDefinition<unknown, AnyAction>> =
  S extends SliceDefinition<infer T, AnyAction> ? T : never;
type SliceActionType<S extends SliceDefinition<object, AnyAction>> =
  S extends SliceDefinition<object, infer T> ? T : never;

export const getAction = <P extends object, T extends string>(
  payload: P,
  type: T,
): Action<P, T> => ({
  payload,
  type,
});

/**
 * SLICES
 */
type ActionsA = Action<
  { todo: string },
  'SET_TODO'
>;
const aSlice: SliceDefinition<{ todo: string }, ActionsA> = {
  initialState: {todo: 'TODO'},
  reducer: (state, action) => ({...state, todo: action.payload.todo})
};

type ActionsB = Action<{ propA: number }, 'SET_A'> | Action<{ propB: string }, 'SET_B'>;
const bSlice: SliceDefinition<{ propA: number, propB: string }, ActionsB> = {
  initialState: {propA: 0, propB: ''},
  reducer: (state, action) => action.type === 'SET_A' ?
    ({...state, propA: action.payload.propA}) :
    ({...state, propB: action.payload.propB})
}

// Modify this object to add new slices of the UI state
const slices = {
  a: aSlice,
  b: bSlice
};

// Modify this type to add new action types
type Actions = ActionsA | ActionsB;

type SliceKeys = keyof typeof slices;
type Reducers = {
  [K in SliceKeys]: Reducer<
    SliceStateType<(typeof slices)[K]>,
    SliceActionType<(typeof slices)[K]>
  >;
};

const reducers: Reducers = Object.keys(slices).reduce((acc: Reducers, key: SliceKeys) => {
  return {
    ...acc,
    [key]: slices[key].reducer,
  };
}, {} as Reducers);

type StoreState = { [K in SliceKeys]: SliceStateType<(typeof slices)[K]> };
const initialState: StoreState = Object.keys(slices).reduce(
  (acc: StoreState, slice: SliceKeys) => {
    return {
      ...acc,
      [slice as SliceKeys]: slices[slice].initialState,
    };
  },
  {} as StoreState,
);

const combinedReducer = (state: StoreState, action: Actions): StoreState => {
  return Object.keys(reducers).reduce((acc, key) => {
    return {
      ...acc,
      [key]: reducers[key](state[key], action),
    } as StoreState;
  }, state);
};

/**
 * AND NOW - THE MAGIC!
 */

// Type guard for actions from store - thanks to it, all the store interactions are properly case
// (e.g. one cannot use payload from one action in another action)
// These types are built from the store definitions and change with them (e.g. when a new slice is added)
type InferActionType<A> = A extends Actions
  ? A extends Action<infer P, infer T>
    ? Action<P, T>
    : never
  : never;

type Dispatch = <T extends Actions>(action: InferActionType<T>) => void;

const hookSharedState = {
  store: initialState,
};

interface UseUIStoreResult {
  dispatch: Dispatch;
  state: StoreState;
}

/**
 * Allows for synchronous access to the UI store defined at ../store
 * Modify ../store/pocStore.ts to add new store slices
 */
export const useUIStore = (): UseUIStoreResult => {
  const [state, setState] = useState<StoreState>(initialState);

  const dispatch: Dispatch = useCallback(
    (action: Actions) => {
      const finalState = combinedReducer(hookSharedState.store, action);
      if (!isEqual(finalState, state)) {
        setState(finalState);
      }
    },
    [state, setState],
  );

  return useMemo(() => ({
    dispatch,
    state,
  }), [dispatch, state]);
};
