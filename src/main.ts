export default class Events<EventList extends { [key: string]: (...args: any[]) => unknown }> {

  _events: EventArrays<EventList>

  constructor() {
    this._events = {} as EventArrays<EventList>
  }

  on<E extends EventName<EventList>>(eventName: E, cb: EventList[E]) {
    if (!this._events[eventName]) {
      this._events[eventName] = []
    }
    this._events[eventName].push(cb)
  }

  off<E extends EventName<EventList>>(eventName: E, cb: EventList[E]) {
    try {
      if (!this._events[eventName]) throw `could not remove listener for event \`${eventName as string}\` because event doesn't exist`
      const idx = this._events[eventName].findIndex(c => c === cb)
      if (idx < 0) throw `could not remove listener for event \`${eventName as string}\` because listener doesn't exist`
      this._events[eventName].splice(idx, 1)
    } catch (e) {
      console.warn(e)
    }
  }

  offAll<E extends EventName<EventList>>(eventName: E) {
    try {
      if (!this._events[eventName]) throw `could not remove listeners for event \`${eventName as string}\` because event doesn't exist`
      this._events[eventName] = []
    } catch (e) {
      console.warn(e)
    }
  }

  fire<E extends EventName<EventList>>(eventName: E, ...args: Parameters<EventList[E]>) {
    try {
      if (!this._events[eventName]) throw `event ${eventName as string} was fired but not a single listener is assigned`
      this._events[eventName].forEach(cb => (cb as (...a: typeof args) => unknown)(...args))
    } catch (e) {
      console.warn(e)
    }
  }

}


type EventArrays<EventList> = { [key in keyof EventList]: EventList[key][] }
type EventName<EventList> = keyof EventList