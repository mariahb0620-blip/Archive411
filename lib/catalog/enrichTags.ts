/**
 * Optional OpenAI tag enrichment for ALREADY VERIFIED products.
 * Never creates or modifies URLs, prices, retailers, inventory, images, or verification status.
 */
import type { Product } from "@/app/types/domain";
import {
  ALLOWED_CLIMATE_TAGS,
  ALLOWED_COLOR_TAGS,
  ALLOWED_OCCASION_TAGS,
  ALLOWED_PRESENTATION_TAGS,
  ALLOWED_STYLE_TAGS,
  ENRICHMENT_JSON_SCHEMA,
  assertNoForbiddenEnrichmentFields,
  filterTagsToAllowlist,
} from "@/lib/catalog/tagAllowlists";

export interface TagEnrichmentResult {
  styleTags: string[];
  occasionTags: string[];
  presentationTags: string[];
  climateTags: string[];
  colorTags: string[];
  stylingNotes?: string;
  skipped: boolean;
  reason?: string;
  model?: string;
}

export interface EnrichmentInput {
  name: string;
  category: string;
  subcategory?: string;
  designerCity?: string;
  aestheticTags: string[];
  occasionTags: string[];
  presentationTags: string[];
  climateTags: string[];
  departmentTags?: string[];
  footwearType?: string;
  heelHeight?: string;
}

function buildEnrichmentInput(product: Product): EnrichmentInput {
  return {
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    designerCity: product.designerCity,
    aestheticTags: product.aestheticTags,
    occasionTags: product.occasionTags,
    presentationTags: product.presentationTags,
    climateTags: product.climateTags,
    departmentTags: product.departmentTags,
    footwearType: product.footwearType,
    heelHeight: product.heelHeight,
  };
}

function fallbackResult(product: Product, reason: string): TagEnrichmentResult {
  return {
    styleTags: product.styleTags ?? [],
    occasionTags: product.occasionTags,
    presentationTags: product.presentationTags,
    climateTags: product.climateTags,
    colorTags: product.colorTags ?? [],
    skipped: true,
    reason,
  };
}

export function validateAndNormalizeEnrichment(
  product: Product,
  raw: Record<string, unknown>
): TagEnrichmentResult {
  assertNoForbiddenEnrichmentFields(raw);

  const styleTags = filterTagsToAllowlist(
    raw.styleTags as string[] | undefined,
    ALLOWED_STYLE_TAGS,
    product.styleTags ?? product.aestheticTags ?? []
  );
  const occasionTags = filterTagsToAllowlist(
    raw.occasionTags as string[] | undefined,
    ALLOWED_OCCASION_TAGS,
    product.occasionTags
  );
  const presentationTags = filterTagsToAllowlist(
    raw.presentationTags as string[] | undefined,
    ALLOWED_PRESENTATION_TAGS,
    product.presentationTags,
    4
  );
  const climateTags = filterTagsToAllowlist(
    raw.climateTags as string[] | undefined,
    ALLOWED_CLIMATE_TAGS,
    product.climateTags,
    6
  );
  const colorTags = filterTagsToAllowlist(
    raw.colorTags as string[] | undefined,
    ALLOWED_COLOR_TAGS,
    product.colorTags ?? [],
    8
  );

  const stylingNotes =
    typeof raw.stylingNotes === "string" && raw.stylingNotes.trim()
      ? raw.stylingNotes.trim().slice(0, 280)
      : undefined;

  return {
    styleTags,
    occasionTags,
    presentationTags,
    climateTags,
    colorTags,
    stylingNotes,
    skipped: false,
  };
}

/** Apply enrichment to tag fields only — commerce/verification fields are immutable. */
export function applyEnrichmentToProduct(
  product: Product,
  enrichment: TagEnrichmentResult
): Product {
  if (enrichment.skipped) return product;

  return {
    ...product,
    styleTags: enrichment.styleTags,
    occasionTags: enrichment.occasionTags,
    presentationTags: enrichment.presentationTags,
    climateTags: enrichment.climateTags,
    colorTags: enrichment.colorTags,
    updatedAt: new Date().toISOString(),
  };
}

export async function enrichProductTags(product: Product): Promise<TagEnrichmentResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return fallbackResult(product, "OPENAI_API_KEY not set");
  }

  if (product.verificationStatus !== "verified" || product.verified === false) {
    return fallbackResult(product, "Product not verified");
  }

  const model = process.env.OPENAI_ENRICHMENT_MODEL ?? "gpt-4o-mini";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: {
          type: "json_schema",
          json_schema: ENRICHMENT_JSON_SCHEMA,
        },
        messages: [
          {
            role: "system",
            content: [
              "You enrich fashion product styling metadata from existing verified product facts.",
              "Output must match the JSON schema exactly.",
              "Use only tags that fit the product name, category, and existing tags.",
              "Do NOT invent URLs, prices, sizes, retailers, inventory, images, or product names.",
              "Allowed presentation: feminine, masculine, androgynous, gender-neutral.",
              "Allowed occasions include: date night, nightlife, everyday, work, events, travel, weekend, formal, evening.",
              "stylingNotes is a brief internal styling hint (max 280 chars), not a product description with new facts.",
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify(buildEnrichmentInput(product)),
          },
        ],
      }),
      signal: AbortSignal.timeout(Number(process.env.OPENAI_TIMEOUT_MS ?? 30_000)),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return fallbackResult(product, `OpenAI HTTP ${res.status}${errText ? `: ${errText.slice(0, 120)}` : ""}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return fallbackResult(product, "OpenAI returned empty content");
    }

    const parsed = JSON.parse(content) as Record<string, unknown>;
    const normalized = validateAndNormalizeEnrichment(product, parsed);
    return { ...normalized, model };
  } catch (err) {
    return fallbackResult(product, err instanceof Error ? err.message : "OpenAI request failed");
  }
}

/** Batch enrich verified products — use small limits for review before bulk runs. */
export async function enrichVerifiedProducts(
  products: Product[],
  options: { limit?: number; ids?: string[] } = {}
): Promise<Array<{ product: Product; before: TagEnrichmentResult; after: TagEnrichmentResult }>> {
  const verified = products.filter(
    (p) => p.verificationStatus === "verified" && p.verified !== false
  );
  let targets = verified;
  if (options.ids?.length) {
    const idSet = new Set(options.ids);
    targets = verified.filter((p) => idSet.has(p.id));
  }
  if (options.limit != null) {
    targets = targets.slice(0, options.limit);
  }

  const results: Array<{ product: Product; before: TagEnrichmentResult; after: TagEnrichmentResult }> = [];

  for (const product of targets) {
    const before: TagEnrichmentResult = {
      styleTags: product.styleTags ?? [],
      occasionTags: product.occasionTags,
      presentationTags: product.presentationTags,
      climateTags: product.climateTags,
      colorTags: product.colorTags ?? [],
      skipped: false,
    };
    const enrichment = await enrichProductTags(product);
    results.push({
      product: applyEnrichmentToProduct(product, enrichment),
      before,
      after: enrichment,
    });
  }

  return results;
}
