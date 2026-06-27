# JM Billing System — Features & Functions

A complete MikroTik billing and operations panel for PPPoE, IPoE, Hotspot, and JuanFi piso-WiFi.

---

## 1. Customer & Billing Management
- Full subscriber database — name, contact, address, area, connection type, plan, status.
- Connection types: **PPPoE**, **IPoE** (MAC-bound), and **Hotspot**.
- Speed/validity plans you define (e.g. 50 Mbps / 30 days).
- Record payments — **cash, GCash, Maya** — with full payment history per customer.
- Automatic **expiry tracking** and **due-date reminders** (dunning).
- **Auto-suspend** overdue accounts and **auto-reconnect** when they pay.
- Credit / advance balance handling.

## 2. MikroTik Router Automation (RouterOS v7)
- Connects directly to your MikroTik (hEX and similar).
- **Provision** new PPPoE and IPoE subscribers automatically.
- **Suspend / reconnect** via address-list (safe — does not touch NAT or proxy rules).
- Per-subscriber **speed limits** (rate plans).
- Auto-generate PPPoE usernames and strong passwords.
- **Dry-run mode** — preview router commands before they run.

## 3. Piso-WiFi / Vendo (JuanFi & KitFi)
- Register and monitor JuanFi NodeMCU vendo machines.
- Track **coin income** per vendo machine.
- Offline-vendo alerts.
- **KitFi Pisowifi GCash webhook** — auto-create hotspot vouchers when KitFi confirms payment.
- **Voucher generator** — bulk-create hotspot users on MikroTik from Hotspot Monitor or Accounts.

## 4. Public Application Form (/apply)
- Web form for new customer applications.
- Applications flow into **Job Orders**.

## 5. Job Orders, Tech Team, Inventory, Expenses, Reports
- Installation pipeline with technician assignment.
- Hardware inventory with serial/MAC tracking and profit margins.
- Expense logging and monthly cash-flow reports.

## 6. Security
- Login protection (scrypt + salt).
- Brute-force protection.
- Staff roles: admin, cashier, technician.
- Audit log.

## 7. Data
- Local SQLite database (`billing.db`) — easy backup (copy one file).
- Backup & restore from Settings.

---

## Quick start

1. Install **Node.js LTS** from https://nodejs.org
2. Double-click **`START.bat`**
3. Open **http://localhost:3000**
4. Login: **admin** / **admin** (change immediately)

### KitFi GCash webhook setup

1. Settings → set **Public URL** (must be internet-reachable, e.g. Cloudflare tunnel).
2. Copy webhook URL: `{public_url}/api/billing/kitifi/webhook`
3. In **KitFi hotspot management**, paste that URL under GCash payment webhook.
4. Optional: set amount→profile map JSON, e.g. `{"5":"2h","10":"4h","20":"1d"}`.

---

**An all-in-one, offline management system for MikroTik / piso-WiFi operators — billing, automation, inventory, reporting, and customer management on your own computer.**
