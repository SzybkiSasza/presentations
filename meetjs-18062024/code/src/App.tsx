import './App.css';

import {getAction, useUIStore} from "./examples/uiStore.ts";
import {useListingNames} from "./examples/query.ts";
import {useFilters} from "./examples/filters.tsx";

function App() {
  const filters = useFilters({
    filterId: 'TEST_1', filterHookArgs: { input1: 'test'}
  });
  const updateFilter = () => filters.onChange({ a: 'test'});
  console.log(filters);

  const result = useListingNames({consumerOrganization: 'TEST'});
  console.log(result);

  const store = useUIStore();
  const dispatch = () => store.dispatch(getAction( {propB: 'TEST_2'}, 'SET_B'));

  console.log(result);
  console.log(result.result.map(elt => elt.listingDisplayName));
  console.log(store.state);

  return (
    <>
      <h1>TypeScript experiments</h1>
      <div>Check the console and browse the "examples" in your IDE to experiment with the types</div>
      <br/>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={dispatch} style={{marginRight: '12px'}}>DISPATCH</button>
        <button onClick={updateFilter}>UPDATE FILTER</button>
      </div>
    </>
  )
}

export default App
