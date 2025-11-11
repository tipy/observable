# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - Current Release

### Added
- Full TypeScript support with generics for type-safe observables
- State management capabilities (`getState()`, `setState()`)
- `once()` method for one-time subscriptions
- `clear()` method to remove all subscribers
- `hasObservers()` to check if any observers are subscribed
- `getObserverCount()` to get the number of active observers
- `pause()` and `resume()` for controlling notifications
- `isPaused()` to check pause state
- Middleware support for intercepting and transforming notifications
- `addMiddleware()` and `removeMiddleware()` for dynamic middleware management
- `destroy()` method for cleanup
- Custom error handlers via `onError` option
- Built-in error handling that prevents observer errors from crashing other observers
- `notifyImmediately` option in `subscribe()` to immediately notify with current state
- Comprehensive JSDoc documentation for all public methods
- Exported TypeScript types: `Listener`, `Unsubscribe`, `ErrorHandler`, `Middleware`, `ObservableOptions`
- Comprehensive test suite covering all features
- Detailed README with examples and API documentation
- EXAMPLES.md with practical use cases and patterns
- React and Vue integration examples

### Changed
- **BREAKING**: `subscribe()` now returns an unsubscribe function instead of void
- **BREAKING**: Changed from Array to Set for storing observers (prevents duplicate subscriptions)
- **BREAKING**: Observer type changed from `(data?: any) => void | unknown` to `Listener<T>`
- Enhanced error handling with automatic catching of observer errors
- Improved TypeScript types and removed usage of `any` in favor of generics
- Updated README with comprehensive documentation
- Enhanced package.json with better metadata and keywords

### Fixed
- Memory leak prevention by using Set for observers
- Type safety issues with `any` types

## [1.0.3] - Previous Release

### Features
- Basic Observable pattern with subscribe, unsubscribe, and notify
- Simple event notification system
- Optional data passing to subscribers

[1.1.0]: https://github.com/tipy/observable/releases/tag/v1.1.0
[1.0.3]: https://github.com/tipy/observable/releases/tag/v1.0.3

