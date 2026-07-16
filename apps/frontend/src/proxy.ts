import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL || "https://dr-pediatre-cms.vercel.app";

const intlMiddleware = createMiddleware(routing);

// Cache en mémoire (parfaitement adapté pour ton VPS/LXC persistant sur Coolify)
const tenantCache = new Map<
  string,
  { id: string; slug: string; name: string } | null
>();

async function resolveTenant(
  hostname: string,
): Promise<{ id: string; slug: string; name: string } | null> {
  // Nettoie le port si présent (ex: drguinane.drixou.uk:3000 -> drguinane.drixou.uk)
  const cleanHostname = hostname.split(":")[0];

  if (tenantCache.has(cleanHostname))
    return tenantCache.get(cleanHostname) ?? null;

  try {
    const url = `${CMS_URL}/api/resolve-tenant?domain=${encodeURIComponent(cleanHostname)}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      tenantCache.set(cleanHostname, null);
      return null;
    }
    const json = await res.json();
    if (json?.tenant) {
      // Sécurise le typage en forçant en String pour les en-têtes HTTP
      const tenant = {
        id: String(json.tenant.id),
        slug: json.tenant.slug || String(json.tenant.id),
        name: json.tenant.name,
      };
      tenantCache.set(cleanHostname, tenant);
      return tenant;
    }
    tenantCache.set(cleanHostname, null);
    return null;
  } catch {
    tenantCache.set(cleanHostname, null);
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  // 1. Extraction du domaine compatible avec le Reverse Proxy Coolify/Traefik
  const hostname =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // 2. Résolution du cabinet (tenant)
  const tenant = await resolveTenant(hostname);

  // 3. Injection dans la REQUÊTE (indispensable pour headers() dans les Server Components)
  if (tenant) {
    request.headers.set("x-tenant-id", tenant.id);
    request.headers.set("x-tenant-slug", tenant.slug);
  } else {
    request.headers.set("x-tenant-id", "default");
    request.headers.set("x-tenant-slug", "default");
  }

  // 4. Exécution du middleware next-intl avec la requête enrichie
  const response = intlMiddleware(request);

  // 5. Injection dans la RÉPONSE (sans cloner, pour préserver la logique interne de next-intl)
  if (tenant) {
    response.headers.set("x-tenant-id", tenant.id);
    response.headers.set("x-tenant-slug", tenant.slug);
  } else {
    response.headers.set("x-tenant-id", "default");
    response.headers.set("x-tenant-slug", "default");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
