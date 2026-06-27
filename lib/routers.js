// lib/routers.js — MikroTik client factory (single or multi-router ready).
import { RouterOSAPI } from "./routeros-api.js";
import { MikroTik } from "./mikrotik.js";

const MODE = (process.env.MIKROTIK_MODE || "api").toLowerCase();

export function routerConfigFromRecord(r) {
  if (!r) return { host: "", port: 8728, user: "", password: "", ssl: false };
  return {
    id: r.id,
    name: r.name || "",
    host: String(r.host || "").split(":")[0],
    port: Number(r.port) || (r.ssl ? 8729 : 8728),
    user: r.username || "",
    password: r.password || "",
    ssl: r.ssl === 1 || r.ssl === true,
  };
}

export function createMtClient(cfg) {
  if (!cfg || !cfg.host) {
    return new RouterOSAPI({ host: "", user: "", password: "", port: 8728, ssl: false });
  }
  if (MODE === "rest") {
    return new MikroTik({
      host: cfg.host,
      user: cfg.user,
      password: cfg.password,
      verifyTls: process.env.MIKROTIK_TLS_VERIFY === "true",
    });
  }
  return new RouterOSAPI({
    host: cfg.host,
    user: cfg.user,
    password: cfg.password,
    port: cfg.port || (cfg.ssl ? 8729 : 8728),
    ssl: !!cfg.ssl,
  });
}

export async function testRouterConnection(cfg) {
  if (!cfg?.host) return { connected: false, error: "Host/IP is required." };
  const client = createMtClient(cfg);
  try {
    const id = await client.identity();
    const clk = await client.clock().catch(() => null);
    try { client.close && client.close(); } catch {}
    return { connected: true, host: cfg.host, port: cfg.port, identity: id, clock: clk };
  } catch (e) {
    try { client.close && client.close(); } catch {}
    return { connected: false, host: cfg.host, port: cfg.port, error: e.message };
  }
}
