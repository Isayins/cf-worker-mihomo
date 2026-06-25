# baiqi-cf-worker-mihomo

Cloudflare Worker VLESS/WS/TLS subscription script with a built-in Mihomo provider endpoint.

This package is a cleaned publishing copy. It contains no Cloudflare account ID, token, KV namespace ID, custom domain, UUID, or private credential.

## Files

- `worker.js` - Worker script.
- `calc-token.js` - Local helper for calculating subscription tokens.
- `wrangler.toml.example` - Wrangler deploy template.
- `config.example.json` - Optional KV `config.json` example.
- `ADD.example.txt` - Optional KV `ADD.txt` preferred-IP source example.
- `LICENSE` - Upstream Apache-2.0 license.

## Required Cloudflare bindings

Create one KV namespace and bind it as `KV`.

Set these Worker variables:

| Name | Required | Example | Notes |
|---|---:|---|---|
| `UUID` | yes | `00000000-0000-4000-8000-000000000000` | VLESS UUID. Generate your own. |
| `ADMIN` or `KEY` | yes | `change-me-admin-password` | Admin password and fallback secret. |
| `NEW_IP` | no | `true` | Keeps the Worker using the newer IP behavior used by this package. |

Do not commit real UUIDs, admin passwords, API tokens, account IDs, or namespace IDs.

## Deploy

1. Copy the template:

```powershell
Copy-Item wrangler.toml.example wrangler.toml
```

2. Edit `wrangler.toml`:

```toml
name = "your-worker-name"
kv_namespaces = [
  { binding = "KV", id = "your-kv-namespace-id" }
]

[vars]
UUID = "your-vless-uuid"
ADMIN = "your-admin-password"
KEY = "your-admin-password"
NEW_IP = "true"
```

3. Deploy:

```powershell
npx wrangler deploy
```

Recommended GitHub repository contents:

```text
worker.js
calc-token.js
README.md
LICENSE
wrangler.toml.example
config.example.json
ADD.example.txt
.gitignore
```

## Usage

The subscription token is:

```text
MD5MD5(<worker-host> + <UUID>)
```

Calculate it locally:

```powershell
node calc-token.js your-worker-name.your-subdomain.workers.dev your-vless-uuid
```

For the default Worker domain, `<worker-host>` is like:

```text
your-worker-name.your-subdomain.workers.dev
```

For a custom domain, use the custom host, for example:

```text
sub.example.com
```

Endpoints:

```text
https://<worker-host>/mihomo?token=<subscription-token>&count=100
https://<worker-host>/sub?token=<subscription-token>
```

Debug endpoint:

```text
https://<worker-host>/mihomo?token=<subscription-token>&count=1024&debug=1&refresh=1
```

Expected debug fields:

- `total` - returned node count.
- `preferred` - nodes from preferred sources.
- `random` - Cloudflare CIDR random-fill nodes.
- `categories` / `remarks` - source breakdown.

## Preferred IP sources

`/mihomo` uses built-in public preferred-IP sources first. If there are not enough nodes, it fills with `CF-CIDR-random`.

Optional KV key:

```text
ADD.txt
```

`ADD.txt` can contain direct IPs or HTTP raw text/CSV URLs. URL sources are parsed and capped per source so one large list does not dominate the output.

Example content is in `ADD.example.txt`.

After changing `ADD.txt`, use:

```text
/mihomo?token=<subscription-token>&count=1024&debug=1&refresh=1
```

## Optional KV config

The Worker can run from environment variables alone. If you want persistent config, put `config.example.json` into KV as:

```text
config.json
```

At minimum, set your own `UUID` and `HOST` / `HOSTS`.

## Attribution

This publishing copy is maintained as `baiqi-cf-worker-mihomo`, based on CFspider Worker code, and keeps the upstream Apache-2.0 license. Keep `LICENSE` and preserve attribution when publishing your GitHub repository.

## Safety

Use only on infrastructure you own or are allowed to operate. Follow Cloudflare terms and local law.
