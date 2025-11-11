# @tipy/observable React Example

This is a simple React + TypeScript + Vite example demonstrating how to use `@tipy/observable` for state management.

## What This Example Shows

- **Shared State**: Two display components (`CounterDisplay1` and `CounterDisplay2`) subscribe to the same Observable store
- **State Updates**: A controls component (`CounterControls`) with increase/decrease buttons that update the shared state
- **Automatic Re-renders**: When the state changes, all subscribed components automatically re-render
- **Custom Hook**: A `useObservable` hook that handles subscription lifecycle automatically

## Project Structure

```
src/
  ├── store/
  │   └── counterStore.ts      # Observable store with counter state
  ├── hooks/
  │   └── useObservable.ts     # Custom React hook for Observable
  ├── components/
  │   ├── CounterDisplay1.tsx  # First display component
  │   ├── CounterDisplay2.tsx  # Second display component
  │   └── CounterControls.tsx  # Controls with increase/decrease buttons
  ├── App.tsx                  # Main app component
  └── main.tsx                 # App entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

2. Run the development server:
   ```bash
   yarn dev
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

### 2. Create a Custom Hook

```typescript
// src/hooks/useObservable.ts
import { useEffect, useState } from 'react';
import Observable from '@tipy/observable';

export function useObservable<T>(observable: Observable<T>): T | undefined {
  const [state, setState] = useState<T | undefined>(observable.getState());

  useEffect(() => {
    const unsubscribe = observable.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, [observable]);

  return state;
}
```

### 3. Use in Components

```typescript
// Display component
import { useObservable } from '../hooks/useObservable';
import { counterStore } from '../store/counterStore';

export function CounterDisplay() {
  const state = useObservable(counterStore);
  return <div>Count: {state?.count}</div>;
}

// Controls component
import { counterStore } from '../store/counterStore';

export function CounterControls() {
  const increment = () => {
    const current = counterStore.getState();
    counterStore.setState({ count: current.count + 1 });
  };
  
  return <button onClick={increment}>Increase</button>;
}
```

## Key Benefits

- ✅ **No Context API** - No providers needed
- ✅ **No Prop Drilling** - Components access state directly
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Simple API** - Easy to learn and use
- ✅ **Framework Agnostic** - The core Observable works anywhere
- ✅ **Automatic Cleanup** - The hook handles subscriptions automatically

## Learn More

- [Observable Documentation](../../README.md)
- [More Examples](../../EXAMPLES.md)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

