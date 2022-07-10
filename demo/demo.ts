import Events from '../src/main'

const events = new Events<{
  hello: (name: string) => void
  math: (a: number, b: number) => void
  suspence: () => Promise<void>
}>()

events.on('hello', (name) => console.log('hello ' + name))
events.fire('hello', 'world')

events.on('math', (a, b) => console.log(a + b))
events.fire('math', 1, 2)

events.on('suspence', async () => {
  await new Promise(res => setTimeout(res, 1000))
  console.log('bam')
})
events.fire('suspence')
