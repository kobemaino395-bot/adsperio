# One-Time Download Tokens

This system implements secure, one-time-use download URLs for file downloads.

## How It Works

### User Flow

1. User receives a permanent download link: `/d/abc-def`
2. When accessed, the system:
   - Generates a unique one-time token (e.g., `xJ4kL9mN2pQ5rT8v`)
   - Redirects to `/dt/xJ4kL9mN2pQ5rT8v`
3. The token URL:
   - Can only be used once
   - Expires after 1 hour
   - Is automatically deleted after use

### Benefits

- **Prevents link sharing**: Each token works only once
- **Secure**: Tokens are cryptographically random (24 bytes, base64url-encoded)
- **Time-limited**: Tokens expire after 1 hour
- **Self-cleaning**: Expired tokens are automatically removed

## Architecture

### Components

1. **Token Registry** (`src/server/download-tokens.ts`)
   - Stores active tokens with their associated slot slugs
   - File-based storage using atomic JSON writes
   - In-memory caching for performance

2. **Routes**
   - `/d/[slug]` - Permanent link that generates tokens
   - `/dt/[token]` - One-time download endpoint
   - `/api/download-token` - API to generate tokens programmatically

3. **Cleanup**
   - Automatic cleanup on each download request (fire-and-forget)
   - Manual cleanup endpoint: `/api/cleanup-tokens`

### Token Format

- **Length**: 32 characters
- **Encoding**: base64url (URL-safe)
- **Randomness**: 24 bytes from crypto.randomBytes()
- **Example**: `xJ4kL9mN2pQ5rT8vW1yZ3aB4cD5eF6g`

### Security Features

1. **Cryptographically secure random tokens**
2. **One-time use** - token is deleted after consumption
3. **Time-limited** - expires after 1 hour
4. **No token reuse** - even if intercepted, cannot be reused
5. **Rate limiting** - existing cooldown system still applies

## API Reference

### Generate Token

```typescript
POST /api/download-token
Content-Type: application/json

{
  "slug": "abc-def"
}

Response:
{
  "token": "xJ4kL9mN2pQ5rT8vW1yZ3aB4cD5eF6g",
  "url": "/dt/xJ4kL9mN2pQ5rT8vW1yZ3aB4cD5eF6g"
}
```

### Cleanup Expired Tokens

```typescript
GET /api/cleanup-tokens

Response:
{
  "removed": 5  // number of expired tokens removed
}
```

## Server-Side Usage

```typescript
import { createDownloadToken, consumeDownloadToken } from '@/server/download-tokens';

// Generate a token
const token = await createDownloadToken('abc-def');
// Returns: "xJ4kL9mN2pQ5rT8vW1yZ3aB4cD5eF6g"

// Consume a token (returns slug or null)
const slug = await consumeDownloadToken(token);
if (slug) {
  // Token is valid, proceed with download
  // Token is now deleted and cannot be reused
} else {
  // Token is invalid, expired, or already used
}
```

## Storage

Tokens are stored in:
```
data/download-tokens.json
```

Format:
```json
[
  {
    "token": "xJ4kL9mN2pQ5rT8vW1yZ3aB4cD5eF6g",
    "slug": "abc-def",
    "createdAt": "2026-08-05T10:30:00.000Z",
    "expiresAt": "2026-08-05T11:30:00.000Z"
  }
]
```

## Configuration

Default expiration time: 1 hour (3600000 ms)

To customize:
```typescript
const token = await createDownloadToken('abc-def', 30 * 60 * 1000); // 30 minutes
```

## Maintenance

### Automated Cleanup

Expired tokens are automatically cleaned up:
- On every download request (fire-and-forget)
- Via scheduled cron job hitting `/api/cleanup-tokens`

### Manual Cleanup

To manually trigger cleanup:
```bash
curl https://yoursite.com/api/cleanup-tokens
```

## Migration Notes

This change is backward compatible:
- Old `/d/[slug]` URLs still work, they just redirect through a token
- Existing downloads are unaffected
- No database migration needed
