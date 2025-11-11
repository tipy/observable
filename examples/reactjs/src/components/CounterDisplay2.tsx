import { useObservable } from '../hooks/useObservable';
import { counterStore } from '../store/counterStore';
import styles from './CounterDisplay2.module.css';

export function CounterDisplay2() {
  const state = useObservable(counterStore);
  console.log('CounterDisplay2 rendered');

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Counter Display 2
      </h3>
      <p className={styles.count}>
        Count: {state?.count ?? 0}
      </p>
    </div>
  );
}

