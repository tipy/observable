import { useObservable } from '../hooks/useObservable';
import { counterStore } from '../store/counterStore';
import styles from './CounterDisplay1.module.css';

export function CounterDisplay1() {
  const state = useObservable(counterStore);
  console.log('CounterDisplay1 rendered');

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

