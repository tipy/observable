# Observable

Observavle is a very tiny library to notify events to its subscribers.

Its main goal is to subscribe events to the instance of the observable class and then trigger the events themselves by calling `notify` function, check the section how to use it.


## Install

```bash
yarn add @tipy/observable
```

## How to use

It is quite simple, basically you first create an instance of the Observable class, then subscribe one or more events and excute notify function. let's see this in an example.

```javascript
import Observable from '@tipy/observable';

const obs = new Observable();

const test1 = () => console.log('test 1');
const test2 = () => console.log('test 2');

obs.subscribe(test1);
obs.subscribe(test2);

obs.notify();

// functions test1 and test2 will be called when notify is executed
// test 1
// test 2
```

## API

| Function name | Parameters | Description |
|-----|-----|-----|
| `subscribe` | `function(data?)` | you must pass a function to the subscriber. `data` is optional |
| `unsubscribe` | `function` | you must pass the function you want to unsubscribe |
| `notify` | `data?` | `data` is optional. if passed, it will pass along to the subscribed functions |
