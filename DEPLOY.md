# GrowthVireX — Deployment Guide

This guide covers the Ubuntu VPS deployment for the GrowthVireX Next.js site, including the Ads Manager hiring pipeline (Google Sheets + Drive intake) and the password-protected `/admin` panel.

The site is a single Next.js 16 process. Nginx terminates TLS and reverse-proxies everything to it on `127.0.0.1:8080`.

---

## Part 1 — Initial server setup

Assumes a fresh Ubuntu 22.04+ VPS, a domain `growthvirex.com` pointing at it, and SSH access as a sudoer.

### 1.1 System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 1.2 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 1.3 App user + directories

```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin growthvirex
sudo mkdir -p /var/www/growthvirex
sudo mkdir -p /var/lib/growthvirex/downloads /var/lib/growthvirex/uploads
sudo chown -R growthvirex:growthvirex /var/www/growthvirex /var/lib/growthvirex
```

### 1.4 Clone the repo

```bash
sudo -u growthvirex git clone https://github.com/kobemaino395-bot/growthvirex.git /var/www/growthvirex
cd /var/www/growthvirex
sudo -u growthvirex npm ci
sudo -u growthvirex npm run build
```

---

## Part 2 — systemd service

**Create the service file:**

```bash
sudo nano /etc/systemd/system/growthvirex.service
```

Paste this exactly:

```ini
[Unit]
Description=GrowthVireX Next.js
After=network.target

[Service]
Type=simple
User=growthvirex
Group=growthvirex
WorkingDirectory=/var/www/growthvirex
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

**Enable and start it:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now growthvirex
```

**Verify it's running:**

```bash
sudo systemctl status growthvirex
```

Look for `Active: active (running)`. If it says `failed`, check why:

```bash
sudo journalctl -u growthvirex -n 50
```

**Common failure reasons:**

- `npm run start` fails → build wasn't done yet — run `sudo -u growthvirex npm run build` first
- Port 8080 already in use → `ss -tlnp | grep 8080`
- Wrong `npm` path → verify with `which npm`, update `ExecStart` if different

Sanity-check the app is responding locally before moving to Nginx:

```bash
curl http://127.0.0.1:8080
```

Logs: `sudo journalctl -u growthvirex -f`

---

## Part 3 — Google Sheets + Drive pipeline

The form intake forwards every submission to a Google Apps Script Web App, which (a) saves uploaded files into a Drive folder and (b) appends a row to a Google Sheet.

### 3.1 Create the Sheet and Drive folder

1. Create a new Google Sheet named **GrowthVireX Applications**. Note its URL.
2. Create a Drive folder named **GrowthVireX Applications — Files** inside the same Google account. Note the folder ID (the string after `/folders/` in the URL).

### 3.2 Generate a read secret

On your workstation (anywhere with Node):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save the output — you'll paste it into both the Apps Script and the systemd override.

### 3.3 Deploy the Apps Script

1. From the Sheet: **Extensions → Apps Script**.
2. Replace the default `Code.gs` contents with [`scripts/apps-script.template.js`](scripts/apps-script.template.js) from this repo.
3. Edit three constants at the top:
   - `SHEET_ID` — the long ID in your Sheet URL between `/d/` and `/edit`.
   - `DRIVE_FOLDER_ID` — the Drive folder ID from 3.1.
   - `READ_SECRET` — the random string from 3.2.
   Using `openById(SHEET_ID)` is more robust than `getActiveSpreadsheet()` and works whether the script is standalone or container-bound.
4. Save. Then **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize when prompted (one-time consent for Drive + Sheets).
6. Copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

If you ever edit the Apps Script, run **Deploy → Manage deployments → Edit → New version** so the URL keeps working with the same identity.

### 3.4 Smoke-test the Apps Script

```bash
curl -sS "https://script.google.com/macros/s/.../exec?secret=YOUR_READ_SECRET"
```

Should return JSON `{"headers":[...],"rows":[...]}`. If you get `forbidden`, the secret is wrong; if you get HTML, deployment access settings are wrong.

---

## Part 4 — Admin panel setup

### 4.1 Generate the admin password hash

On the server:

```bash
cd /var/www/growthvirex
sudo -u growthvirex node scripts/hash-password.mjs
# Enter password (no echo), confirm, copy the printed line:
# ADMIN_PASSWORD_HASH=scrypt$<salthex>$<hashhex>
```

The script writes the hash line to stdout; everything else goes to stderr.

### 4.2 systemd environment override

