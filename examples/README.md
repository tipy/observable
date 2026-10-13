# @tipy/observable Examples

This directory contains practical examples demonstrating how to use `@tipy/observable` with different frameworks.

## Available Examples

### 🔷 [React + TypeScript + Vite](./reactjs)

A complete React example using:
- React 18 with hooks
- TypeScript for type safety
- Vite for fast development
- CSS Modules for styling
- Custom `useObservable` hook

**[→ View React Example](./reactjs/README.md)**

### 🟢 [Vue 3 + TypeScript + Vite](./vuejs)

A complete Vue example using:
- Vue 3 with Composition API
- TypeScript for type safety
- Vite for fast development
- CSS Modules (`<style module>`)
- Custom `useObservable` composable

**[→ View Vue Example](./vuejs/README.md)**

## What These Examples Demonstrate

All examples showcase the same counter application with:

1. **Shared State Management**
   - Single Observable store managing counter state
   - Multiple components subscribing to the same store
   - Automatic synchronization across all subscribers

2. **Component Architecture**
   - Two display components showing the same counter
   - One controls component with increase/decrease buttons
   - Demonstrates how multiple components share state without prop drilling

3. **Best Practices**
   - TypeScript integration for type safety
   - Custom hooks/composables for clean abstraction
   - Proper subscription lifecycle management
   - CSS Modules for scoped styling

4. **Framework-Agnostic Design**
   - Same store logic works across frameworks
   - Minimal framework-specific code (just the hook/composable)
   - Easy to understand and port to other frameworks

## Quick Start

Choose your framework and follow the instructions:

```bash
# For React
cd reactjs
pnpm install
pnpm dev

# For Vue
cd vuejs
pnpm install
pnpm dev
```

## Comparison

Want to see how the same patterns work across frameworks? Check out the **[Framework Comparison](./COMPARISON.md)** document.

## Project Structure

Each example follows a consistent structure:

```
framework-name/
├── src/
│   ├── store/              # Observable stores
│   ├── hooks|composables/  # Framework-specific abstractions
│   ├── components/         # UI components
│   ├── App                 # Main app component
│   └── main               # Entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── GETTING_STARTED.md
```

## Common Patterns

### Creating a Store

```typescript
import Observable from '@tipy/observable';

interface State {
  count: number;
}

export const store = new Observable<State>({
  initialState: { count: 0 }
});
```

### Using in Components

**React:**
```tsx
const state = useObservable(store);
return <div>Count: {state?.count}</div>;
```

**Vue:**
```vue
<script setup>
const state = useObservable(store);
</script>
<template>
  <div>Count: {{ state?.count }}</div>
</template>
```

## Learning Resources

- [Main Documentation](../README.md) - Complete API reference
- [More Examples](../EXAMPLES.md) - Additional code examples
- [Changelog](../CHANGELOG.md) - Version history

## Contributing

Want to add an example for another framework? We'd love to see examples for:
- Angular
- Svelte
- Solid.js
- Preact
- And more!

Feel free to open a PR following the same structure and patterns used in the existing examples.

## License

MIT - See [LICENSE](../LICENSE) for details

