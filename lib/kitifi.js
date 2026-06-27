// lib/kitifi.js — KitFi Pisowifi GCash payment webhook helpers.
import crypto from "node:crypto";

function pick(obj, keys) {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    if (obj[k] != null && obj[k] !== "") return obj[k];
    const lk = Object.keys(obj).find((x) => x.toLowerCase() === k.toLowerCase());
    if (lk && obj[lk] != null && obj[lk] !== "") return obj[lk];
  }
  return undefined;
}

function flattenPayload(json) {
  if (!json || typeof json !== "object") return {};
  const data = json.data && typeof json.data === "object" ? json.data : {};
  const attrs = data.attributes && typeof data.attributes === "object" ? data.attributes : {};
  const payment = json.payment && typeof json.payment === "object" ? json.payment : {};
  const order = json.order && typeof json.order === "object" ? json.order : {};
  return { ...json, ...data, ...attrs, ...payment, ...order };
}

export function verifyWebhook(req, rawBody, secret) {
  if (!secret) return true;
  const h = req.headers || {};
  const auth = String(h.authorization || h["x-api-key"] || h["x-kitifi-key"] || "").trim();
  if (auth === secret || auth === `Bearer ${secret}`) return true;
  const sig = String(h["x-kitifi-signature"] || h["x-signature"] || h["x-webhook-signature"] || "").trim();
  if (!sig) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const candidates = [sig, sig.replace(/^sha256=/i, "")];
  for (const c of candidates) {
    try {
      const a = Buffer.from(expected, "hex");
      const b = Buffer.from(c, "hex");
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
    } catch {}
    try {
      const a = Buffer.from(expected);
      const b = Buffer.from(c);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
    } catch {}
  }
  return false;
}

export function isPaidStatus(status) {
  return /^(paid|success|succeeded|completed|complete|ok|approved)$/i.test(String(status || "").trim());
}

// Pull payment fields from KitFi / generic GCash webhook JSON.
export function parsePaymentEvent(json) {
  const p = flattenPayload(json);
  const status = pick(p, ["status", "payment_status", "state", "event", "type"]);
  const amountRaw = pick(p, ["amount", "transaction_amount", "paid_amount", "total", "price"]);
  const amount = Number(String(amountRaw || "0").replace(/,/g, ""));
  const reference = String(
    pick(p, ["reference_id", "reference", "order_id", "transaction_id", "id", "payment_id", "txn_id"]) || ""
  ).trim();
  const voucher = String(pick(p, ["voucher", "voucher_code", "code", "username", "user"]) || "").trim();
  const profile = String(pick(p, ["profile", "package", "plan", "hotspot_profile"]) || "").trim();
  const uptime = String(pick(p, ["uptime", "limit_uptime", "duration", "validity"]) || "").trim();
  const phone = String(pick(p, ["phone", "mobile", "mobile_number", "msisdn", "number"]) || "").trim();
  const mac = String(pick(p, ["mac", "mac_address", "client_mac"]) || "").trim();
  if (!reference && !amount && !voucher && !status) return null;
  return { status: String(status || ""), amount, reference, voucher, profile, uptime, phone, mac };
}

// Map peso amount → hotspot profile using settings JSON, e.g. {"5":"2h","10":"4h"}.
export function profileForAmount(amountPhp, planMapJson, fallback = "default") {
  let map = {};
  try { map = JSON.parse(planMapJson || "{}"); } catch {}
  const keys = Object.keys(map).map(Number).filter((n) => !Number.isNaN(n)).sort((a, b) => b - a);
  const amt = Number(amountPhp) || 0;
  for (const k of keys) {
    if (amt >= k) return map[String(k)] || map[k] || fallback;
  }
  return fallback;
}
