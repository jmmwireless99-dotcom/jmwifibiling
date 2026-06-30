# JM Billing System — Setup Guide

Follow these steps to get your billing panel running.

---

## What you need
- A Windows computer (can stay on in your shop)
- Your MikroTik router (RouterOS v7) on the same network
- Node.js LTS installed from https://nodejs.org

---

## STEP 1 — Install Node.js (one time)
1. Go to **https://nodejs.org**
2. Download the **LTS** version
3. Run the installer — keep clicking Next / Install

---

## STEP 2 — Unzip / copy the system
1. Place the folder somewhere permanent, e.g. `C:\JM-Billing-System`
2. You should see `server.js`, `lib\`, `public\`, and `START.bat`

---

## STEP 3 — Start it
1. Double-click **`START.bat`**
2. Keep the black window open while using the panel
3. Open your browser at **http://localhost:3000**

---

## STEP 4 — Log in and set up
1. Default login: **username `admin`, password `admin`**
2. **Change the password immediately**
3. Open **Settings** and fill in:
   - Your business name, GCash/Maya details
   - Your MikroTik router IP, username, password
4. Click **Test connection**

> Tip: keep **Dry-run mode ON** the first time. Turn it off once you're confident.

---

## Daily use
- Double-click **`START.bat`** and open **http://localhost:3000**
- From another device on your LAN: `http://YOUR-PC-IP:3000`

---

## Common questions

**The black window closed / panel won't open**
Make sure Node.js is installed and run `START.bat` again.

**I forgot my admin password**
Set `RESET_ADMIN=1` in a `.env` file next to `server.js`, restart once, then remove it.

**Is my data safe?**
Yes. Everything stays on your computer. Back up `billing.db` from Settings or by copying the file.

---

— JM Billing System
