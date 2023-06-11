class Observable {
  private observers: ((data?: any) => void | unknown)[] = [];

  subscribe(func: (data?: any) => void | unknown): void {
    this.observers?.push?.(func);
  }

  unsubscribe(func: (data?: any) => void | unknown): void {
    this.observers = this.observers?.filter?.((observer) => observer !== func);
  }

  notify(data?: any): void {
    this.observers?.forEach?.((observer) => observer(data));
  }
}

export default Observable;
