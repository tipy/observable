import Observable, { Listener, Middleware } from './index';

interface TestState {
  count: number;
  message?: string;
}

describe('Observable - Basic Functionality', () => {
  let obs: Observable;
  let listener1: jest.Mock;
  let listener2: jest.Mock;

  beforeEach(() => {
    obs = new Observable();
    listener1 = jest.fn();
    listener2 = jest.fn();
    jest.clearAllMocks();
  });

  describe('subscribe and notify', () => {
    it('notifies all subscribed listeners', () => {
      obs.subscribe(listener1);
      obs.subscribe(listener2);

      obs.notify('test data');

      expect(listener1).toHaveBeenCalledWith('test data');
      expect(listener2).toHaveBeenCalledWith('test data');
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('returns an unsubscribe function from subscribe', () => {
      const unsubscribe = obs.subscribe(listener1);
      obs.subscribe(listener2);

      unsubscribe();
      obs.notify('test');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('throws error when subscribing non-function', () => {
      expect(() => {
        obs.subscribe('not a function' as any);
      }).toThrow(TypeError);
    });

    it('handles multiple notifications', () => {
      obs.subscribe(listener1);

      obs.notify('first');
      obs.notify('second');
      obs.notify('third');

      expect(listener1).toHaveBeenCalledTimes(3);
      expect(listener1).toHaveBeenNthCalledWith(1, 'first');
      expect(listener1).toHaveBeenNthCalledWith(2, 'second');
      expect(listener1).toHaveBeenNthCalledWith(3, 'third');
    });

    it('does not throw when notifying with no subscribers', () => {
      expect(() => {
        obs.notify('test');
      }).not.toThrow();
    });

    it('prevents duplicate subscriptions with same listener', () => {
      obs.subscribe(listener1);
      obs.subscribe(listener1);
      obs.subscribe(listener1);

      obs.notify('test');

      // Set only stores unique values, so should only be called once
      expect(listener1).toHaveBeenCalledTimes(1);
    });
  });

  describe('unsubscribe', () => {
    it('unsubscribes a specific listener', () => {
      obs.subscribe(listener1);
      obs.subscribe(listener2);

      const removed = obs.unsubscribe(listener2);

      obs.notify('test');

      expect(removed).toBe(true);
      expect(listener1).toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('returns false when unsubscribing non-existent listener', () => {
      const removed = obs.unsubscribe(listener1);
      expect(removed).toBe(false);
    });

    it('can unsubscribe multiple times safely', () => {
      obs.subscribe(listener1);

      obs.unsubscribe(listener1);
      obs.unsubscribe(listener1);
      obs.unsubscribe(listener1);

      obs.notify('test');

      expect(listener1).not.toHaveBeenCalled();
    });
  });

  describe('once', () => {
    it('calls listener only once then auto-unsubscribes', () => {
      obs.once(listener1);

      obs.notify('first');
      obs.notify('second');
      obs.notify('third');

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith('first');
    });

    it('returns an unsubscribe function', () => {
      const unsubscribe = obs.once(listener1);

      unsubscribe();
      obs.notify('test');

      expect(listener1).not.toHaveBeenCalled();
    });

    it('throws error when passing non-function', () => {
      expect(() => {
        obs.once(null as any);
      }).toThrow(TypeError);
    });
  });

  describe('clear', () => {
    it('removes all subscribers', () => {
      obs.subscribe(listener1);
      obs.subscribe(listener2);

      obs.clear();
      obs.notify('test');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });

  describe('observer management', () => {
    it('hasObservers returns true when observers exist', () => {
      expect(obs.hasObservers()).toBe(false);

      obs.subscribe(listener1);
      expect(obs.hasObservers()).toBe(true);

      obs.unsubscribe(listener1);
      expect(obs.hasObservers()).toBe(false);
    });

    it('getObserverCount returns correct count', () => {
      expect(obs.getObserverCount()).toBe(0);

      obs.subscribe(listener1);
      expect(obs.getObserverCount()).toBe(1);

      obs.subscribe(listener2);
      expect(obs.getObserverCount()).toBe(2);

      obs.unsubscribe(listener1);
      expect(obs.getObserverCount()).toBe(1);

      obs.clear();
      expect(obs.getObserverCount()).toBe(0);
    });
  });
});

describe('Observable - State Management', () => {
  let store: Observable<TestState>;
  let listener: jest.Mock;

  beforeEach(() => {
    listener = jest.fn();
  });

  describe('getState and setState', () => {
    it('initializes with initial state', () => {
      store = new Observable<TestState>({ initialState: { count: 0 } });

      expect(store.getState()).toEqual({ count: 0 });
    });

    it('returns undefined when no initial state', () => {
      store = new Observable<TestState>();

      expect(store.getState()).toBeUndefined();
    });

    it('updates state and notifies observers', () => {
      store = new Observable<TestState>({ initialState: { count: 0 } });
      store.subscribe(listener);

      store.setState({ count: 5 });

      expect(store.getState()).toEqual({ count: 5 });
      expect(listener).toHaveBeenCalledWith({ count: 5 });
    });

    it('supports functional state updates', () => {
      store = new Observable<TestState>({ initialState: { count: 0 } });
      store.subscribe(listener);

      store.setState((prev) => ({ count: prev!.count + 1 }));

      expect(store.getState()).toEqual({ count: 1 });
      expect(listener).toHaveBeenCalledWith({ count: 1 });
    });

    it('can update state without notifying observers', () => {
      store = new Observable<TestState>({ initialState: { count: 0 } });
      store.subscribe(listener);

      store.setState({ count: 10 }, false);

      expect(store.getState()).toEqual({ count: 10 });
      expect(listener).not.toHaveBeenCalled();
    });

    it('notifies immediately on subscribe when requested', () => {
      store = new Observable<TestState>({ initialState: { count: 42 } });

      store.subscribe(listener, true);

      expect(listener).toHaveBeenCalledWith({ count: 42 });
    });

    it('does not notify immediately when state is undefined', () => {
      store = new Observable<TestState>();

      store.subscribe(listener, true);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});

describe('Observable - Error Handling', () => {
  let obs: Observable;
  let errorHandler: jest.Mock;

  beforeEach(() => {
    errorHandler = jest.fn();
    obs = new Observable({ onError: errorHandler });
  });

  it('catches errors in observers and calls error handler', () => {
    const errorListener = jest.fn(() => {
      throw new Error('Test error');
    });
    const normalListener = jest.fn();

    obs.subscribe(errorListener);
    obs.subscribe(normalListener);

    obs.notify('test');

    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      errorListener
    );
    expect(normalListener).toHaveBeenCalled();
  });

  it('uses default error handler when none provided', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const obs2 = new Observable();
    const errorListener = jest.fn(() => {
      throw new Error('Default handler test');
    });

    obs2.subscribe(errorListener);
    obs2.notify('test');

    expect(consoleError).toHaveBeenCalledWith(
      '[Observable] Error in observer:',
      expect.objectContaining({ message: 'Default handler test' }),
      errorListener
    );

    consoleError.mockRestore();
  });

  it('handles errors during immediate notification on subscribe', () => {
    const store = new Observable({
      initialState: { test: 'data' },
      onError: errorHandler,
    });

    const errorListener = jest.fn(() => {
      throw new Error('Subscribe error');
    });

    store.subscribe(errorListener, true);

    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Subscribe error' }),
      errorListener
    );
  });

  it('continues notifying other observers after one throws', () => {
    const errorListener = jest.fn(() => {
      throw new Error('Error');
    });
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    obs.subscribe(listener1);
    obs.subscribe(errorListener);
    obs.subscribe(listener2);

    obs.notify('test');

    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
  });
});

describe('Observable - Pause and Resume', () => {
  let obs: Observable;
  let listener: jest.Mock;

  beforeEach(() => {
    obs = new Observable();
    listener = jest.fn();
    obs.subscribe(listener);
  });

  it('does not notify when paused', () => {
    obs.pause();
    obs.notify('test');

    expect(listener).not.toHaveBeenCalled();
    expect(obs.isPaused()).toBe(true);
  });

  it('resumes notifications after pause', () => {
    obs.pause();
    obs.notify('paused');

    obs.resume();
    obs.notify('resumed');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('resumed');
    expect(obs.isPaused()).toBe(false);
  });

  it('can toggle pause/resume multiple times', () => {
    obs.notify('1');
    obs.pause();
    obs.notify('2');
    obs.resume();
    obs.notify('3');
    obs.pause();
    obs.notify('4');
    obs.resume();
    obs.notify('5');

    expect(listener).toHaveBeenCalledTimes(3);
    expect(listener).toHaveBeenNthCalledWith(1, '1');
    expect(listener).toHaveBeenNthCalledWith(2, '3');
    expect(listener).toHaveBeenNthCalledWith(3, '5');
  });
});

describe('Observable - Middleware', () => {
  let obs: Observable<string>;
  let listener: jest.Mock;

  beforeEach(() => {
    listener = jest.fn();
  });

  it('applies middleware to notifications', () => {
    const middleware: Middleware<string> = (data, next) => {
      next(data.toUpperCase());
    };

    obs = new Observable<string>({ middleware: [middleware] });
    obs.subscribe(listener);

    obs.notify('hello');

    expect(listener).toHaveBeenCalledWith('HELLO');
  });

  it('applies multiple middleware in order', () => {
    const middleware1: Middleware<string> = (data, next) => {
      next(data + ' world');
    };
    const middleware2: Middleware<string> = (data, next) => {
      next(data.toUpperCase());
    };

    obs = new Observable<string>({ middleware: [middleware1, middleware2] });
    obs.subscribe(listener);

    obs.notify('hello');

    expect(listener).toHaveBeenCalledWith('HELLO WORLD');
  });

  it('can add middleware dynamically', () => {
    obs = new Observable<string>();
    obs.subscribe(listener);

    const middleware: Middleware<string> = (data, next) => {
      next(`[${data}]`);
    };

    obs.addMiddleware(middleware);
    obs.notify('test');

    expect(listener).toHaveBeenCalledWith('[test]');
  });

  it('can remove middleware', () => {
    const middleware: Middleware<string> = (data, next) => {
      next(data.toUpperCase());
    };

    obs = new Observable<string>();
    obs.addMiddleware(middleware);
    obs.subscribe(listener);

    obs.notify('before');

    const removed = obs.removeMiddleware(middleware);
    obs.notify('after');

    expect(removed).toBe(true);
    expect(listener).toHaveBeenNthCalledWith(1, 'BEFORE');
    expect(listener).toHaveBeenNthCalledWith(2, 'after');
  });

  it('returns false when removing non-existent middleware', () => {
    obs = new Observable<string>();
    const middleware: Middleware<string> = (data, next) => next(data);

    const removed = obs.removeMiddleware(middleware);

    expect(removed).toBe(false);
  });

  it('middleware can block notifications by not calling next', () => {
    const blockingMiddleware: Middleware<string> = (data, next) => {
      if (data === 'blocked') {
        // Don't call next
        return;
      }
      next(data);
    };

    obs = new Observable<string>({ middleware: [blockingMiddleware] });
    obs.subscribe(listener);

    obs.notify('allowed');
    obs.notify('blocked');
    obs.notify('also allowed');

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(1, 'allowed');
    expect(listener).toHaveBeenNthCalledWith(2, 'also allowed');
  });
});

describe('Observable - TypeScript Generics', () => {
  it('provides type safety for typed observables', () => {
    const stringObs = new Observable<string>();
    const numberObs = new Observable<number>();
    const objectObs = new Observable<TestState>();

    const stringListener: Listener<string> = (data) => {
      expect(typeof data).toBe('string');
    };

    const numberListener: Listener<number> = (data) => {
      expect(typeof data).toBe('number');
    };

    const objectListener: Listener<TestState> = (data) => {
      expect(data).toHaveProperty('count');
    };

    stringObs.subscribe(stringListener);
    numberObs.subscribe(numberListener);
    objectObs.subscribe(objectListener);

    stringObs.notify('test');
    numberObs.notify(42);
    objectObs.notify({ count: 1 });
  });
});

describe('Observable - Destroy', () => {
  it('clears all observers and state', () => {
    const obs = new Observable<TestState>({ initialState: { count: 0 } });
    const listener = jest.fn();

    obs.subscribe(listener);
    obs.destroy();

    expect(obs.getObserverCount()).toBe(0);
    expect(obs.getState()).toBeUndefined();

    obs.notify({ count: 1 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('clears middleware on destroy', () => {
    const middleware: Middleware<string> = (data, next) => next(data.toUpperCase());
    const obs = new Observable<string>({ middleware: [middleware] });
    const listener = jest.fn();

    obs.subscribe(listener);
    obs.destroy();
    obs.addMiddleware(middleware);
    obs.subscribe(listener);

    obs.notify('test');

    expect(listener).toHaveBeenCalledWith('TEST');
  });
});

describe('Observable - Integration Tests', () => {
  it('works as a state store similar to zustand', () => {
    interface Store {
      count: number;
      increment: () => void;
      decrement: () => void;
    }

    const createStore = (initialCount: number) => {
      const obs = new Observable<Store>({
        initialState: {
          count: initialCount,
          increment: () => {
            const state = obs.getState();
            if (state) {
              obs.setState({ ...state, count: state.count + 1 });
            }
          },
          decrement: () => {
            const state = obs.getState();
            if (state) {
              obs.setState({ ...state, count: state.count - 1 });
            }
          },
        },
      });
      return obs;
    };

    const store = createStore(0);
    const listener = jest.fn();

    store.subscribe(listener);

    const state = store.getState();
    state?.increment();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ count: 1 })
    );

    state?.increment();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ count: 2 })
    );

    state?.decrement();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ count: 1 })
    );
  });

  it('can be used for event bus pattern', () => {
    interface Event {
      type: string;
      payload: any;
    }

    const eventBus = new Observable<Event>();
    const loginListener = jest.fn();
    const logoutListener = jest.fn();

    eventBus.subscribe((event) => {
      if (event.type === 'LOGIN') {
        loginListener(event.payload);
      }
    });

    eventBus.subscribe((event) => {
      if (event.type === 'LOGOUT') {
        logoutListener(event.payload);
      }
    });

    eventBus.notify({ type: 'LOGIN', payload: { user: 'john' } });
    eventBus.notify({ type: 'LOGOUT', payload: { user: 'john' } });

    expect(loginListener).toHaveBeenCalledWith({ user: 'john' });
    expect(logoutListener).toHaveBeenCalledWith({ user: 'john' });
  });
});
