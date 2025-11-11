import { increment, decrement } from '../store/counterStore';
import styles from './CounterControls.module.css';

export function CounterControls() {
  console.log('CounterControls rendered');
  return (
    <div className={styles.container}>
      <button
        onClick={decrement}
        className={`${styles.button} ${styles.decreaseButton}`}
      >
        - Decrease
      </button>
      <button
        onClick={increment}
        className={`${styles.button} ${styles.increaseButton}`}
      >
        + Increase
      </button>
    </div>
  );
}