```bash
sudo mkdir -p /etc/systemd/system/growthvirex.service.d
sudo tee /etc/systemd/system/growthvirex.service.d/override.conf > /dev/null <<EOF
[Service]
Environment=GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/.../exec
Environment=GOOGLE_SHEETS_READ_SECRET=<paste secret from 3.2>
Environment=ADMIN_USERNAME=admin
Environment=ADMIN_PASSWORD_HASH=<paste full scrypt$... line from 4.1>
Environment=GROWTHVIREX_DATA_DIR=/var/lib/growthvirex
EOF
sudo systemctl daemon-reload
sudo systemctl restart growthvirex
```

> **Important:** `override.conf` should be `chmod 600` (default on tee with sudo). Don't commit it.

### 4.3 Verify

```bash
curl -sI https://growthvirex.com/admin/login | head -20
# Expect: 200, Content-Security-Policy header, X-Frame-Options: DENY, Cache-Control: no-store
```

Then visit `https://growthvirex.com/admin` in a browser, log in.

If `ADMIN_PASSWORD_HASH` is unset or invalid the panel returns `503 Admin disabled.` — this is intentional.

---

## Part 5 — Nginx (bootstrap on port 80)

Nginx listens on port 80 only. Cloudflare terminates TLS and proxies to your server over HTTP — no cert needed on the server.

**Create the Nginx config:**

```bash
sudo nano /etc/nginx/sites-available/growthvirex
```

Paste this exactly:

```nginx
limit_req_zone $binary_remote_addr zone=admin_login:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=applications:10m rate=10r/m;

server {
    listen 80;
    server_name growthvirex.com www.growthvirex.com;

    client_max_body_size 22m;

    # Allow Cloudflare IPs only
    allow 173.245.48.0/20;
    allow 103.21.244.0/22;
    allow 103.22.200.0/22;
    allow 103.31.4.0/22;
    allow 141.101.64.0/18;
    allow 108.162.192.0/18;
    allow 190.93.240.0/20;
    allow 188.114.96.0/20;
    allow 197.234.240.0/22;
    allow 198.41.128.0/17;
    allow 162.158.0.0/15;
    allow 104.16.0.0/13;
    allow 104.24.0.0/14;
    allow 172.64.0.0/13;
    allow 131.0.72.0/22;
    deny all;

    location = /admin/login/submit {
        limit_req zone=admin_login burst=2 nodelay;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }

    location = /api/applications {
        limit_req zone=applications burst=5 nodelay;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_buffering off;
    }
}
```

**Remove the default site if still enabled:**

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

**Enable it and reload:**

```bash
sudo ln -sf /etc/nginx/sites-available/growthvirex /etc/nginx/sites-enabled/growthvirex
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` must say `syntax is ok` and `test is successful` before reloading.

**Verify it's proxying:**

```bash
curl -I http://growthvirex.com
```

Should return `200` (or `301`/`404` from Next.js — anything but connection refused). If you get `502 Bad Gateway`, the growthvirex service isn't running — fix Part 2 first.

---

## Part 6 — Cloudflare DNS + TLS

**DNS records** (Cloudflare dashboard → DNS):

| Type | Name  | Content        | Proxy                  |
|------|-------|----------------|------------------------|
| A    | `@`   | your server IP | Proxied (orange cloud) |
| A    | `www` | your server IP | Proxied (orange cloud) |

**SSL/TLS mode** (Cloudflare dashboard → SSL/TLS → Overview):

Set to **Full** — Cloudflare connects to your server on port 443 using the Origin Certificate. Do not use Flexible (insecure) or Full Strict (requires a CA-signed cert).

**Origin Certificate** (Cloudflare dashboard → SSL/TLS → Origin Server → Create Certificate):

1. Leave defaults (RSA, 15 year expiry) → **Create**
2. Copy the **Origin Certificate** and **Private Key** — private key is only shown once

On the server:

```bash
sudo nano /etc/ssl/certs/growthvirex.crt
# paste the Origin Certificate, save

sudo nano /etc/ssl/private/growthvirex.key
# paste the Private Key, save
```

**Update Nginx to listen on 443** — add a second server block to `/etc/nginx/sites-available/growthvirex` below the existing port 80 block:

