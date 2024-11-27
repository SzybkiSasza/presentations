# MeetJS Warsaw (18/06/2024) - **Delving deeper into TypeScript**

This presentation shows a few tricks regarding complex TypeScript operations, including:

- Meta-programming
- Type inference
- Generics
- Intersections and unions

## Examples

There are three groups of examples that you can find in the repo. Each of them touches a different subject. 

Check each of them on your own, experiment with the types, try editing them and see the outcome.

All of them are **purely demonstrational**, there is no browser/React code that consumes them now - 
the best way to see how they work is to **open them in your preferred IDE** and configure TypeScript to show you the inferred types.

### Running the test app

You can run the test app and experiment with the example files in the `./code/src/App.tsx` file by running
from the `code` directory (`pnpm` suggested, but may use your preferred package manager):

```bash
pnpm i

pnpm start
```

### Filters

This example shows dynamic type inference, based on the definition block for multiple filters.

- Try changing the filter ID and see how the type system reacts
- Try breaking the type system (passing incorrect properties, not passing required keys etc)

### Queries

This example converts SNAKE_CASED type to a `camelCased` one, using type inference and the ability to
map types based on their shape. It's similar to what the `CamelCase` utility does in [TypeFest](https://github.com/sindresorhus/type-fest).

We used a similar approach to convert SQL fields to a camelCased JS object, alongwith preserving types and making sure
 the types are correct in runtime.


- Try breaking the naming
- Try editing the class shape and match the SQL query fields to it
- Try returning incorrect set of fields and see what happens

### Store

This file shows a simple Flux-based (more on Flux pattern [here](https://facebookarchive.github.io/flux/docs/in-depth-overview/))
UI store that allows for a simple state management in a React application. 

It composes a few store slices and allows for dispatching strongly-typed actions.

It, however, has a few type issues that are deliberately added to the code 😉

- Try experimenting with action types
- Try breaking the action specification (e.g. adding incorrect properties)
- Try dispatching different payloads
- Try changing the store shape - add new property, remove one, change the type of a property

### Resources

[Presentation](./presentation.pdf)
[Sources](./code)