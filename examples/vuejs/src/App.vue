<script setup lang="ts">
import CounterDisplay1 from './components/CounterDisplay1.vue';
import CounterDisplay2 from './components/CounterDisplay2.vue';
import CounterControls from './components/CounterControls.vue';

console.log('App rendered');
</script>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">
      @tipy/observable Vue Example
    </h1>
    
    <p :class="$style.description">
      Two components sharing the same counter state using Observable
    </p>

    <CounterDisplay1 />
    <CounterDisplay2 />
    <CounterControls />

    <div :class="$style.info">
      <strong>How it works:</strong>
      <ul>
        <li>Both display components subscribe to the same Observable store</li>
        <li>When you click increase/decrease, the store updates</li>
        <li>All subscribed components automatically re-render with new state</li>
        <li>No prop drilling or provide/inject needed!</li>
      </ul>
    </div>
  </div>
</template>

<style module>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.info {
  margin-top: 30px;
  padding: 15px;
  background-color: #fafafa;
  border: 1px solid #f3f3f3;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.info strong {
  font-weight: 600;
}

.info ul {
  margin-top: 10px;
  padding-left: 20px;
}

.info li {
  margin-bottom: 5px;
}
</style>

