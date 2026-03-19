import {Context} from "hono"

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export default async function (c: Context) {
  const key = c.req.param('key')
  const file = await c.req.blob()
  const bucket = c.env.R2_BUCKET as R2Bucket

  if (!key) {
    return c.text('file name is required', 400)
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return c.text('File too large. Maximum size is 10MB', 413)
  }

  const prefixedKey = `${generateId()}-${key}`

  await bucket.put(prefixedKey, file, {
    httpMetadata: {
      contentType: file.type
    }
  })

  return c.text(prefixedKey)
}
