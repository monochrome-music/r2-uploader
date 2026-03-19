import {Hono} from 'hono'
import {cors} from 'hono/cors'

import Put from './routes/put'

import checkHeader from "./middleware/checkHeader"

interface Env {
  Bindings: {
    R2_BUCKET: R2Bucket
  }
}

const app = new Hono<Env>()

app.use(cors())
app.get('/', (c) => c.text('Hello R2! v2025.01.13'))
app.use('*', checkHeader)

app.put('/:key{.*}', Put)

app.all('*', c => {
  return c.text('404 Not Found')
})

export default app
