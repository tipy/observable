import { useEffect, useState } from 'react';
import Observable from '@tipy/observable';

/**
 * Custom React hook to subscribe to an Observable store
 * Automatically subscribes/unsubscribes based on component lifecycle
 */
export function useObservable<T>(observable: Observable<T>): T | undefined {
  const [state, setState] = useState<T | undefined>(observable.getState());

  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = observable.subscribe((newState) => {
      setState(newState);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [observable]);

  return state;
}
