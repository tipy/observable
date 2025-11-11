import Observable from '../../../../src/index';

interface CounterState {
  count: number;
}

// Create a shared observable store with initial state
export const counterStore = new Observable<CounterState>({
  initialState: { count: 0 }
});

// Helper functions to update the counter
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

