# Getting Started

## Quick Start

1. **Install dependencies:**
   ```bash
   cd examples/vuejs
   yarn install
   # or
   npm install
   ```

2. **Start the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

3. **Open your browser:**
   - The dev server will show you the URL (usually `http://localhost:5173`)
   - You should see the counter example with two display components and control buttons

## What You'll See

- **Counter Display 1** (green) - Shows the current count
- **Counter Display 2** (blue) - Shows the same count (demonstrating shared state)
- **Counter Controls** (neutral) - Two buttons to increase and decrease the count

Try clicking the buttons and watch both displays update simultaneously! This demonstrates how multiple components can share the same Observable store without prop drilling or provide/inject.

## Project Overview

This example demonstrates:

1. **Creating an Observable store** (`src/store/counterStore.ts`)
   - Initializing with state
   - Creating helper functions to update state

2. **Using a custom Vue composable** (`src/composables/useObservable.ts`)
   - Subscribing to store changes
   - Automatic cleanup on unmount
   - Triggering re-renders when state changes

3. **Multiple components sharing state** (`src/components/`)
   - Two display components subscribing to the same store
   - One control component updating the store
   - All components stay in sync automatically

4. **CSS Modules in Vue**
   - Using `<style module>` for scoped styles
   - Accessing styles with `:class="$style.className"`
   - Same pattern as React's CSS modules

## Vue-Specific Notes

- This example uses Vue 3's **Composition API** with `<script setup>`
- The `useObservable` composable is Vue's equivalent of React's `useObservable` hook
- CSS Modules in Vue use `<style module>` and are accessed with `$style`
- Vue's reactivity system automatically updates the UI when refs change

## Next Steps

- Modify the initial count in `src/store/counterStore.ts`
- Add more actions (reset, multiply, etc.)
- Create additional Observable stores for different state
- Explore middleware and error handling features
- Try using the same store in multiple pages/views

