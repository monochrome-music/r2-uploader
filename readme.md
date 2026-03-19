This is an example worker for the R2 Uploader, you can use the code in the `./dist` folder directly, or build the code yourself.

### Requirements

- Bun installed

### How to use

1. Clone this repository
   ```shell
   git clone https://github.com/jw-12138/r2-uploader-example-worker.git
   ```
2. Install the dependencies
   ```shell
   bun install
   ```
   
3. Edit `wrangler.toml`, change `r2_buckets -> bucket_name` to your own bucket name

4. Deploy the code
   ```shell
   bun run deploy
   ```
5. Push your API key
   ```shell
   npx wrangler secret put AUTH_KEY_SECRET
   ```

   This command will prompt you input the value, press `Enter` to confirm.

And that's it, your worker is now ready to be used in R2 Uploader.

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/:key` | Get file |
| GET | `/support_mpu` | Check multipart upload support |
| PATCH | `/` | List all files |
| PUT | `/:key` | Upload file |
| POST | `/mpu/create/:key` | Start multipart upload |
| PUT | `/mpu/:key` | Upload part |
| DELETE | `/mpu/:key` | Abort multipart upload |
| POST | `/mpu/complete/:key` | Complete multipart upload |
