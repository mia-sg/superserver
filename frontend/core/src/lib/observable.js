export default class Observable {

    constructor()
    {
        this.observe(this);
    }
    observe(obj) {
      const subscribers = new Map();
  
      const notifySubscribers = (prop, newValue, oldValue) => {
        if (subscribers.has(prop)) {
          subscribers.get(prop).forEach(callback => callback(newValue, oldValue));
        }
      };
  
      const handler = {
        get(target, prop, receiver) {
          const value = Reflect.get(target, prop, receiver);
          if (typeof value === 'object' && value !== null) {
            return this.observe(value); // recursively observe nested objects
          }
          return value;
        },
        set(target, prop, newValue, receiver) {
          const oldValue = Reflect.get(target, prop, receiver);
          if (oldValue !== newValue) {
            Reflect.set(target, prop, newValue, receiver);
            notifySubscribers(prop, newValue, oldValue); // notify subscribers about the change
          }
          return true;
        },
      };
  
      const observable = new Proxy(obj, handler);
  
      observable.subscribe = (prop, callback) => {
        if (!subscribers.has(prop)) {
          subscribers.set(prop, new Set());
        }
        subscribers.get(prop).add(callback);
      };
  
      return observable;
    }
}