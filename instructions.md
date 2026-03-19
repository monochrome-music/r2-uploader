# R2 Uploader Frontend Integration Guide

## Worker Setup

**Endpoint:** `PUT https://your-worker.your-subdomain.workers.dev/:filename`

**Required Headers:**
- `x-api-key: YOUR_AUTH_KEY_SECRET`
- `Content-Type: application/octet-stream` (or file's MIME type)

---

## How It Works

1. Client sends file via PUT request with API key header
2. Worker validates API key
3. Worker prefixes filename with random 8-char string (e.g., `a1b2c3d4-file.png`)
4. Worker rejects files over 10MB
5. Worker returns the prefixed key to client

---

## Response Formats

**Success (200):**
```
a1b2c3d4-original-filename.ext
```

**Errors:**
- `400` - No filename
- `401` - Invalid/missing API key
- `413` - File exceeds 10MB

---

## Configuration Checklist

1. Set `AUTH_KEY_SECRET` in Cloudflare Workers secrets
2. Configure R2 bucket binding in worker settings
3. Set bucket name in wrangler.toml
4. Update CORS settings if needed

---

## Security Notes

- API key is required for all uploads
- Keys should be stored in environment variables, never in frontend code
- Consider using a backend proxy to hide API key from clients
