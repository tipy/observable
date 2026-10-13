# @tipy/observable Vue Example

This is a simple Vue 3 + TypeScript + Vite example demonstrating how to use `@tipy/observable` for state management.

## What This Example Shows

- **Shared State**: Two display components (`CounterDisplay1` and `CounterDisplay2`) subscribe to the same Observable store
- **State Updates**: A controls component (`CounterControls`) with increase/decrease buttons that update the shared state
- **Automatic Re-renders**: When the state changes, all subscribed components automatically re-render
- **Custom Composable**: A `useObservable` composable that handles subscription lifecycle automatically

## Project Structure

```
src/
  ├── store/
  │   └── counterStore.ts         # Observable store with counter state
  ├── composables/
  │   └── useObservable.ts        # Custom Vue composable for Observable
  ├── components/
  │   ├── CounterDisplay1.vue     # First display component
  │   ├── CounterDisplay2.vue     # Second display component
  │   └── CounterControls.vue     # Controls with increase/decrease buttons
  ├── App.vue                     # Main app component
  └── main.ts                     # App entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## How It Works

### 1. Create an Observable Store

```typescript
// src/store/counterStore.ts
import Observable from '@tipy/observable';

interface CounterState {
  count: number;
}

export const counterStore = new Observable<CounterState>({
  initialState: { count: 0 }
});
```

### 2. Create a Custom Composable

```typescript
// src/composables/useObservable.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import Observable from '@tipy/observable';

export function useObservable<T>(observable: Observable<T>): Ref<T | undefined> {
  const state = ref<T | undefined>(observable.getState()) as Ref<T | undefined>;

  onMounted(() => {
    const unsubscribe = observable.subscribe((newState) => {
      state.value = newState;
    });

    onUnmounted(() => {
      unsubscribe();
    });
  });

  return state;
}
```

### 3. Use in Components

```vue
<!-- Display component -->
<script setup lang="ts">
import { useObservable } from '../composables/useObservable';
import { counterStore } from '../store/counterStore';

const state = useObservable(counterStore);
</script>

<template>
  <div>Count: {{ state?.count }}</div>
</template>

<!-- Controls component -->
<script setup lang="ts">
import { counterStore } from '../store/counterStore';

const increment = () => {
  const current = counterStore.getState();
  counterStore.setState({ count: current.count + 1 });
};
</script>

<template>
  <button @click="increment">Increase</button>
</template>
```

## Key Benefits

- ✅ **No Provide/Inject** - No providers needed
- ✅ **No Prop Drilling** - Components access state directly
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Simple API** - Easy to learn and use
- ✅ **Framework Agnostic** - The core Observable works anywhere
- ✅ **Automatic Cleanup** - The composable handles subscriptions automatically
- ✅ **CSS Modules** - Scoped styling with `<style module>`

## Vue-Specific Features

This example uses Vue 3's Composition API with:
- `<script setup>` for cleaner component syntax
- `<style module>` for CSS modules (similar to React's approach)
- Composables (Vue's equivalent of React hooks)
- Reactive refs for automatic UI updates

## Learn More

- [Observable Documentation](../../README.md)
- [More Examples](../../EXAMPLES.md)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

