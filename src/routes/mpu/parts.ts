import {Context} from "hono"

export default async function (c: Context) {
  const key = c.req.param('key')
  const uploadId = c.req.query('uploadId')
  const partNumber = c.req.query('partNumber')

  if (!uploadId || !partNumber) {
    return c.text('uploadId and partNumber are required', 400)
  }

  const multipartUpload = c.env.R2_BUCKET.resumeMultipartUpload(
    key,
    uploadId
  )

  const part = await c.req.blob()

  const uploaded = await multipartUpload.uploadPart(
    parseInt(partNumber),
    part
  )

  return new Response(JSON.stringify({
    etag: uploaded.etag
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
