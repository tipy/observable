# Getting Started

## Quick Start

1. **Install dependencies:**
   ```bash
   cd examples/reactjs
   pnpm install
   # or
   npm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open your browser:**
   - The dev server will show you the URL (usually `http://localhost:5173`)
   - You should see the counter example with two display components and control buttons

## What You'll See

- **Counter Display 1** (green) - Shows the current count
- **Counter Display 2** (blue) - Shows the same count (demonstrating shared state)
- **Counter Controls** (orange) - Two buttons to increase and decrease the count

Try clicking the buttons and watch both displays update simultaneously! This demonstrates how multiple components can share the same Observable store without prop drilling or Context API.

## Project Overview

This example demonstrates:

1. **Creating an Observable store** (`src/store/counterStore.ts`)
   - Initializing with state
   - Creating helper functions to update state

2. **Using a custom React hook** (`src/hooks/useObservable.ts`)
   - Subscribing to store changes
   - Automatic cleanup on unmount
   - Triggering re-renders when state changes

3. **Multiple components sharing state** (`src/components/`)
   - Two display components subscribing to the same store
   - One control component updating the store
   - All components stay in sync automatically

## Next Steps

- Modify the initial count in `src/store/counterStore.ts`
- Add more actions (reset, multiply, etc.)
- Create additional Observable stores for different state
- Explore middleware and error handling features

