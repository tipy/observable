<script setup lang="ts">
import { useObservable } from '../composables/useObservable';
import { counterStore } from '../store/counterStore';

const state = useObservable(counterStore);

console.log('CounterDisplay1 rendered');
</script>

<template>
  <div :class="$style.container">
    <h3 :class="$style.title">
      Counter Display 1
    </h3>
    <p :class="$style.count">
      Count: {{ state?.count ?? 0 }}
    </p>
  </div>
</template>

<style module>
.container {
  padding: 20px;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background-color: #f0f9f0;
  margin: 10px 0;
}

.title {
  margin: 0 0 10px 0;
  color: #2e7d32;
}

.count {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}
</style>

