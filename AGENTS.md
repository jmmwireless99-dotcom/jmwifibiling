# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
Single product: **JM Billing System** — a self-hosted MikroTik / piso-WiFi ISP billing panel. It is a zero-dependency Node.js app: one monolithic HTTP server (`server.js`) that serves a static SPA (`public/index.html`) plus a JSON REST API, backed by an embedded SQLite database (`node:sqlite`). Logic lives in `lib/*.js`. See `README.md` for the feature list.

### Source location (important)
The product source does **not** live on `main` — `origin/main` only contains `README.md` + `license.key` (the source was deleted there). The full, current code lives on the `cursor/*` feature branches (this branch has it). If you ever find `server.js`/`lib/` missing, you are on an empty branch; check out a feature branch that contains the source.

### Requirements
- Node.js **22+** is required (uses the built-in `node:sqlite` module). The VM already has a compatible Node (v22.x).
- **No package manager / no dependencies.** There is no `package.json`, no `node_modules`, and nothing to install. Do not run `npm install`.

### Run
- Start the app: `node server.js` (from repo root). It serves HTTP on `http://localhost:3000` (override with `PORT`).
- First run auto-creates `billing.db` (SQLite, WAL mode) and seeds a default admin account: **`admin` / `admin`**.
- The licensing gate is disabled in this build (`checkLicense()` in `lib/license.js` always returns `ok:true`), so no license key is needed to run.
- Login is at `POST /api/auth/login`; the SPA sets an `sid` cookie. `RESET_ADMIN=1` resets the admin password to `admin` on startup.

### Lint / Test / Build
- There is **no lint config, no test suite, and no build step** (the app runs directly from source; production packaging uses `pkg` to make a Windows `.exe`, not needed for dev).
- Closest sanity check: `node --check server.js` (and the same on `lib/*.js`) for syntax validation.

### Notes / gotchas
- Runtime files `billing.db`, `billing.db-wal`, `billing.db-shm` are gitignored and created at runtime; delete them to reset all data to a fresh first-run state.
- All external integrations (MikroTik RouterOS, PayMongo/GCash, KitFi, JuanFi vendo, Telegram, SMS/GSM, SMTP, Anthropic AI) are optional and configured via the in-app Settings table or `.env`. The core billing UI/API runs fully without any of them.
- Before adding a customer/subscriber in the UI, a plan must exist (create one under the PPPoE/plans section first).
