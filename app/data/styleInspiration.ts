/**
 * Style inspiration directions — mapped from Concepts PDF part 2.
 * Used as opt-in questionnaire chips; never assigned from user identity.
 */
export const STYLE_INSPIRATION_OPTIONS = [
  {
    id: "downtown-tailoring",
    label: "Downtown tailoring",
    tags: ["streetwear", "tailoring", "knitwear", "relaxed"],
    description: "Relaxed tailoring, knitwear, and wearable experimentation.",
  },
  {
    id: "luxury-streetwear",
    label: "Luxury streetwear",
    tags: ["streetwear", "quiet-luxury", "experimental", "layering"],
    description: "Oversized silhouettes, luxury mixed with sport and street.",
  },
  {
    id: "avant-garde-dark",
    label: "Avant-garde dark",
    tags: ["avant-garde", "goth", "experimental", "rick-owens-adjacent"],
    description: "Dramatic proportion, dark palettes, sculptural pieces.",
  },
  {
    id: "y2k-nightlife",
    label: "Y2K nightlife",
    tags: ["y2k", "hot-girl-y2k", "going-out", "nightlife"],
    description: "Body-conscious pieces, metallics, platform footwear.",
  },
  {
    id: "black-luxury-style",
    label: "Black luxury style",
    tags: ["afrofuturism", "quiet-luxury", "tailoring", "statement-accessories"],
    description: "Tailoring, logo culture, aspiration, and custom references.",
  },
  {
    id: "gender-fluid-club",
    label: "Gender-fluid club",
    tags: ["gender-fluid-fashion", "queer", "experimental", "nightlife"],
    description: "Club culture, kilts, makeup, exaggerated tailoring.",
  },
  {
    id: "paris-vintage-menswear",
    label: "Paris vintage menswear",
    tags: ["vintage", "tailoring", "masculine", "workwear"],
    description: "Vintage suiting, military references, French style history.",
  },
  {
    id: "afro-diaspora-paris",
    label: "Afro-diaspora Paris",
    tags: ["afrofuturism", "streetwear", "color", "tailoring"],
    description: "Contemporary Black Paris style with diaspora references.",
  },
  {
    id: "minimal-scandi",
    label: "Minimal Scandi",
    tags: ["minimal", "quiet-luxury", "neutral", "androgynous"],
    description: "Clean lines, wide trousers, understated luxury.",
  },
  {
    id: "harajuku-alt",
    label: "Harajuku alt",
    tags: ["y2k", "experimental", "platform-boots", "kawaii-adjacent"],
    description: "Platform footwear, layered skirts, alt/kawaii references.",
  },
] as const;

export type StyleInspirationId = (typeof STYLE_INSPIRATION_OPTIONS)[number]["id"];

export function inspirationTagsForIds(ids: string[]): string[] {
  const tags = new Set<string>();
  for (const id of ids) {
    const opt = STYLE_INSPIRATION_OPTIONS.find((o) => o.id === id);
    opt?.tags.forEach((t) => tags.add(t));
  }
  return [...tags];
}
