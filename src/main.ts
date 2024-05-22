export default class Events<EventList extends EventListBase> {

  private _events: EventArrays<EventList>

  constructor() {
    this._events = {} as EventArrays<EventList>
  }

  on<E extends EventName<EventList>>(eventName: E, cb: EventCallback<EventList, E>) {
    if (!this._events[eventName]) {
      this._events[eventName] = []
    }
    this._events[eventName].push(cb)
    return () => this.off(eventName, cb)
  }

  off<E extends EventName<EventList>>(eventName: E, cb: EventCallback<EventList, E>) {
    if (!this._events[eventName]) return
    const idx = this._events[eventName].findIndex(c => c === cb)
    if (idx < 0) return
    this._events[eventName].splice(idx, 1)
  }

  offAll<E extends EventName<EventList>>(eventName: E) {
    if (!this._events[eventName]) return
    this._events[eventName] = []
  }

  fire<E extends EventName<EventList>>(eventName: E, ...args: Parameters<EventCallback<EventList, E>>) {
    if (!this._events[eventName]) return
    this._events[eventName].forEach(cb => (cb as (...a: typeof args) => unknown)(...args))
  }

}


type EventArrays<EventList extends EventListBase> = {
  [E in keyof EventList]: EventCallback<EventList, E>[]
}
type EventName<EventList extends EventListBase> = keyof EventList

type EventListCallbackNotation = Record<string, (...args: any[]) => unknown>
type EventListArrayNotation = Record<string, any[]>
type EventListBase = EventListCallbackNotation|EventListArrayNotation

type EventCallback<EventList extends EventListBase, E extends keyof EventList> =
  EventList extends EventListCallbackNotation
    ? EventList[E]
    : EventList extends EventListArrayNotation
      ? (...args: EventList[E]) => void
      : null
