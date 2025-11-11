/**
 * Listener function type that receives state/data updates
 * @template T The type of data passed to listeners
 */
export type Listener<T = any> = (data: T) => void;

/**
 * Unsubscribe function returned by subscribe method
 */
export type Unsubscribe = () => void;

/**
 * Error handler function for handling errors in observers
 */
export type ErrorHandler = (error: Error, listener: Listener<any>) => void;

/**
 * Middleware function that can intercept and modify notifications
 */
export type Middleware<T = any> = (data: T, next: (data: T) => void) => void;

/**
 * Options for configuring an Observable instance
 */
export interface ObservableOptions<T = any> {
  /**
   * Error handler for observer errors
   * @default console.error
   */
  onError?: ErrorHandler;
  
  /**
   * Initial state value
   */
  initialState?: T;
  
  /**
   * Middleware functions to process notifications
   */
  middleware?: Middleware<T>[];
}

/**
 * A powerful, type-safe Observable implementation for managing state and event subscriptions.
 * Framework-agnostic and similar to zustand but more flexible.
 * 
 * @template T The type of data/state managed by this observable
 * 
 * @example
 * ```typescript
 * // Simple event notifications
 * const observable = new Observable<string>();
 * const unsubscribe = observable.subscribe((msg) => console.log(msg));
 * observable.notify('Hello World');
 * unsubscribe();
 * 
 * // State management
 * const store = new Observable({ initialState: { count: 0 } });
 * store.subscribe((state) => console.log(state.count));
 * store.setState({ count: 1 });
 * ```
 */
class Observable<T = any> {
  private observers: Set<Listener<T>> = new Set();
  private state: T | undefined;
  private paused: boolean = false;
  private errorHandler: ErrorHandler;
  private middleware: Middleware<T>[] = [];

  /**
   * Creates a new Observable instance
   * @param options Configuration options for the observable
   */
  constructor(options: ObservableOptions<T> = {}) {
    this.state = options.initialState;
    this.errorHandler = options.onError || this.defaultErrorHandler;
    this.middleware = options.middleware || [];
  }

  /**
   * Default error handler that logs errors to console
   */
  private defaultErrorHandler: ErrorHandler = (error: Error, listener: Listener<any>) => {
    console.error('[Observable] Error in observer:', error, listener);
  };

  /**
   * Subscribes a listener to receive notifications
   * 
   * @param listener Function to be called when notify is triggered
   * @param notifyImmediately If true and state exists, immediately notify with current state
   * @returns Unsubscribe function to remove this listener
   * 
   * @example
   * ```typescript
   * const unsubscribe = observable.subscribe((data) => {
   *   console.log('Received:', data);
   * });
   * // Later...
   * unsubscribe();
   * ```
   */
  subscribe(listener: Listener<T>, notifyImmediately: boolean = false): Unsubscribe {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    this.observers.add(listener);

    // Immediately notify with current state if requested and state exists
    if (notifyImmediately && this.state !== undefined) {
      try {
        listener(this.state);
      } catch (error) {
        this.errorHandler(error as Error, listener);
      }
    }

    // Return unsubscribe function
    return () => this.unsubscribe(listener);
  }

  /**
   * Subscribes a listener that will only be called once, then automatically unsubscribed
   * 
   * @param listener Function to be called once when notify is triggered
   * @returns Unsubscribe function (in case you want to cancel before it's called)
   * 
   * @example
   * ```typescript
   * observable.once((data) => {
   *   console.log('This will only log once:', data);
   * });
   * ```
   */
  once(listener: Listener<T>): Unsubscribe {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    const wrappedListener = (data: T) => {
      this.unsubscribe(wrappedListener);
      listener(data);
    };

    return this.subscribe(wrappedListener);
  }

  /**
   * Unsubscribes a listener from receiving notifications
   * 
   * @param listener The listener function to remove
   * @returns true if listener was found and removed, false otherwise
   * 
   * @example
   * ```typescript
   * const listener = (data) => console.log(data);
   * observable.subscribe(listener);
   * observable.unsubscribe(listener);
   * ```
   */
  unsubscribe(listener: Listener<T>): boolean {
    return this.observers.delete(listener);
  }

