<script setup lang="ts">
import { useObservable } from '../composables/useObservable';
import { counterStore } from '../store/counterStore';

const state = useObservable(counterStore);

console.log('CounterDisplay2 rendered');
</script>

<template>
  <div :class="$style.container">
    <h3 :class="$style.title">
      Counter Display 2
    </h3>
    <p :class="$style.count">
      Count: {{ state?.count ?? 0 }}
    </p>
  </div>
</template>

<style module>
.container {
  padding: 20px;
  border: 2px solid #2196F3;
  border-radius: 8px;
  background-color: #e3f2fd;
  margin: 10px 0;
}

.title {
  margin: 0 0 10px 0;
  color: #1565c0;
}

.count {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}
</style>

