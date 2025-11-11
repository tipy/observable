<script setup lang="ts">
import { increment, decrement } from '../store/counterStore';

console.log('CounterControls rendered');
</script>

<template>
  <div :class="$style.container">
    <button
      @click="decrement"
      :class="[$style.button, $style.decreaseButton]"
    >
      - Decrease
    </button>
    <button
      @click="increment"
      :class="[$style.button, $style.increaseButton]"
    >
      + Increase
    </button>
  </div>
</template>

<style module>
.container {
  padding: 20px;
  border: 1px solid #f3f3f3;
  border-radius: 8px;
  background-color: #fafafa;
  margin: 10px 0;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.button {
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.decreaseButton {
  background-color: #f44336;
}

.decreaseButton:hover {
  background-color: #d32f2f;
}

.increaseButton {
  background-color: #4CAF50;
}

.increaseButton:hover {
  background-color: #388e3c;
}
</style>

