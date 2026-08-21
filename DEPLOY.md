# AdsPerio — Deployment Guide

This guide covers the Ubuntu VPS deployment for the AdsPerio Next.js site, including the Ads Manager hiring pipeline (Google Sheets + Drive intake) and the password-protected `/admin` panel.

The site is a single Next.js 16 process. Nginx terminates TLS and reverse-proxies everything to it on `127.0.0.1:8080`.

---

## Part 1 — Initial server setup

Assumes a fresh Ubuntu 22.04+ VPS, a domain `adsperio.com` pointing at it, and SSH access as a sudoer.

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
sudo useradd --system --create-home --shell /usr/sbin/nologin adsperio
sudo mkdir -p /var/www/adsperio
sudo mkdir -p /var/lib/adsperio/downloads /var/lib/adsperio/uploads
sudo chown -R adsperio:adsperio /var/www/adsperio /var/lib/adsperio
```

### 1.4 Clone the repo

```bash
sudo -u adsperio git clone https://github.com/kobemaino395-bot/adsperio.git /var/www/adsperio
cd /var/www/adsperio
sudo -u adsperio npm ci
sudo -u adsperio npm run build
```

---

## Part 2 — systemd service

**Create the service file:**

```bash
sudo nano /etc/systemd/system/adsperio.service
```

Paste this exactly:

```ini
[Unit]
Description=AdsPerio Next.js
After=network.target

[Service]
Type=simple
User=adsperio
Group=adsperio
WorkingDirectory=/var/www/adsperio
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
sudo systemctl enable --now adsperio
```

**Verify it's running:**

```bash
sudo systemctl status adsperio
```

Look for `Active: active (running)`. If it says `failed`, check why:

```bash
sudo journalctl -u adsperio -n 50
```

**Common failure reasons:**

- `npm run start` fails → build wasn't done yet — run `sudo -u adsperio npm run build` first
- Port 8080 already in use → `ss -tlnp | grep 8080`
- Wrong `npm` path → verify with `which npm`, update `ExecStart` if different

Sanity-check the app is responding locally before moving to Nginx:

```bash
curl http://127.0.0.1:8080
```

Logs: `sudo journalctl -u adsperio -f`

---

## Part 3 — Google Sheets + Drive pipeline

The form intake forwards every submission to a Google Apps Script Web App, which (a) saves uploaded files into a Drive folder and (b) appends a row to a Google Sheet.

### 3.1 Create the Sheet and Drive folder

1. Create a new Google Sheet named **AdsPerio Applications**. Note its URL.
2. Create a Drive folder named **AdsPerio Applications — Files** inside the same Google account. Note the folder ID (the string after `/folders/` in the URL).

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
cd /var/www/adsperio
sudo -u adsperio node scripts/hash-password.mjs
# Enter password (no echo), confirm, copy the printed line:
# ADMIN_PASSWORD_HASH=scrypt$<salthex>$<hashhex>
```

The script writes the hash line to stdout; everything else goes to stderr.

### 4.2 systemd environment override

```bash
sudo mkdir -p /etc/systemd/system/adsperio.service.d
sudo tee /etc/systemd/system/adsperio.service.d/override.conf > /dev/null <<EOF
[Service]
Environment=GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/.../exec
Environment=GOOGLE_SHEETS_READ_SECRET=<paste secret from 3.2>
Environment=ADMIN_USERNAME=admin
Environment=ADMIN_PASSWORD_HASH=<paste full scrypt$... line from 4.1>
Environment=ADSPERIO_DATA_DIR=/var/lib/adsperio
EOF
sudo systemctl daemon-reload
sudo systemctl restart adsperio
```

> **Important:** `override.conf` should be `chmod 600` (default on tee with sudo). Don't commit it.

