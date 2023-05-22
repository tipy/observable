class Observable {
  private observers: ((data?: any) => void)[] = [];

  subscribe(func: (data?: any) => void): void {
    this.observers?.push?.(func);
  }

  unsubscribe(func: () => void): void {
    this.observers = this.observers?.filter?.((observer) => observer !== func);
  }

  notify(data?: any): void {
    this.observers?.forEach?.((observer) => observer(data));
  }
}

export default Observable;
