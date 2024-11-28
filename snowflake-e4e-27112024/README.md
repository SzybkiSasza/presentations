# Snowflake Engineers 4 Engineers (27/11/2024) - **Boxing and unboxing objects into query params**

This presentation shows how search params/query params may be used for state management, with added benefits:

- Given URL synchronization
- Persisting between reloads
- Easy sharing of the state
- No additional libraries needed

## The code

The code consists of Vite application that uses React Router DOM and just a few other dependencies to show the concept in action.

The main `App.tsx` component exposes 6 "phases" of implementing the search params sync. Check out each of them to see how the concept evolves.

### TL; DR;

Just jump to [6_BoxPlayground.tsx](./code/src/components/phases/6_BoxPlayground.tsx) to see the final implementation.

### Running the test app

You can run the test app and experiment with the example files in the `./code/src/App.tsx` file by running
from the `code` directory (`pnpm` suggested, but may use your preferred package manager):

```bash
pnpm i

pnpm dev
```

### Resources

[Presentation](./presentation.pdf)
[Sources](./code)