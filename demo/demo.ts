import Events from '../src/main'

const events = new Events<{
  hello: (name: string) => void
  math: (a: number, b: number) => void
}>()

const events2 = new Events<{
  hello: [name: string]
  math: [number, number]
}>()


const onMath = (a: number, b: number) => console.log(a + b)

events.on('hello', (name) => console.log('hello ' + name))
events.fire('hello', 'world')

events.on('math', onMath)
events.fire('math', 1, 2)


const offHello = events2.on('hello', (name) => console.log('hello ' + name))
events2.fire('hello', 'world')

events2.on('math', onMath)
events2.fire('math', 1, 2)

offHello()
events2.fire('hello', 'this should not print')

events2.off('math', onMath)
events2.fire('math', 100, 100)
