/**
 * Optional OpenAI tag enrichment for ALREADY VERIFIED products.
 * Never generates URLs, prices, inventory, or images.
 */
import type { Product } from "@/app/types/domain";

const ALLOWED_PRESENTATION = ["feminine", "masculine", "androgynous", "gender-neutral"];
const ALLOWED_OCCASIONS = [
  "date night",
  "nightlife",
  "everyday",
  "work",
  "events",
  "travel",
  "weekend",
  "formal",
  "evening",
];
const ALLOWED_CLIMATE = ["warm", "cold", "temperate", "summer", "winter", "autumn", "spring"];

export interface TagEnrichmentResult {
  styleTags: string[];
  occasionTags: string[];
  presentationTags: string[];
  climateTags: string[];
  colorTags: string[];
  skipped: boolean;
  reason?: string;
}

export async function enrichProductTags(product: Product): Promise<TagEnrichmentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      styleTags: product.styleTags ?? [],
      occasionTags: product.occasionTags,
      presentationTags: product.presentationTags,
      climateTags: product.climateTags,
      colorTags: product.colorTags ?? [],
      skipped: true,
      reason: "OPENAI_API_KEY not set",
    };
  }

  if (product.verificationStatus !== "verified") {
    return {
      styleTags: product.styleTags ?? [],
      occasionTags: product.occasionTags,
      presentationTags: product.presentationTags,
      climateTags: product.climateTags,
      colorTags: product.colorTags ?? [],
      skipped: true,
      reason: "Product not verified",
    };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You enrich fashion product tags from existing real product metadata. Output JSON only with keys: styleTags, occasionTags, presentationTags, climateTags, colorTags (string arrays). Do NOT invent URLs, prices, sizes, retailers, or images. Use only allowed enum values where possible.",
          },
          {
            role: "user",
            content: JSON.stringify({
              name: product.name,
              category: product.category,
              subcategory: product.subcategory,
              designerCity: product.designerCity,
              existingAestheticTags: product.aestheticTags,
              existingOccasionTags: product.occasionTags,
              existingPresentationTags: product.presentationTags,
              existingClimateTags: product.climateTags,
            }),
          },
        ],
      }),
    });

    if (!res.ok) {
      return {
        styleTags: product.styleTags ?? [],
        occasionTags: product.occasionTags,
        presentationTags: product.presentationTags,
        climateTags: product.climateTags,
        colorTags: product.colorTags ?? [],
        skipped: true,
        reason: `OpenAI HTTP ${res.status}`,
      };
    }

    const data = await res.json();
    const content = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as {
      styleTags?: string[];
      occasionTags?: string[];
      presentationTags?: string[];
      climateTags?: string[];
      colorTags?: string[];
    };

    return {
      styleTags: content.styleTags ?? product.styleTags ?? [],
      occasionTags: filterAllowed(content.occasionTags, ALLOWED_OCCASIONS, product.occasionTags),
      presentationTags: filterAllowed(
        content.presentationTags,
        ALLOWED_PRESENTATION,
        product.presentationTags
      ),
      climateTags: filterAllowed(content.climateTags, ALLOWED_CLIMATE, product.climateTags),
      colorTags: (content.colorTags ?? product.colorTags ?? []).slice(0, 8),
      skipped: false,
    };
  } catch {
    return {
      styleTags: product.styleTags ?? [],
      occasionTags: product.occasionTags,
      presentationTags: product.presentationTags,
      climateTags: product.climateTags,
      colorTags: product.colorTags ?? [],
      skipped: true,
      reason: "OpenAI request failed",
    };
  }
}

function filterAllowed(
  incoming: string[] | undefined,
  allowed: string[],
  fallback: string[]
): string[] {
  if (!incoming?.length) return fallback;
  const normalized = incoming.map((t) => t.toLowerCase());
  const filtered = normalized.filter((t) => allowed.some((a) => t.includes(a) || a.includes(t)));
  return filtered.length ? filtered : fallback;
}
