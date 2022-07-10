import Events from '../src/main'

const events = new Events<{
  hello: (name: string) => void
  math: (a: number, b: number) => void
  suspence: () => Promise<void>
}>()


const helloHandler = (name: string) => console.log('hello ' + name)

events.on('hello', helloHandler)
events.fire('hello', 'world')


events.on('math', (a, b) => console.log(a + b))
events.fire('math', 1, 2)


events.on('suspence', async () => {
  await new Promise(res => setTimeout(res, 1000))
  console.log('bam')
})
events.fire('suspence')


events.off('hello', helloHandler)

events.fire('hello', 'friend') // shouldn't do anything, because listener was off'ed
