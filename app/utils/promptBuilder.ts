import type { BudgetTier, GenerationSettings } from "@/app/types/styling";

const BUDGET_INSTRUCTIONS: Record<BudgetTier, string> = {
  "under-200":
    "Keep total outfit cost under $200. Prioritize Macy's accessible staples and select only one modest premium accent piece if needed.",
  "200-500":
    "Target a total outfit range of $200–$500. Balance Macy's foundations with one considered luxury accessory or footwear piece.",
  "500-1000":
    "Target a total outfit range of $500–$1,000. Mix Macy's tailored staples with 1–2 premium designer elements.",
  "1000-plus":
    "Budget allows $1,000+ per look. Lead with luxury outerwear or footwear while grounding with select Macy's basics.",
  "high-low-blend":
    "Apply a High-Low Blend (Mixed) strategy: target a 60/40 accessible-to-luxury price ratio. Anchor with Macy's staples and elevate with 1–2 premium luxury pieces.",
  "no-limit":
    "No Price Limit — prioritize editorial impact and runway-adjacent curation over cost constraints. Source freely across Macy's and top-tier luxury retailers.",
};

export function buildStylingPrompt(settings: GenerationSettings): string {
  const categories =
    settings.categories.length > 0
      ? settings.categories.join(", ")
      : "open editorial mix";

  const modeInstruction =
    settings.mode === "random"
      ? "Generate unexpected but cohesive combinations. Embrace creative tension while maintaining wearability."
      : "Follow the user's curated preferences precisely. Each look must reflect their selected aesthetic and category constraints.";

  const budgetInstruction = BUDGET_INSTRUCTIONS[settings.budget];

  return [
    "You are an elite fashion stylist creating a premium editorial lookbook.",
    "",
    "## Client Profile",
    `- Generation mode: ${settings.mode}`,
    `- Categories: ${categories}`,
    `- Aesthetic direction: ${settings.aesthetic}`,
    `- Color palette: ${settings.colorPalette}`,
    `- Silhouette focus: ${settings.bodyFocus}`,
    `- Budget tier: ${settings.budget}`,
    "",
    "## Sourcing Strategy — High-Low Retail Mix",
    "Create a high-low editorial mix for every look:",
    "- Anchor each outfit with accessible staples sourced from Macy's (tailored blazers, quality denim, classic knits, versatile trousers).",
    "- Elevate with 1–2 premium luxury elements (designer footwear, statement outerwear, fine accessories, investment bags).",
    budgetInstruction,
    "",
    "## Styling Directives",
    modeInstruction,
    `- Maintain a ${settings.colorPalette} color story across all twelve looks.`,
    `- Reflect a ${settings.aesthetic} aesthetic with ${settings.bodyFocus} proportions.`,
    "",
    "## Output Requirements",
    "Return exactly 12 distinct outfit looks. For each look provide:",
    "- title: editorial look name",
    "- tagline: one-line mood description",
    "- garments: array of items with name, brand, price, retailer (macys | luxury), and product URL",
    "- totalPrice: sum of garment prices",
    "",
    "Ensure variety across occasions while honoring the selected categories. No duplicate garment combinations.",
  ].join("\n");
}
