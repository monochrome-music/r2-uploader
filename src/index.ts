import {Hono} from 'hono'
import {cors} from 'hono/cors'

import Get from './routes/get'
import Patch from './routes/patch'
import Put from './routes/put'

import MpuCreate from './routes/mpu/create'
import MpuParts from './routes/mpu/parts'
import MpuAbort from './routes/mpu/abort'
import MpuComplete from './routes/mpu/complete'
import MpuSupport from './routes/mpu/support'

import checkHeader from "./middleware/checkHeader"

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024

interface Env {
  Bindings: {
    R2_BUCKET: R2Bucket
    UPLOAD_LIMITER: Ratelimit
    READ_LIMITER: Ratelimit
    UPLOAD_SIZES: KVNamespace
  }
}

const app = new Hono<Env>()

app.use(cors())
app.get('/support_mpu', MpuSupport)
app.get('/', (c) => c.text('Hello R2! v2025.01.13'))
app.use('*', checkHeader)

app.use('*', async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') || 'anonymous'
  const path = new URL(c.req.url).pathname
  const isWrite = ['PUT', 'POST', 'DELETE', 'PATCH'].includes(c.req.method)

  const limiter = isWrite ? c.env.UPLOAD_LIMITER : c.env.READ_LIMITER
  const { success } = await limiter.limit({ key: ip })

  if (!success) {
    return c.json({ error: 'Rate limit exceeded' }, 429)
  }

  await next()
})

// multipart upload operations
app.post('/mpu/create/:key{.*}', MpuCreate)
app.put('/mpu/:key{.*}', MpuParts)
app.delete('/mpu/:key{.*}', MpuAbort)
app.post('/mpu/complete/:key{.*}', MpuComplete)

// normal r2 operations
app.get('/:key{.*}', Get)
app.patch('/', Patch)
app.put('/:key{.*}', Put)

app.all('*', c => {
  return c.text('404 Not Found')
})

export default app