> **Migrating from GrowthVireX:** if this server previously ran the site under the old `growthvirex` name, the data-dir env var was `GROWTHVIREX_DATA_DIR`. It has been renamed to `ADSPERIO_DATA_DIR` in the app. Update `override.conf` to the new key (and move `/var/lib/growthvirex` → `/var/lib/adsperio` if you're keeping the same data, or just point the new var at the old path) before restarting.

### 4.3 Verify

```bash
curl -sI https://adsperio.com/admin/login | head -20
# Expect: 200, Content-Security-Policy header, X-Frame-Options: DENY, Cache-Control: no-store
```

Then visit `https://adsperio.com/admin` in a browser, log in.

If `ADMIN_PASSWORD_HASH` is unset or invalid the panel returns `503 Admin disabled.` — this is intentional.

---

## Part 5 — Nginx (bootstrap on port 80)

Nginx listens on port 80 only. Cloudflare terminates TLS and proxies to your server over HTTP — no cert needed on the server.

**Create the Nginx config:**

```bash
sudo nano /etc/nginx/sites-available/adsperio
```

Paste this exactly:

```nginx
limit_req_zone $binary_remote_addr zone=admin_login:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=applications:10m rate=10r/m;

server {
    listen 80;
    server_name adsperio.com www.adsperio.com;

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
sudo ln -sf /etc/nginx/sites-available/adsperio /etc/nginx/sites-enabled/adsperio
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` must say `syntax is ok` and `test is successful` before reloading.

**Verify it's proxying:**

```bash
curl -I http://adsperio.com
```

Should return `200` (or `301`/`404` from Next.js — anything but connection refused). If you get `502 Bad Gateway`, the adsperio service isn't running — fix Part 2 first.

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
sudo nano /etc/ssl/certs/adsperio.crt
# paste the Origin Certificate, save

sudo nano /etc/ssl/private/adsperio.key
# paste the Private Key, save
```

**Update Nginx to listen on 443** — add a second server block to `/etc/nginx/sites-available/adsperio` below the existing port 80 block:

```nginx
server {
    listen 443 ssl;
    server_name adsperio.com www.adsperio.com;

    ssl_certificate /etc/ssl/certs/adsperio.crt;
    ssl_certificate_key /etc/ssl/private/adsperio.key;

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

## Part 7 — Deploying updates

```bash
ssh adsperio-server
cd /var/www/adsperio
sudo -u adsperio git pull
sudo -u adsperio npm ci
sudo -u adsperio npm run build
sudo systemctl restart adsperio
```

The take-home asset and JSONL log live in `/var/lib/adsperio/` and survive `git pull` cleanly — they're outside the repo.

---

## Operational notes

- **In-memory sessions**: the admin panel keeps sessions in a process-local `Map`. A restart wipes them — by design. Don't run multiple workers (no `cluster`, no PM2 `instances > 1`); sessions would not be shared.
- **Audit log**: `sudo journalctl -u adsperio -t adsperio` shows every login (success/fail), logout, file upload, and admin page access.
- **Rotating the admin password**: re-run `node scripts/hash-password.mjs`, paste the new `ADMIN_PASSWORD_HASH` into `override.conf`, `daemon-reload && restart`. All sessions are wiped on restart.
- **Take-home files**: managed per position (and optionally per role) directly in `/admin/content/positions/<slug>` — no separate file manager. Uploading replaces the current file for that row; PDF/ZIP/DOC/DOCX only, 50 MB cap. Files live under `/var/lib/adsperio/positions/<slug>/take-home/` and are served at `/careers/<slug>/take-home/<role-id-or-_position>`.
- **Backup the JSONL**: `/var/lib/adsperio/applications.jsonl` is the durable local copy of every submission. Even if the Apps Script webhook is down or compromised, you still have it. Back it up nightly.
- **Apps Script redirect quirk**: the server uses `redirect: 'manual'` when POSTing to the Web App URL because Apps Script responds with a 302 to `script.googleusercontent.com`; following it downgrades the POST to GET and breaks `doPost`. The intake treats any 2xx or 3xx as success.

## Threat-model recap

- scrypt password hash + constant-time compare; identical error shape on bad-user vs bad-pass.
- Sessions: 32-byte random IDs, in-memory only, HttpOnly + Secure + SameSite=Strict + Path=/admin cookies.
- CSRF: per-session token (double-submit pre-auth, session-bound post-auth).
- Rate limit: 5 attempts / 15 min per IP at the app layer, plus Nginx `limit_req` (3/min).
- CSP: `default-src 'self'; script-src 'none'; frame-ancestors 'none'` on every `/admin/*` response.
- Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`.
- Admin upload: extension/MIME allowlist (PDF/ZIP/DOC/DOCX), 50 MB cap, atomic rename.
- Public intake: 20 MB JSON cap, 8 MB per file, JSONL-first then Apps Script forward, honeypot + min-time.
- Env-var gate: missing `ADMIN_PASSWORD_HASH` → 503 on every `/admin/*`.

---

## Deploy checklist (copy/paste)

```text
[ ] DNS A record for adsperio.com → server IP
[ ] Node 20 + Nginx installed
[ ] /var/www/adsperio cloned, npm ci, npm run build
[ ] /var/lib/adsperio/{downloads,uploads} created and chown adsperio
[ ] /etc/systemd/system/adsperio.service in place
[ ] Google Sheet + Drive folder created
[ ] Apps Script deployed; Web app URL + READ_SECRET captured
[ ] curl smoke-test against ?secret= returns JSON
[ ] node scripts/hash-password.mjs run; ADMIN_PASSWORD_HASH captured
[ ] /etc/systemd/system/adsperio.service.d/override.conf populated with all four envs
[ ] systemctl daemon-reload && systemctl restart adsperio
[ ] Initial take-home asset uploaded via /admin/content/positions/<slug>
[ ] Nginx config in place, certbot run, nginx -t && reload
[ ] /admin/login reachable, login succeeds, logout works
[ ] Test application submitted from a /careers/<slug> page → row appears in Sheet + JSONL
[ ] Apps Script Code.gs redeployed with the role/roleLabel/positionSlug columns (see scripts/apps-script.template.js);
    Sheet row 1 headers updated to match
[ ] Backup cron set for /var/lib/adsperio/applications.jsonl
```
