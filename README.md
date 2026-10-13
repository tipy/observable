# 🔔 Observable

A powerful, type-safe, framework-agnostic Observable implementation for managing state and event subscriptions. Similar to Zustand but more flexible and can be used with any framework or vanilla JavaScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Type-Safe** - Full TypeScript support with generics
- 🚀 **Lightweight** - Minimal footprint, zero dependencies
- 🔒 **Error Handling** - Built-in error handling for observer functions
- 🎨 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JS
- 🔄 **State Management** - Built-in state management similar to Zustand
- 🎭 **Middleware Support** - Intercept and transform notifications
- ⏸️ **Pause/Resume** - Control when notifications are sent
- 🧩 **Flexible API** - Subscribe once, check observer count, clear all, and more

## 📦 Installation

```bash
pnpm add @tipy/observable
```

or

```bash
npm install @tipy/observable
```

## 🚀 Quick Start

### Basic Event Notifications

```typescript
import Observable from '@tipy/observable';

// Create an observable
const observable = new Observable<string>();

// Subscribe to notifications
const unsubscribe = observable.subscribe((message) => {
  console.log('Received:', message);
});

// Notify all subscribers
observable.notify('Hello World!'); // Logs: "Received: Hello World!"

// Unsubscribe when done
unsubscribe();
```

### State Management (Like Zustand)

```typescript
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const store = new Observable<CounterStore>({
  initialState: {
    count: 0,
    increment: () => {
      const state = store.getState();
      if (state) {
        store.setState({ ...state, count: state.count + 1 });
      }
    },
    decrement: () => {
      const state = store.getState();
      if (state) {
        store.setState({ ...state, count: state.count - 1 });
      }
    },
  },
});

// Subscribe to state changes
store.subscribe((state) => {
  console.log('Count:', state.count);
});

// Update state
const state = store.getState();
state?.increment(); // Logs: "Count: 1"
state?.increment(); // Logs: "Count: 2"
```

## 📖 API Reference

### Constructor

```typescript
new Observable<T>(options?: ObservableOptions<T>)
```

**Options:**
- `initialState?: T` - Initial state value for state management
- `onError?: ErrorHandler` - Custom error handler for observer errors
- `middleware?: Middleware<T>[]` - Array of middleware functions

### Core Methods

#### `subscribe(listener, notifyImmediately?)`

Subscribes a listener to receive notifications.

```typescript
const unsubscribe = observable.subscribe((data) => {
  console.log(data);
}, false);

// Returns an unsubscribe function
unsubscribe();
```

**Parameters:**
- `listener: (data: T) => void` - Function to call on notifications
- `notifyImmediately?: boolean` - If true, immediately notify with current state (default: false)

**Returns:** `() => void` - Unsubscribe function

#### `notify(data)`

Notifies all subscribed listeners with data.

```typescript
observable.notify({ message: 'Hello' });
```

#### `unsubscribe(listener)`

Removes a specific listener.

```typescript
const listener = (data) => console.log(data);
observable.subscribe(listener);
observable.unsubscribe(listener); // Returns true if removed
```

**Returns:** `boolean` - true if listener was found and removed

### Advanced Methods

#### `once(listener)`

Subscribe a listener that will only be called once.

```typescript
observable.once((data) => {
  console.log('This will only log once:', data);
});

observable.notify('First'); // Logs
observable.notify('Second'); // Doesn't log
```

#### `setState(newState, notifyObservers?)`

Updates state and optionally notifies observers.

```typescript
// Direct update
store.setState({ count: 5 });

// Functional update
store.setState((prev) => ({ count: prev.count + 1 }));

// Silent update (no notifications)
store.setState({ count: 10 }, false);
```

#### `getState()`

Returns the current state.

```typescript
const currentState = store.getState();
```

#### `pause()` / `resume()`

Pause and resume notifications.

```typescript
observable.pause();
observable.notify('ignored'); // Won't notify

observable.resume();
observable.notify('sent'); // Will notify
```

#### `clear()`

Removes all subscribers.

```typescript
observable.clear();
```

#### `hasObservers()`

Check if any observers are subscribed.

```typescript
if (observable.hasObservers()) {
  console.log('Someone is listening');
}
```

#### `getObserverCount()`

Get the number of active observers.

```typescript
console.log(`Active listeners: ${observable.getObserverCount()}`);
```

#### `destroy()`

Destroys the observable, clearing all observers and state.

```typescript
observable.destroy();
```

### Middleware

