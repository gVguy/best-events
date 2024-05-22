# best-events

Tiny strict-type-enabled event machine

## Why

Lets you strictly type your events and only fire and listen for events with specified names and sets of arguments

## Installation
```
npm i best-events
```

## Usage

#### Import the class
```ts
import Events from 'best-events'
```

#### Provide type annotations
Event types should be provided as a generic when instantiating the class.

The generic type should provide a map of all possible events, where key is the event's name and value is its callback:
```ts
const events = new Events<{
  hello: (name: string) => void
  math: (a: number, b: number) => void
}>()
```

It's also possible to use tuple types for callbacks, which is less verbose:
```ts
const events = new Events<{
  hello: [name: string] // provide argument names for intellisense
  math: [number, number] // or keep them anonymous
}>()
```

#### Fire and Listen the events
With enabled type safety:
```ts
// ✅ OK
events.on('hello', (name) => console.log('hello ' + name))
events.fire('hello', 'world')

// ✅ OK
events.on('math', (a, b) => console.log(a + b))
events.fire('math', 1, 2)

// ❌ WRONG ARGUMENT TYPE
// Argument of type 'number' is not assignable to parameter of type 'string'
events.fire('hello', 1)

// ❌ NOT ENOUGH ARGUMENTS
// Expected 3 arguments, but got 2
events.fire('math', 1)

// ❌ TOO MANY ARGUMENTS
// Argument of type '(name: any, lastName: any) => void' is not assignable to parameter of type '(name: string) => void'
events.on('hello', (name, lastName) => console.log('hello ' + name + lastName))

// ❌ UNKNOWN EVENT
// Argument of type '"howdy"' is not assignable to parameter of type '"hello" | "math"'
events.fire('howdy', 'world')

// ❌ WRONG TYPE IN LISTENER
// Property 'push' does not exist on type 'number'
events.on('math', (a, b) => a.push(b))
```

## Methods

#### `on` to listen to the event
```ts
const myEventHandler = (value: string) => console.log(value)
events.on('myEvent', myEventHandler)
```
`on` returns an "off" function, which can be used as an alternative to the [`off` method](#off-to-remove-a-specific-listener):
```ts
const offMyEvent = events.on('myEvent', (value) => console.log(value))
offMyEvent()
```
#### `fire` to emit the event
```ts
events.fire('myEvent', 'Some value')
```

#### `off` to remove a specific listener
```ts
events.off('myEvent', myEventHandler)
```

#### `offAll` to remove all listeners
(Use this one with caution, you might remove the event listener that was assigned elsewhere)
```ts
events.offAll('myEvent')
```

## Usage without TS

Also supported but discouraged
```js
import Events from 'best-events'

const events = new Events()

events.on('hello', (name) => console.log('hello ' + name))

events.fire('hello', 'world')
```
