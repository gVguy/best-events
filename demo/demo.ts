import { Events } from '../src/main'

const events = new Events<{
  hello: (name: string) => void
  math: (a: number, b: number) => void
}>()

events.on('hello', (name) => console.log('hello ' + name))
events.fire('hello', 'world')

events.on('math', (a, b) => console.log(a + b))
events.fire('math', 1, 2)
