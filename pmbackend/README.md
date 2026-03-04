# PMBackend

Shared file-storage backend for both `pmarketplace` and `pmhub` backends.

It stores:
- Images
- `.phar` files
- Any other binary files

It returns a stable `fileId`, plus URL(s) both backends can save in their own DBs.

## 1) Setup

```bash
cd /Users/liviu/Projects/pmarketplace/pmarketplace/pmbackend
npm install
cp .env.example .env
```

Update `.env`:
- `PMBACKEND_API_KEYS` with one or more long random keys (comma-separated).
- `PMBACKEND_STORAGE_ROOT` to an absolute path.
- `DB_*` to the MySQL database used by your platform.

## 2) MySQL table

Run this in MySQL:

```sql
SOURCE /Users/liviu/Projects/pmarketplace/pmarketplace/pmbackend/sql/20260304_create_asset_files.sql;
```

Or paste the SQL content manually in your SQL editor.

## 3) Start service

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3010/health
```

## 4) API

### Upload

`POST /api/storage/upload` (raw body)

Required headers:
- `x-pmbackend-key: <API_KEY>`
- `x-file-name: MyPlugin.phar`

Optional headers:
- `x-file-kind: image | phar | any` (default `any`)
- `x-file-visibility: public | private` (default `public`)
- `x-file-bucket: plugins|media|anything` (default `default`)
- `x-source-app: pmarketplace | pmhub | anything`
- `content-type: <mime>`

Example:

```bash
curl -X POST "http://localhost:3010/api/storage/upload" \
  -H "x-pmbackend-key: YOUR_KEY" \
  -H "x-file-name: EasyEdit.phar" \
  -H "x-file-kind: phar" \
  -H "x-file-visibility: private" \
  -H "x-file-bucket: plugins" \
  -H "x-source-app: pmarketplace" \
  -H "content-type: application/octet-stream" \
  --data-binary "@/absolute/path/EasyEdit.phar"
```

Response:
- `fileId`
- `url` (only when public)
- `downloadUrl`
- metadata fields

### Metadata

`GET /api/storage/:fileId`

- Public files: no key needed
- Private files: pass `x-pmbackend-key`

### Download

`GET /api/storage/:fileId/download`

- Public files: no key needed
- Private files: pass `x-pmbackend-key`
- Optional query `?download=1` for attachment behavior

### Delete

`DELETE /api/storage/:fileId` (requires key)

## 5) Reference from PMarketplace/PMHub backends

Store these env vars in each backend:

```env
PMBACKEND_URL=http://localhost:3010
PMBACKEND_API_KEY=YOUR_KEY
```

Node upload helper (same code can be used in both backends):

```js
async function uploadToPmbackend({
  buffer,
  fileName,
  kind = 'any',
  visibility = 'public',
  bucket = 'default',
  sourceApp = 'pmarketplace'
}) {
  const res = await fetch(`${process.env.PMBACKEND_URL}/api/storage/upload`, {
    method: 'POST',
    headers: {
      'x-pmbackend-key': process.env.PMBACKEND_API_KEY,
      'x-file-name': encodeURIComponent(fileName),
      'x-file-kind': kind,
      'x-file-visibility': visibility,
      'x-file-bucket': bucket,
      'x-source-app': sourceApp,
      'content-type': 'application/octet-stream'
    },
    body: buffer
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message || 'PMBackend upload failed')
  }

  return data
}
```

Then save in your app DB:
- `fileId` for stable reference
- `url` for public display (images)
- or `downloadUrl` for protected/private files
