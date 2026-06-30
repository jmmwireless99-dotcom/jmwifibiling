# Deploy KitFi update to jmwifi.pro VPS

Production site **https://jmwifi.pro** runs from repo:
**https://github.com/jmmwireless99-dotcom/jmwebsite-billing**

## Option A — SSH to VPS and pull (recommended)

```bash
ssh your-user@your-vps-ip

# go to your billing app folder (common paths):
cd ~/jmwebsite-billing || cd /var/www/jmwebsite-billing || cd /opt/jm-billing

# pull latest from main (after jmwebsite-billing is updated)
git pull origin main
bash deploy/vps-update.sh
```

## Option B — Copy files from this branch (jmwifibiling)

If `jmwebsite-billing` is not updated yet, copy these files from branch
`cursor/kitifi-voucher-webhook-3662` on **jmwifibiling**:

- `lib/kitifi.js` (new)
- `lib/db.js`
- `server.js`
- `public/index.html`
- `deploy/vps-update.sh`

On VPS:

```bash
cd /path/to/billing-app
# download each file from GitHub raw, or scp from your PC
node --check server.js
sudo systemctl restart jm-billing   # or: pm2 restart jm-billing
```

## After deploy — configure on jmwifi.pro

1. Login → **Settings**
2. **Public URL** = `https://jmwifi.pro`
3. Copy webhook: `https://jmwifi.pro/api/billing/kitifi/webhook`
4. Paste in **KitFi hotspot management** → GCash webhook
5. **Hotspot Monitor** → use **Generate vouchers** button

## Test webhook

```bash
curl -X POST https://jmwifi.pro/api/billing/kitifi/webhook \
  -H "Content-Type: application/json" \
  -d '{"status":"paid","amount":10,"reference_id":"test-001","profile":"default"}'
```

Expected: `OK` (not `login required`)
