import {Context} from "hono"

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024

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
  
  const currentSize = parseInt(await c.env.UPLOAD_SIZES.get(uploadId) || '0')
  const newSize = currentSize + part.size

  if (newSize > MAX_UPLOAD_SIZE) {
    return c.text(`Upload exceeds 10MB limit (current: ${currentSize}, part: ${part.size})`, 413)
  }

  await c.env.UPLOAD_SIZES.put(uploadId, newSize.toString())

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
