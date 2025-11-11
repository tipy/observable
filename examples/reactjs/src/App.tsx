import { CounterDisplay1 } from './components/CounterDisplay1';
import { CounterDisplay2 } from './components/CounterDisplay2';
import { CounterControls } from './components/CounterControls';
import styles from './App.module.css';

function App() {
  console.log('App rendered');
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        @tipy/observable React Example
      </h1>
      
      <p className={styles.description}>
        Two components sharing the same counter state using Observable
      </p>

      <CounterDisplay1 />
      <CounterDisplay2 />
      <CounterControls />

      <div className={styles.info}>
        <strong>How it works:</strong>
        <ul>
          <li>Both display components subscribe to the same Observable store</li>
          <li>When you click increase/decrease, the store updates</li>
          <li>All subscribed components automatically re-render with new state</li>
          <li>No prop drilling or context providers needed!</li>
        </ul>
      </div>
    </div>
  );
}

export default App;

