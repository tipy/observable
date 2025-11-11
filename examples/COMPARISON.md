# React vs Vue Examples Comparison

This document shows how the same Observable patterns are implemented across React and Vue frameworks.

## Project Structure

Both examples follow an identical structure:

```
reactjs/                          vuejs/
├── src/                          ├── src/
│   ├── store/                    │   ├── store/
│   │   └── counterStore.ts       │   │   └── counterStore.ts       (identical)
│   ├── hooks/                    │   ├── composables/
│   │   └── useObservable.ts      │   │   └── useObservable.ts      (framework-specific)
│   ├── components/               │   ├── components/
│   │   ├── CounterDisplay1       │   │   ├── CounterDisplay1.vue
│   │   ├── CounterDisplay2       │   │   ├── CounterDisplay2.vue
│   │   └── CounterControls       │   │   └── CounterControls.vue
│   ├── App                       │   ├── App.vue
│   └── main                      │   └── main.ts
├── package.json                  ├── package.json
├── vite.config.ts                ├── vite.config.ts
└── tsconfig.json                 └── tsconfig.json
```

## Store Implementation

**Identical in both frameworks:**

```typescript
// counterStore.ts (React & Vue)
import Observable from '@tipy/observable';

interface CounterState {
  count: number;
}

export const counterStore = new Observable<CounterState>({
  initialState: { count: 0 }
});

export const increment = () => {
  const currentState = counterStore.getState();
  if (currentState) {
    counterStore.setState({ count: currentState.count + 1 });
  }
};

export const decrement = () => {
  const currentState = counterStore.getState();
  if (currentState) {
    counterStore.setState({ count: currentState.count - 1 });
  }
};
```

## Hook/Composable Implementation

### React Hook

```typescript
// hooks/useObservable.ts
import { useEffect, useState } from 'react';
import Observable from '@tipy/observable';

export function useObservable<T>(observable: Observable<T>): T | undefined {
  const [state, setState] = useState<T | undefined>(observable.getState());

  useEffect(() => {
    const unsubscribe = observable.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, [observable]);

  return state;
}
```

### Vue Composable

```typescript
// composables/useObservable.ts
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

## Component Implementation

### React Component

```tsx
// components/CounterDisplay1.tsx
import { useObservable } from '../hooks/useObservable';
import { counterStore } from '../store/counterStore';
import styles from './CounterDisplay1.module.css';

export function CounterDisplay1() {
  const state = useObservable(counterStore);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Counter Display 1
      </h3>
      <p className={styles.count}>
        Count: {state?.count ?? 0}
      </p>
    </div>
  );
}
```

### Vue Component

```vue
<!-- components/CounterDisplay1.vue -->
<script setup lang="ts">
import { useObservable } from '../composables/useObservable';
import { counterStore } from '../store/counterStore';

const state = useObservable(counterStore);
</script>

<template>
  <div :class="$style.container">
    <h3 :class="$style.title">
      Counter Display 1
    </h3>
    <p :class="$style.count">
      Count: {{ state?.count ?? 0 }}
    </p>
  </div>
</template>

<style module>
.container {
  padding: 20px;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background-color: #f0f9f0;
  margin: 10px 0;
}

.title {
  margin: 0 0 10px 0;
  color: #2e7d32;
}

.count {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}
</style>
```

## CSS Modules

### React

- CSS in separate `.module.css` files
- Import: `import styles from './Component.module.css'`
- Usage: `<div className={styles.container}>`
- Multiple classes: `<div className={\`\${styles.button} \${styles.primary}\`}>`

### Vue

- CSS in `<style module>` block within `.vue` file
- No import needed (automatically available as `$style`)
- Usage: `<div :class="$style.container">`
- Multiple classes: `<div :class="[$style.button, $style.primary]">`

## Key Similarities

1. **Store Logic**: 100% identical - same Observable, same state management
2. **Business Logic**: Helper functions (increment/decrement) are identical
3. **Component Structure**: Same component hierarchy and relationships
4. **Styling Approach**: Both use CSS Modules for scoped styles
5. **Type Safety**: Full TypeScript support in both
6. **Lifecycle Management**: Automatic subscription cleanup in both

## Key Differences

1. **Hook vs Composable**: React uses `useState`/`useEffect`, Vue uses `ref`/`onMounted`/`onUnmounted`
2. **File Structure**: React separates CSS, Vue embeds in SFC
3. **Syntax**: React JSX vs Vue template syntax
4. **Reactivity**: React uses state setter, Vue uses `.value` assignment
5. **CSS Access**: React imports styles object, Vue uses built-in `$style`

## Framework-Agnostic Benefits

Both examples demonstrate that `@tipy/observable`:
- Works identically across different frameworks
- Requires minimal framework-specific adaptation (just the hook/composable)
- Provides consistent API regardless of UI framework
- Makes it easy to share state management logic between projects
- No need for framework-specific state management libraries

## Performance

Both implementations:
- Only re-render subscribed components when state changes
- Automatically clean up subscriptions on unmount
- Have minimal overhead (just the subscription management)
- Support multiple subscribers without performance degradation