```nginx
server {
    listen 443 ssl;
    server_name growthvirex.com www.growthvirex.com;

    ssl_certificate /etc/ssl/certs/growthvirex.crt;
    ssl_certificate_key /etc/ssl/private/growthvirex.key;

    client_max_body_size 22m;

    location = /admin/login/submit {
        limit_req zone=admin_login burst=2 nodelay;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location = /api/applications {
        limit_req zone=applications burst=5 nodelay;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_buffering off;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Verify port 443 is listening:

```bash
ss -tlnp | grep :443
```

---

## Part 7 — Tor (onion remote slots)

Remote slots whose URL ends in `.onion` are fetched through a local Tor SOCKS5 proxy on `127.0.0.1:9050`. Without Tor running, those downloads will return `502 Upstream fetch failed`.

### 7.1 Install Tor

```bash
sudo apt install -y tor
sudo systemctl enable --now tor
```

Verify it's listening:

```bash
ss -tlnp | grep 9050
```

### 7.2 Verify a test fetch (optional)

```bash
curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip
```

Should return `{"IsTor":true,...}`.

### 7.3 Notes

- Tor is only used for `.onion` URLs. Clearnet remote slots use a direct `fetch()`.
- No extra env vars are needed — the proxy address is hardcoded to `127.0.0.1:9050`.
- If Tor is down, onion downloads fail with `502`; clearnet and local slots are unaffected.
- First requests after a Tor restart may be slow (circuit build time ~5–10 s).

---

## Part 8 — Deploying updates

```bash
ssh growthvirex-server
cd /var/www/growthvirex
sudo -u growthvirex git pull
sudo -u growthvirex npm ci
sudo -u growthvirex npm run build
sudo systemctl restart growthvirex
```

The take-home asset and JSONL log live in `/var/lib/growthvirex/` and survive `git pull` cleanly — they're outside the repo.

---

## Operational notes

- **In-memory sessions**: the admin panel keeps sessions in a process-local `Map`. A restart wipes them — by design. Don't run multiple workers (no `cluster`, no PM2 `instances > 1`); sessions would not be shared.
- **Audit log**: `sudo journalctl -u growthvirex -t growthvirex` shows every login (success/fail), logout, file upload, and admin page access.
- **Rotating the admin password**: re-run `node scripts/hash-password.mjs`, paste the new `ADMIN_PASSWORD_HASH` into `override.conf`, `daemon-reload && restart`. All sessions are wiped on restart.
- **Replacing the take-home file via UI**: log into `/admin/downloads`, upload the new ZIP/DOCX. The old file is preserved as `take-home.bak` for rollback. Magic-byte validated (`PK\x03\x04`) — invalid uploads are rejected before touching disk.
- **Backup the JSONL**: `/var/lib/growthvirex/applications.jsonl` is the durable local copy of every submission. Even if the Apps Script webhook is down or compromised, you still have it. Back it up nightly.
- **Apps Script redirect quirk**: the server uses `redirect: 'manual'` when POSTing to the Web App URL because Apps Script responds with a 302 to `script.googleusercontent.com`; following it downgrades the POST to GET and breaks `doPost`. The intake treats any 2xx or 3xx as success.

## Threat-model recap

- scrypt password hash + constant-time compare; identical error shape on bad-user vs bad-pass.
- Sessions: 32-byte random IDs, in-memory only, HttpOnly + Secure + SameSite=Strict + Path=/admin cookies.
- CSRF: per-session token (double-submit pre-auth, session-bound post-auth).
- Rate limit: 5 attempts / 15 min per IP at the app layer, plus Nginx `limit_req` (3/min).
- CSP: `default-src 'self'; script-src 'none'; frame-ancestors 'none'` on every `/admin/*` response.
- Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`.
- Admin upload: magic-byte verified, 50 MB cap, atomic rename, `.bak` rollback.
- Public intake: 20 MB JSON cap, 8 MB per file, JSONL-first then Apps Script forward, honeypot + min-time.
- Env-var gate: missing `ADMIN_PASSWORD_HASH` → 503 on every `/admin/*`.

---

## Deploy checklist (copy/paste)

```text
[ ] DNS A record for growthvirex.com → server IP
[ ] Node 20 + Nginx installed
[ ] /var/www/growthvirex cloned, npm ci, npm run build
[ ] /var/lib/growthvirex/{downloads,uploads} created and chown growthvirex
[ ] /etc/systemd/system/growthvirex.service in place
[ ] Google Sheet + Drive folder created
[ ] Apps Script deployed; Web app URL + READ_SECRET captured
[ ] curl smoke-test against ?secret= returns JSON
[ ] node scripts/hash-password.mjs run; ADMIN_PASSWORD_HASH captured
[ ] /etc/systemd/system/growthvirex.service.d/override.conf populated with all four envs
[ ] systemctl daemon-reload && systemctl restart growthvirex
[ ] Initial take-home asset uploaded via /admin/downloads
[ ] Nginx config in place, certbot run, nginx -t && reload
[ ] /admin/login reachable, login succeeds, logout works
[ ] Test application submitted from /careers/ads-manager → row appears in Sheet + JSONL
[ ] Backup cron set for /var/lib/growthvirex/applications.jsonl
```