#### `addMiddleware(middleware)`

Add middleware to process notifications.

```typescript
observable.addMiddleware((data, next) => {
  console.log('Before:', data);
  next(data); // Transform data if needed
  console.log('After');
});
```

#### `removeMiddleware(middleware)`

Remove a middleware function.

```typescript
const middleware = (data, next) => next(data.toUpperCase());
observable.addMiddleware(middleware);
observable.removeMiddleware(middleware);
```

## 🎯 Use Cases

### Event Bus Pattern

```typescript
interface AppEvent {
  type: string;
  payload: any;
}

const eventBus = new Observable<AppEvent>();

// Subscribe to specific events
eventBus.subscribe((event) => {
  if (event.type === 'USER_LOGIN') {
    console.log('User logged in:', event.payload);
  }
});

// Emit events
eventBus.notify({ type: 'USER_LOGIN', payload: { username: 'john' } });
```

### Real-time Data Updates

```typescript
const dataStream = new Observable<number>();

dataStream.subscribe((value) => {
  console.log('New value:', value);
});

// Simulate real-time updates
setInterval(() => {
  dataStream.notify(Math.random());
}, 1000);
```

### Form State Management

```typescript
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  isDirty: boolean;
}

const formStore = new Observable<FormState>({
  initialState: {
    values: {},
    errors: {},
    isDirty: false,
  },
});

formStore.subscribe((state) => {
  // Update UI when form state changes
  console.log('Form state:', state);
});
```

## 🛡️ Error Handling

Errors in observers are caught automatically and won't crash other observers.

```typescript
const observable = new Observable({
  onError: (error, listener) => {
    console.error('Observer error:', error.message);
    // Send to error tracking service
  },
});

observable.subscribe(() => {
  throw new Error('Oops!');
});

observable.subscribe(() => {
  console.log('I still execute!'); // This will still run
});

observable.notify('test');
```

## 🎨 Middleware Examples

### Logging Middleware

```typescript
const loggingMiddleware = (data, next) => {
  console.log('Notifying with:', data);
  next(data);
};
```

### Data Transformation

```typescript
const uppercaseMiddleware = (data, next) => {
  next(data.toUpperCase());
};
```

### Filtering

```typescript
const filterMiddleware = (data, next) => {
  if (data.shouldNotify) {
    next(data);
  }
  // Don't call next to block notification
};
```

### Validation

```typescript
const validationMiddleware = (data, next) => {
  if (isValid(data)) {
    next(data);
  } else {
    console.error('Invalid data');
  }
};
```

## 🔧 TypeScript Support

Full TypeScript support with generics:

```typescript
import Observable, { Listener, Middleware, ObservableOptions } from '@tipy/observable';

// Strongly typed observable
const stringObs = new Observable<string>();
const numberObs = new Observable<number>();

// Type-safe listeners
const listener: Listener<string> = (data) => {
  // data is typed as string
  console.log(data.toUpperCase());
};

// Type-safe middleware
const middleware: Middleware<string> = (data, next) => {
  // data is typed as string
  next(data.trim());
};
```

## 📊 Comparison with Other Libraries

| Feature | @tipy/observable | Zustand | RxJS |
|---------|------------------|---------|------|
| Bundle Size | ~2KB | ~3KB | ~40KB |
| TypeScript | ✅ | ✅ | ✅ |
| Framework Agnostic | ✅ | ❌ (React focused) | ✅ |
| State Management | ✅ | ✅ | ❌ |
| Error Handling | ✅ Built-in | ⚠️ Manual | ✅ |
| Middleware | ✅ | ✅ | ⚠️ Operators |
| Learning Curve | Easy | Easy | Steep |
| Pause/Resume | ✅ | ❌ | ⚠️ Complex |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Gustavo Isensee

## 🙋 FAQ

**Q: Can I use this with React?**  
A: Yes! It's framework-agnostic. Create a custom hook to integrate with React.

**Q: How is this different from EventEmitter?**  
A: Observable is type-safe, has built-in state management, middleware support, and modern features like pause/resume.

**Q: Can I use multiple observables?**  
A: Absolutely! Create as many observables as you need for different parts of your application.

**Q: Is it production-ready?**  
A: Yes! It's thoroughly tested with comprehensive test coverage.

## 📚 Additional Resources

- [GitHub Repository](https://github.com/tipy/observable)
- [Issue Tracker](https://github.com/tipy/observable/issues)
- [Changelog](https://github.com/tipy/observable/releases)
