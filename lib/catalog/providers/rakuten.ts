import type { ImportProductRecord } from "@/lib/catalog/types";
import type { CatalogProvider } from "@/lib/catalog/providers/types";

/**
 * Rakuten Advertising product search integration.
 * Requires credentials — returns empty when not configured.
 *
 * Env:
 *   RAKUTEN_ACCESS_TOKEN — OAuth/API token from Rakuten Advertising developer portal
 *   RAKUTEN_AFFILIATE_ID — Site ID / affiliate identifier
 *   RAKUTEN_MID — Merchant ID filter (optional)
 */
export class RakutenCatalogProvider implements CatalogProvider {
  id = "rakuten" as const;
  name = "Rakuten Advertising";

  isConfigured(): boolean {
    return Boolean(
      process.env.RAKUTEN_ACCESS_TOKEN?.trim() &&
        process.env.RAKUTEN_AFFILIATE_ID?.trim()
    );
  }

  async fetchProducts(options?: {
    limit?: number;
    query?: string;
  }): Promise<ImportProductRecord[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const token = process.env.RAKUTEN_ACCESS_TOKEN!.trim();
    const mid = process.env.RAKUTEN_MID?.trim();
    const limit = Math.min(options?.limit ?? 50, 100);
    const keyword = options?.query ?? "designer fashion";

    // Rakuten Product Search API (Links API) — structure only; endpoint may vary by account tier.
    const params = new URLSearchParams({
      keyword,
      max: String(limit),
      sort: "relevance",
    });
    if (mid) params.set("mid", mid);

    const base =
      process.env.RAKUTEN_PRODUCT_SEARCH_URL ??
      "https://api.rakutenmarketing.com/productsearch/1.0";

    try {
      const res = await fetch(`${base}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(20_000),
      });

      if (!res.ok) {
        console.warn(`Rakuten API HTTP ${res.status} — check credentials and endpoint`);
        return [];
      }

      const data = (await res.json()) as {
        products?: Array<{
          productid?: string;
          productname?: string;
          linkurl?: string;
          imageurl?: string;
          price?: { amount?: string; currency?: string };
          category?: { primary?: string };
          merchantname?: string;
          instock?: boolean;
        }>;
      };

      return (data.products ?? [])
        .filter((p) => p.linkurl && p.productname)
        .map((p) => ({
          sourceType: "rakuten" as const,
          sourceProductId: p.productid,
          productName: p.productname!,
          productUrl: p.linkurl!,
          affiliateUrl: p.linkurl,
          affiliateNetwork: "rakuten" as const,
          retailerName: p.merchantname,
          imageUrl: p.imageurl,
          imageSource: "rakuten" as const,
          price: Number(p.price?.amount ?? 0),
          currency: (p.price?.currency ?? "USD").toUpperCase(),
          category: mapRakutenCategory(p.category?.primary),
          inventoryStatus: p.instock === false ? "sold-out" : "in-stock",
        }))
        .filter((p) => p.price > 0);
    } catch (err) {
      console.warn("Rakuten fetch failed:", err);
      return [];
    }
  }
}

function mapRakutenCategory(primary?: string): string {
  if (!primary) return "tops";
  const lower = primary.toLowerCase();
  if (lower.includes("dress")) return "dresses";
  if (lower.includes("shoe") || lower.includes("footwear")) return "shoes";
  if (lower.includes("bag") || lower.includes("handbag")) return "handbags";
  if (lower.includes("outer") || lower.includes("jacket") || lower.includes("coat")) {
    return "outerwear";
  }
  if (lower.includes("pant") || lower.includes("trouser") || lower.includes("jean")) {
    return "bottoms";
  }
  if (lower.includes("skirt")) return "bottoms";
  return "tops";
}

export function getRakutenStatus(): {
  configured: boolean;
  message: string;
} {
  const provider = new RakutenCatalogProvider();
  if (provider.isConfigured()) {
    return { configured: true, message: "Rakuten credentials present — ready for ingestion" };
  }
  return {
    configured: false,
    message:
      "Rakuten integration scaffolded — set RAKUTEN_ACCESS_TOKEN and RAKUTEN_AFFILIATE_ID to enable",
  };
}