  /**
   * Notifies all subscribed listeners with the provided data
   * Will not notify if observable is paused
   * 
   * @param data Data to pass to all listeners
   * 
   * @example
   * ```typescript
   * observable.notify({ message: 'Hello' });
   * ```
   */
  notify(data: T): void {
    if (this.paused) {
      return;
    }

    // Apply middleware chain
    const executeNotification = (processedData: T) => {
      this.observers.forEach((listener) => {
        try {
          listener(processedData);
        } catch (error) {
          this.errorHandler(error as Error, listener);
        }
      });
    };

    // Execute middleware chain
    if (this.middleware.length > 0) {
      let index = 0;
      const next = (processedData: T) => {
        if (index < this.middleware.length) {
          const middleware = this.middleware[index++];
          middleware(processedData, next);
        } else {
          executeNotification(processedData);
        }
      };
      next(data);
    } else {
      executeNotification(data);
    }
  }

  /**
   * Gets the current state (if state management is being used)
   * 
   * @returns The current state or undefined if no state is set
   * 
   * @example
   * ```typescript
   * const state = observable.getState();
   * ```
   */
  getState(): T | undefined {
    return this.state;
  }

  /**
   * Sets the state and notifies all observers with the new state
   * 
   * @param newState New state value or updater function
   * @param notifyObservers If false, state is updated without notifying observers
   * 
   * @example
   * ```typescript
   * // Direct state update
   * observable.setState({ count: 5 });
   * 
   * // Functional update
   * observable.setState((prev) => ({ count: prev.count + 1 }));
   * ```
   */
  setState(newState: T | ((prevState: T | undefined) => T), notifyObservers: boolean = true): void {
    const nextState = typeof newState === 'function'
      ? (newState as (prevState: T | undefined) => T)(this.state)
      : newState;

    this.state = nextState;

    if (notifyObservers) {
      this.notify(nextState);
    }
  }

  /**
   * Removes all subscribed listeners
   * 
   * @example
   * ```typescript
   * observable.clear();
   * ```
   */
  clear(): void {
    this.observers.clear();
  }

  /**
   * Checks if there are any subscribed observers
   * 
   * @returns true if at least one observer is subscribed
   * 
   * @example
   * ```typescript
   * if (observable.hasObservers()) {
   *   console.log('Someone is listening');
   * }
   * ```
   */
  hasObservers(): boolean {
    return this.observers.size > 0;
  }

  /**
   * Gets the number of subscribed observers
   * 
   * @returns Number of active observers
   * 
   * @example
   * ```typescript
   * console.log(`Active listeners: ${observable.getObserverCount()}`);
   * ```
   */
  getObserverCount(): number {
    return this.observers.size;
  }

  /**
   * Pauses notifications. When paused, notify() calls will be ignored
   * 
   * @example
   * ```typescript
   * observable.pause();
   * observable.notify('This will not be sent');
   * observable.resume();
   * ```
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * Resumes notifications after being paused
   * 
   * @example
   * ```typescript
   * observable.resume();
   * observable.notify('This will be sent');
   * ```
   */
  resume(): void {
    this.paused = false;
  }

  /**
   * Checks if notifications are currently paused
   * 
   * @returns true if paused, false otherwise
   * 
   * @example
   * ```typescript
   * if (observable.isPaused()) {
   *   console.log('Notifications are paused');
   * }
   * ```
   */
  isPaused(): boolean {
    return this.paused;
  }

  /**
   * Adds a middleware function to the notification pipeline
   * 
   * @param middleware Middleware function to add
   * 
   * @example
   * ```typescript
   * observable.addMiddleware((data, next) => {
   *   console.log('Before:', data);
   *   next(data);
   *   console.log('After');
   * });
   * ```
   */
  addMiddleware(middleware: Middleware<T>): void {
    this.middleware.push(middleware);
  }

  /**
   * Removes a middleware function
   * 
   * @param middleware Middleware function to remove
   * @returns true if middleware was found and removed
   */
  removeMiddleware(middleware: Middleware<T>): boolean {
    const index = this.middleware.indexOf(middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Destroys the observable, clearing all observers and state
   * After calling this, the observable should not be used
   * 
   * @example
   * ```typescript
   * observable.destroy();
   * ```
   */
  destroy(): void {
    this.clear();
    this.state = undefined;
    this.middleware = [];
  }
}

export default Observable;
