import Observable from './index';

let obs: Observable;
const test1 = jest.fn();
const test2 = jest.fn();

describe('Observable tests', () => {
  beforeEach(() => {
    obs = new Observable();
    jest.clearAllMocks();
  });

  it('notifies the events subscribed to it', () => {
    obs.subscribe(test1);
    obs.subscribe(test2);

    obs.notify();

    expect(test1).toHaveBeenCalled();
    expect(test2).toHaveBeenCalled();
  });

  it('unsubscribes 1 events and notify the other', () => {
    obs.subscribe(test1);
    obs.subscribe(test2);

    obs.unsubscribe(test2);

    obs.notify();

    expect(test1).toHaveBeenCalled();
    expect(test2).not.toHaveBeenCalled();
  });
});
