# Adnovara — Deployment Guide

This guide covers the Ubuntu VPS deployment for the Adnovara Next.js site, including the Ads Manager hiring pipeline (Google Sheets + Drive intake) and the password-protected `/admin` panel.

The site is a single Next.js 16 process. Nginx terminates TLS and reverse-proxies everything to it on `127.0.0.1:8080`.

---

## Part 1 — Initial server setup

Assumes a fresh Ubuntu 22.04+ VPS, a domain `adnovara.com` pointing at it, and SSH access as a sudoer.

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
sudo useradd --system --create-home --shell /usr/sbin/nologin adnovara
sudo mkdir -p /var/www/adnovara
sudo mkdir -p /var/lib/adnovara/downloads /var/lib/adnovara/uploads
sudo chown -R adnovara:adnovara /var/www/adnovara /var/lib/adnovara
```

### 1.4 Clone the repo

```bash
sudo -u adnovara git clone https://github.com/<your-org>/adnovara.git /var/www/adnovara
cd /var/www/adnovara
sudo -u adnovara npm ci
sudo -u adnovara npm run build
```

---

## Part 2 — systemd service

Create `/etc/systemd/system/adnovara.service`:

```ini
[Unit]
Description=Adnovara Next.js
After=network.target

[Service]
Type=simple
User=adnovara
Group=adnovara
WorkingDirectory=/var/www/adnovara
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now adnovara
sudo systemctl status adnovara
```

Logs: `sudo journalctl -u adnovara -f`

---

## Part 3 — Google Sheets + Drive pipeline

The form intake forwards every submission to a Google Apps Script Web App, which (a) saves uploaded files into a Drive folder and (b) appends a row to a Google Sheet.

### 3.1 Create the Sheet and Drive folder

1. Create a new Google Sheet named **Adnovara Applications**. Note its URL.
2. Create a Drive folder named **Adnovara Applications — Files** inside the same Google account. Note the folder ID (the string after `/folders/` in the URL).

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
cd /var/www/adnovara
sudo -u adnovara node scripts/hash-password.mjs
# Enter password (no echo), confirm, copy the printed line:
# ADMIN_PASSWORD_HASH=scrypt$<salthex>$<hashhex>
```

The script writes the hash line to stdout; everything else goes to stderr.

### 4.2 systemd environment override

```bash
sudo mkdir -p /etc/systemd/system/adnovara.service.d
sudo tee /etc/systemd/system/adnovara.service.d/override.conf > /dev/null <<EOF
[Service]
Environment=GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/.../exec
Environment=GOOGLE_SHEETS_READ_SECRET=<paste secret from 3.2>
Environment=ADMIN_USERNAME=admin
Environment=ADMIN_PASSWORD_HASH=<paste full scrypt$... line from 4.1>
Environment=ADNOVARA_DATA_DIR=/var/lib/adnovara
EOF
sudo systemctl daemon-reload
sudo systemctl restart adnovara
```

> **Important:** `override.conf` should be `chmod 600` (default on tee with sudo). Don't commit it.

### 4.3 Verify

```bash
curl -sI https://adnovara.com/admin/login | head -20
# Expect: 200, Content-Security-Policy header, X-Frame-Options: DENY, Cache-Control: no-store
```

Then visit `https://adnovara.com/admin` in a browser, log in.

If `ADMIN_PASSWORD_HASH` is unset or invalid the panel returns `503 Admin disabled.` — this is intentional.

---

## Part 5 — Nginx

`/etc/nginx/sites-available/adnovara`:

```nginx
limit_req_zone $binary_remote_addr zone=admin_login:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=applications:10m rate=10r/m;

server {
    listen 80;
    server_name adnovara.com www.adnovara.com;
    return 301 https://adnovara.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name adnovara.com;

    # ssl_certificate / ssl_certificate_key managed by certbot (see Part 6)

    client_max_body_size 22m;

    # Rate-limited endpoints
    location = /admin/login/submit {
        limit_req zone=admin_login burst=2 nodelay;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /api/applications {
        limit_req zone=applications burst=5 nodelay;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

Enable + reload:

```bash
sudo ln -sf /etc/nginx/sites-available/adnovara /etc/nginx/sites-enabled/adnovara
sudo nginx -t
sudo systemctl reload nginx
```

---

## Part 6 — TLS via Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d adnovara.com -d www.adnovara.com --redirect --agree-tos -m hiring@adnovara.com
```

Auto-renew is enabled by default (`systemctl status certbot.timer`).

---

## Part 7 — Deploying updates

```bash
ssh adnovara-server
cd /var/www/adnovara
sudo -u adnovara git pull
sudo -u adnovara npm ci
sudo -u adnovara npm run build
sudo systemctl restart adnovara
```

The take-home asset and JSONL log live in `/var/lib/adnovara/` and survive `git pull` cleanly — they're outside the repo.

---

## Operational notes

- **In-memory sessions**: the admin panel keeps sessions in a process-local `Map`. A restart wipes them — by design. Don't run multiple workers (no `cluster`, no PM2 `instances > 1`); sessions would not be shared.
- **Audit log**: `sudo journalctl -u adnovara -t adnovara` shows every login (success/fail), logout, file upload, and admin page access.
- **Rotating the admin password**: re-run `node scripts/hash-password.mjs`, paste the new `ADMIN_PASSWORD_HASH` into `override.conf`, `daemon-reload && restart`. All sessions are wiped on restart.
- **Replacing the take-home file via UI**: log into `/admin/downloads`, upload the new ZIP/DOCX. The old file is preserved as `take-home.bak` for rollback. Magic-byte validated (`PK\x03\x04`) — invalid uploads are rejected before touching disk.
- **Backup the JSONL**: `/var/lib/adnovara/applications.jsonl` is the durable local copy of every submission. Even if the Apps Script webhook is down or compromised, you still have it. Back it up nightly.
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

```
[ ] DNS A record for adnovara.com → server IP
[ ] Node 20 + Nginx installed
[ ] /var/www/adnovara cloned, npm ci, npm run build
[ ] /var/lib/adnovara/{downloads,uploads} created and chown adnovara
[ ] /etc/systemd/system/adnovara.service in place
[ ] Google Sheet + Drive folder created
[ ] Apps Script deployed; Web app URL + READ_SECRET captured
[ ] curl smoke-test against ?secret= returns JSON
[ ] node scripts/hash-password.mjs run; ADMIN_PASSWORD_HASH captured
[ ] /etc/systemd/system/adnovara.service.d/override.conf populated with all four envs
[ ] systemctl daemon-reload && systemctl restart adnovara
[ ] Initial take-home asset uploaded via /admin/downloads
[ ] Nginx config in place, certbot run, nginx -t && reload
[ ] /admin/login reachable, login succeeds, logout works
[ ] Test application submitted from /careers/ads-manager → row appears in Sheet + JSONL
[ ] Backup cron set for /var/lib/adnovara/applications.jsonl
```
