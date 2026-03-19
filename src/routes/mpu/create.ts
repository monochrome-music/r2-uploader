import {Context} from "hono"

export default async function (c: Context) {
  const key = c.req.param('key')

  if (!key) {
    return c.text('file name is required', 400)
  }

  const upload = await c.env.R2_BUCKET.createMultipartUpload(key)

  return c.json({
    uploadId: upload.uploadId,
    key: key
  })
}
