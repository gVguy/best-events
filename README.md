# best-events

Tiny strict-type-enabled event machine

## Why

Lets you strictly type your events and only fire and listen for events with specified names and sets of arguments

## Installation
```
npm i best-events
```

## Usage
```ts
import Events from 'best-events'

const events = new Events<{
  hello: (name: string) => void
  math: (a: number, b: number) => void
  suspence: () => Promise<void>
}>()

// ✅ OK
events.on('hello', (name) => console.log('hello ' + name))
events.fire('hello', 'world')

// ✅ OK
events.on('math', (a, b) => console.log(a + b))
events.fire('math', 1, 2)

// ✅ OK - ASYNC
events.on('suspence', async () => {
  await new Promise(res => setTimeout(res, 1000))
  console.log('bam')
})
events.fire('suspence')

// ❌ WRONG ARGUMENT TYPE
// Argument of type 'number' is not assignable to parameter of type 'string'
events.fire('hello', 1)

// ❌ NOT ENOUGH ARGUMENTS
// error: Expected 3 arguments, but got 2
events.fire('math', 1)

// ❌ TOO MUCH ARGUMENTS
// error: Argument of type '(name: any, lastName: any) => void' is not assignable to parameter of type '(name: string) => void'
events.on('hello', (name, lastName) => console.log('hello ' + name + lastName))

// ❌ UNKNOWN EVENT
// error: Argument of type '"howdy"' is not assignable to parameter of type '"hello" | "math"'
events.fire('howdy', 'world')

// ❌ WRONG TYPE IN LISTENER
// error: Property 'push' does not exist on type 'number'
events.on('math', (a, b) => a.push(b))
```

## Methods

```ts
// `on` to listen for event
events.on(eventName, eventHandler)

// `fire` to emit event
events.fire(eventName)

// `off` to remove a specific listener
events.off(eventName, eventHandler)

// `offAll` to remove all listeners
events.offAll(eventName)
```

## Usage without TS

Also supported but discouraged
```js
import Events from 'best-events'

const events = new Events()

events.on('hello', (name) => console.log('hello ' + name))

events.fire('hello', 'world')
```
