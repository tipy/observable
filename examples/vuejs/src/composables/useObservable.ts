import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import Observable from '../../../../src/index';

/**
 * Custom Vue composable to subscribe to an Observable store
 * Automatically subscribes/unsubscribes based on component lifecycle
 */
export function useObservable<T>(observable: Observable<T>): Ref<T | undefined> {
  const state = ref<T | undefined>(observable.getState()) as Ref<T | undefined>;

  onMounted(() => {
    // Subscribe to changes
    const unsubscribe = observable.subscribe((newState) => {
      state.value = newState;
    });

    // Cleanup subscription on unmount
    onUnmounted(() => {
      unsubscribe();
    });
  });

  return state;
}

