# Observable Examples

This file contains practical examples of using `@tipy/observable` in various scenarios.

## Table of Contents

- [Basic Usage](#basic-usage)
- [State Management](#state-management)
- [React Integration](#react-integration)
- [Vue Integration](#vue-integration)
- [Middleware](#middleware)
- [Advanced Patterns](#advanced-patterns)

## Basic Usage

### Simple Event Notifications

```typescript
import Observable from '@tipy/observable';

const userEvents = new Observable<{ action: string; userId: string }>();

// Subscribe to events
const unsubscribe = userEvents.subscribe((event) => {
  console.log(`User ${event.userId} performed: ${event.action}`);
});

// Emit events
userEvents.notify({ action: 'login', userId: '123' });
userEvents.notify({ action: 'logout', userId: '123' });

// Clean up
unsubscribe();
```

### One-time Subscriptions

```typescript
const welcomeMessage = new Observable<string>();

// This will only execute once
welcomeMessage.once((message) => {
  console.log('Welcome:', message);
});

welcomeMessage.notify('Hello!'); // Logs: "Welcome: Hello!"
welcomeMessage.notify('Hi again!'); // Doesn't log
```

## State Management

### Simple Counter Store

```typescript
interface CounterState {
  count: number;
}

class CounterStore {
  private observable: Observable<CounterState>;

  constructor(initialCount: number = 0) {
    this.observable = new Observable<CounterState>({
      initialState: { count: initialCount },
    });
  }

  subscribe(listener: (state: CounterState) => void) {
    return this.observable.subscribe(listener);
  }

  getCount() {
    return this.observable.getState()?.count ?? 0;
  }

  increment() {
    const state = this.observable.getState();
    if (state) {
      this.observable.setState({ count: state.count + 1 });
    }
  }

  decrement() {
    const state = this.observable.getState();
    if (state) {
      this.observable.setState({ count: state.count - 1 });
    }
  }

  reset() {
    this.observable.setState({ count: 0 });
  }
}

// Usage
const counter = new CounterStore(0);

counter.subscribe((state) => {
  console.log('Count:', state.count);
});

counter.increment(); // Logs: "Count: 1"
counter.increment(); // Logs: "Count: 2"
counter.reset(); // Logs: "Count: 0"
```

### Todo List Store

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

class TodoStore {
  private observable: Observable<TodoState>;

  constructor() {
    this.observable = new Observable<TodoState>({
      initialState: { todos: [] },
    });
  }

  subscribe(listener: (state: TodoState) => void) {
    return this.observable.subscribe(listener, true); // Notify immediately
  }

  getTodos() {
    return this.observable.getState()?.todos ?? [];
  }

  addTodo(text: string) {
    const state = this.observable.getState();
    if (state) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false,
      };
      this.observable.setState({
        todos: [...state.todos, newTodo],
      });
    }
  }

  toggleTodo(id: string) {
    const state = this.observable.getState();
    if (state) {
      this.observable.setState({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      });
    }
  }

  removeTodo(id: string) {
    const state = this.observable.getState();
    if (state) {
      this.observable.setState({
        todos: state.todos.filter((todo) => todo.id !== id),
      });
    }
  }
}

// Usage
const todoStore = new TodoStore();

todoStore.subscribe((state) => {
  console.log('Todos:', state.todos);
});

todoStore.addTodo('Learn Observable');
todoStore.addTodo('Build an app');
todoStore.toggleTodo(todoStore.getTodos()[0].id);
```

## React Integration

### Custom Hook for Observable

```typescript
import { useEffect, useState } from 'react';
import Observable from '@tipy/observable';

function useObservable<T>(observable: Observable<T>): T | undefined {
  const [state, setState] = useState<T | undefined>(observable.getState());

  useEffect(() => {
    const unsubscribe = observable.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [observable]);

  return state;
}

// Usage in a component
interface AppState {
  user: { name: string } | null;
}

const appStore = new Observable<AppState>({
  initialState: { user: null },
});

function App() {
  const state = useObservable(appStore);

  return (
    <div>
      <h1>User: {state?.user?.name || 'Not logged in'}</h1>
      <button
        onClick={() =>
          appStore.setState({ user: { name: 'John Doe' } })
        }
      >
        Login
      </button>
    </div>
  );
}
```

### Selector Hook (Like Zustand)

```typescript
import { useEffect, useState } from 'react';
import Observable from '@tipy/observable';

function useObservableSelector<T, R>(
  observable: Observable<T>,
  selector: (state: T) => R,
  equalityFn: (a: R, b: R) => boolean = (a, b) => a === b
): R | undefined {
  const [selectedState, setSelectedState] = useState<R | undefined>(() => {
    const state = observable.getState();
    return state ? selector(state) : undefined;
  });

  useEffect(() => {
    const unsubscribe = observable.subscribe((newState) => {
      const newSelectedState = selector(newState);
      setSelectedState((prev) => {
        if (prev === undefined || !equalityFn(prev, newSelectedState)) {
          return newSelectedState;
        }
        return prev;
      });
    });

    return unsubscribe;
  }, [observable, selector, equalityFn]);

  return selectedState;
}

// Usage
interface StoreState {
  user: { name: string; email: string };
  settings: { theme: string };
}

const store = new Observable<StoreState>({
  initialState: {
    user: { name: 'John', email: 'john@example.com' },
    settings: { theme: 'dark' },
  },
});

function UserProfile() {
  // Only re-renders when user.name changes
  const userName = useObservableSelector(store, (state) => state.user.name);

  return <div>User: {userName}</div>;
}
```

## Vue Integration

### Vue 3 Composition API

```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import Observable from '@tipy/observable';

function useObservable<T>(observable: Observable<T>) {
  const state = ref<T | undefined>(observable.getState());

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

// Usage in a Vue component
export default {
  setup() {
    const counterStore = new Observable({
      initialState: { count: 0 },
    });

    const state = useObservable(counterStore);

    const increment = () => {
      const current = counterStore.getState();
      if (current) {
        counterStore.setState({ count: current.count + 1 });
      }
    };

    return { state, increment };
  },
};
```

## Middleware

### Logger Middleware

```typescript
import Observable, { Middleware } from '@tipy/observable';

const loggerMiddleware: Middleware<any> = (data, next) => {
  console.log('[Observable] Notification:', {
    timestamp: new Date().toISOString(),
    data,
  });
  next(data);
};

const observable = new Observable({
  middleware: [loggerMiddleware],
});
```

### Performance Monitoring

```typescript
const performanceMiddleware: Middleware<any> = (data, next) => {
  const start = performance.now();
  next(data);
  const end = performance.now();
  console.log(`Notification took ${end - start}ms`);
};
```

### Data Validation

```typescript
interface ValidatedData {
  email: string;
  age: number;
}

const validationMiddleware: Middleware<ValidatedData> = (data, next) => {
  // Validate email
  if (!data.email || !data.email.includes('@')) {
    console.error('Invalid email');
    return; // Don't call next, blocking the notification
  }

  // Validate age
  if (data.age < 0 || data.age > 150) {
    console.error('Invalid age');
    return;
  }

  next(data);
};

const userObservable = new Observable<ValidatedData>({
  middleware: [validationMiddleware],
});
```

### Throttling/Debouncing

```typescript
function throttleMiddleware<T>(delay: number): Middleware<T> {
  let lastCall = 0;

  return (data, next) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      next(data);
    }
  };
}

const searchObservable = new Observable<string>({
  middleware: [throttleMiddleware(300)],
});
```

## Advanced Patterns

### Event Bus with Typed Events

```typescript
// Define event types
type AppEvents =
  | { type: 'USER_LOGIN'; payload: { userId: string; username: string } }
  | { type: 'USER_LOGOUT'; payload: { userId: string } }
  | { type: 'DATA_UPDATED'; payload: { entityId: string; data: any } }
  | { type: 'ERROR'; payload: { message: string; code: string } };

class EventBus {
  private observable = new Observable<AppEvents>();

  // Subscribe to all events
  subscribe(listener: (event: AppEvents) => void) {
    return this.observable.subscribe(listener);
  }

  // Subscribe to specific event type
  on<T extends AppEvents['type']>(
    eventType: T,
    listener: (payload: Extract<AppEvents, { type: T }>['payload']) => void
  ) {
    return this.observable.subscribe((event) => {
      if (event.type === eventType) {
        listener(event.payload as any);
      }
    });
  }

  // Emit an event
  emit(event: AppEvents) {
    this.observable.notify(event);
  }
}

// Usage
const eventBus = new EventBus();

// Listen to specific events
eventBus.on('USER_LOGIN', (payload) => {
  console.log(`${payload.username} logged in`);
});

eventBus.on('ERROR', (payload) => {
  console.error(`Error ${payload.code}: ${payload.message}`);
});

// Emit events
eventBus.emit({
  type: 'USER_LOGIN',
  payload: { userId: '123', username: 'john' },
});
```

### Computed Values (Derived State)

```typescript
interface StoreState {
  items: Array<{ id: string; price: number; quantity: number }>;
}

class ShoppingCartStore {
  private observable: Observable<StoreState>;

  constructor() {
    this.observable = new Observable<StoreState>({
      initialState: { items: [] },
    });
  }

  subscribe(listener: (state: StoreState) => void) {
    return this.observable.subscribe(listener);
  }

  // Computed value
  getTotalPrice(): number {
    const state = this.observable.getState();
    if (!state) return 0;

    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Computed value
  getItemCount(): number {
    const state = this.observable.getState();
    if (!state) return 0;

    return state.items.reduce((count, item) => count + item.quantity, 0);
  }

  addItem(item: { id: string; price: number; quantity: number }) {
    const state = this.observable.getState();
    if (state) {
      this.observable.setState({
        items: [...state.items, item],
      });
    }
  }
}
```

### Async State Management

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

class AsyncStore<T> {
  private observable: Observable<AsyncState<T>>;

  constructor() {
    this.observable = new Observable<AsyncState<T>>({
      initialState: {
        data: null,
        loading: false,
        error: null,
      },
    });
  }

  subscribe(listener: (state: AsyncState<T>) => void) {
    return this.observable.subscribe(listener);
  }

  async fetch(fetcher: () => Promise<T>) {
    // Set loading state
    this.observable.setState({
      data: null,
      loading: true,
      error: null,
    });

    try {
      const data = await fetcher();
      this.observable.setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.observable.setState({
        data: null,
        loading: false,
        error: error as Error,
      });
    }
  }

  reset() {
    this.observable.setState({
      data: null,
      loading: false,
      error: null,
    });
  }
}

// Usage
interface User {
  id: string;
  name: string;
  email: string;
}

const userStore = new AsyncStore<User>();

userStore.subscribe((state) => {
  if (state.loading) {
    console.log('Loading...');
  } else if (state.error) {
    console.error('Error:', state.error.message);
  } else if (state.data) {
    console.log('User:', state.data);
  }
});

// Fetch user data
userStore.fetch(async () => {
  const response = await fetch('https://api.example.com/user/123');
  return response.json();
});
```

### Undo/Redo Pattern

```typescript
interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

class HistoryStore<T> {
  private observable: Observable<HistoryState<T>>;

  constructor(initialState: T) {
    this.observable = new Observable<HistoryState<T>>({
      initialState: {
        past: [],
        present: initialState,
        future: [],
      },
    });
  }

  subscribe(listener: (state: T) => void) {
    return this.observable.subscribe((historyState) => {
      listener(historyState.present);
    });
  }

  getState(): T | undefined {
    return this.observable.getState()?.present;
  }

  setState(newState: T) {
    const state = this.observable.getState();
    if (state) {
      this.observable.setState({
        past: [...state.past, state.present],
        present: newState,
        future: [], // Clear future when new state is set
      });
    }
  }

  undo() {
    const state = this.observable.getState();
    if (state && state.past.length > 0) {
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      this.observable.setState({
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      });
    }
  }

  redo() {
    const state = this.observable.getState();
    if (state && state.future.length > 0) {
      const next = state.future[0];
      const newFuture = state.future.slice(1);

      this.observable.setState({
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      });
    }
  }

  canUndo(): boolean {
    const state = this.observable.getState();
    return state ? state.past.length > 0 : false;
  }

  canRedo(): boolean {
    const state = this.observable.getState();
    return state ? state.future.length > 0 : false;
  }
}

// Usage
const textEditor = new HistoryStore<string>('');

textEditor.subscribe((text) => {
  console.log('Text:', text);
});

textEditor.setState('Hello');
textEditor.setState('Hello World');
textEditor.setState('Hello World!');

textEditor.undo(); // Back to "Hello World"
textEditor.undo(); // Back to "Hello"
textEditor.redo(); // Forward to "Hello World"
```

## Best Practices

1. **Type Safety**: Always use TypeScript generics for type safety
2. **Clean Up**: Always unsubscribe when done to prevent memory leaks
3. **Error Handling**: Use custom error handlers for production apps
4. **Middleware**: Use middleware for cross-cutting concerns (logging, validation, etc.)
5. **State Management**: Use `getState()` and `setState()` for complex state management
6. **Immutability**: Always create new state objects instead of mutating existing ones
7. **Separation of Concerns**: Create separate observables for different domains
8. **Testing**: Mock observables in tests for easier testing

## Performance Tips

1. Use `notifyImmediately: false` (default) unless you specifically need immediate notification
2. Use pause/resume for batch updates
3. Implement throttling/debouncing middleware for high-frequency updates
4. Use selectors in React to prevent unnecessary re-renders
5. Clear observers when they're no longer needed with `clear()` or `destroy()`

