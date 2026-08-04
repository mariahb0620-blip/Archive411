/**
 * Fashion communities and cultural style families.
 * These are creative influences for discovery — never assigned to users automatically.
 */

export interface StyleCommunity {
  id: string;
  publicName: string;
  description: string;
  searchAesthetics: string[];
  cities?: string[];
  /** Shown in UI — clarifies this is fashion influence, not identity requirement. */
  explorationNote: string;
}

export const STYLE_COMMUNITIES: StyleCommunity[] = [
  {
    id: "black-street-style",
    publicName: "Black Street Style",
    description:
      "Street style across cities, generations and music scenes — from luxury streetwear to elegant, preppy, avant-garde and minimal expressions.",
    searchAesthetics: [
      "elevated-streetwear",
      "luxury-streetwear",
      "afrofuturism",
      "designer-sneakers",
      "vintage-designer",
      "high-low",
    ],
    cities: ["New York City", "London", "Paris", "Lagos", "Atlanta"],
    explorationNote:
      "A fashion community and creative influence — open to anyone interested in this aesthetic direction.",
  },
  {
    id: "hot-girl-y2k",
    publicName: "Hot-Girl Y2K",
    description:
      "Confident, playful Y2K energy — low-rise silhouettes, draped minis, sheer layering and vacation nightlife dressing.",
    searchAesthetics: [
      "y2k",
      "body-conscious",
      "low-rise",
      "playful",
      "chic-and-sexy",
      "vacation-nightlife",
    ],
    explorationNote: "Style direction inspired by contemporary pop and nightlife fashion — not a celebrity endorsement.",
  },
  {
    id: "black-latino-mens-street",
    publicName: "Black and Latino Men's Street Style",
    description:
      "Contemporary menswear across New York, Miami, London and beyond — distinct influences, shared street-style energy.",
    searchAesthetics: [
      "luxury-streetwear",
      "elevated-streetwear",
      "stacked-denim",
      "varsity",
      "technical-sneakers",
      "gender-expansive",
    ],
    cities: ["New York City", "Los Angeles", "London", "Miami"],
    explorationNote:
      "Black and Latino men's fashion are related but not identical — explore each city's distinct references.",
  },
  {
    id: "tokyo-street",
    publicName: "Tokyo Street Style",
    description:
      "Layering, deconstruction, archive designer references and gender-neutral styling from Shibuya to Harajuku.",
    searchAesthetics: ["avant-garde", "deconstructed", "layered-black", "street-style", "archive-fashion"],
    cities: ["Tokyo"],
    explorationNote: "One of several East Asian fashion ecosystems — combinable with Korean or Southeast Asian directions.",
  },
  {
    id: "korean-street",
    publicName: "Seoul Street Style",
    description:
      "Polished streetwear, clean layering, Y2K nightlife and contemporary Seoul designer fashion.",
    searchAesthetics: ["y2k", "nightlife", "minimalist", "preppy", "contemporary"],
    cities: ["Seoul"],
    explorationNote: "Distinct from Tokyo street style — supports idol-inspired nightlife without copying exact looks.",
  },
  {
    id: "thai-vietnamese-street",
    publicName: "Bangkok & HCMC Street Style",
    description:
      "Humid-climate dressing, handmade labels, deconstructed denim and concept-store curation across Southeast Asia.",
    searchAesthetics: ["resort-wear", "handmade", "deconstructed", "y2k", "nightlife", "gender-expansive"],
    cities: ["Bangkok", "Ho Chi Minh City"],
    explorationNote: "Thai and Vietnamese fashion communities are separate ecosystems that can be combined intentionally.",
  },
  {
    id: "alternative",
    publicName: "Alternative Fashion",
    description:
      "Punk, goth, cyber, grunge, visual kei-inspired and coquette-alt — combinable without conflating every subculture.",
    searchAesthetics: ["punk", "goth", "grunge", "experimental", "cyber-y2k", "dark-romantic"],
    explorationNote: "Major category — not a niche afterthought. Mix freely: kawaii + streetwear, alt + tailoring, etc.",
  },
  {
    id: "kawaii",
    publicName: "Kawaii & Pink-and-White",
    description:
      "From subtle references to full expression — platform Mary Janes, layered skirts, ribbon details and pastel palettes.",
    searchAesthetics: ["kawaii", "pastel", "platform", "feminine", "playful"],
    explorationNote: "Intensity is adjustable — a subtle look might be white Mary Janes and one bow accessory.",
  },
];

export const COVERAGE_LEVEL_OPTIONS = [
  { id: "covered", label: "Covered", description: "Full coverage — layering without sheer exposure." },
  { id: "subtle", label: "Subtle", description: "Hints of skin through sheer panels or strategic cutouts." },
  { id: "balanced", label: "Balanced", description: "Mix of covered and revealing elements." },
  { id: "bold", label: "Bold", description: "Body-conscious, open backs, cutouts and sheer layering." },
  { id: "no-preference", label: "No preference", description: "Show the full range within your other preferences." },
] as const;

export const KAWAII_INTENSITY_OPTIONS = [
  { id: "subtle-reference", label: "Subtle reference", description: "One or two kawaii details on a wearable base." },
  { id: "wearable", label: "Wearable", description: "Recognizable aesthetic without full costume energy." },
  { id: "statement", label: "Statement", description: "Bold color, platforms and coordinated accessories." },
  { id: "full-expression", label: "Full expression", description: "Layered skirts, ruffles, bows and platform boots." },
] as const;

export const CULTURAL_DISCOVERY_SECTIONS = [
  {
    id: "black-street-now",
    title: "Black Street Style Now",
    href: "/discover?community=black-street-style",
    description:
      "Luxury streetwear, vintage designer, elegant tailoring and experimental expressions across the diaspora.",
  },
  {
    id: "nyc-after-dark",
    title: "New York After Dark",
    href: "/discover?community=hot-girl-y2k&city=New York City",
    description: "Downtown nightlife, corsetry, elevated streetwear and sample-room showrooms.",
  },
  {
    id: "mens-street-edit",
    title: "Black and Latino Men's Edit",
    href: "/discover?community=black-latino-mens-street",
    description:
      "Wide-leg trousers, varsity layers, technical sneakers and gender-expansive styling — handbags welcome.",
  },
  {
    id: "hot-girl-y2k",
    title: "Hot-Girl Y2K",
    href: "/discover?community=hot-girl-y2k",
    description: "Low-rise, draped minis, platform heels and playful vacation nightlife.",
  },
  {
    id: "seoul-street",
    title: "Seoul Street Style",
    href: "/discover?community=korean-street",
    description: "Polished layering, Y2K nightlife and contemporary Seoul designers.",
  },
  {
    id: "tokyo-alt",
    title: "Tokyo Alternative",
    href: "/discover?community=tokyo-street",
    description: "Deconstructed tailoring, archive fashion and gender-neutral layering.",
  },
  {
    id: "bangkok-independent",
    title: "Bangkok Independent",
    href: "/discover?community=thai-vietnamese-street&city=Bangkok",
    description: "Handmade labels, resort-to-city dressing and humid-climate nightlife.",
  },
  {
    id: "hcmc-new-wave",
    title: "Ho Chi Minh City New Wave",
    href: "/discover?community=thai-vietnamese-street&city=Ho Chi Minh City",
    description: "Concept stores, local labels and appointment-based styling studios.",
  },
  {
    id: "kawaii-platforms",
    title: "Kawaii Platforms",
    href: "/discover?community=kawaii",
    description: "Platform Mary Janes, layered skirts and pink-and-white palettes at your chosen intensity.",
  },
  {
    id: "london-alt",
    title: "London Alt",
    href: "/discover?community=alternative&city=London",
    description: "Punk, corsetry, plaid and romantic-hard footwear combinations.",
  },
  {
    id: "paris-archive-footwear",
    title: "Paris Archive Footwear",
    href: "/showrooms/paris-archive-showroom-reference",
    description: "Tabi-inspired flats, sculptural heels and private showroom fittings.",
  },
  {
    id: "diaspora-emerging",
    title: "Emerging Designers Across the Diaspora",
    href: "/independent",
    description: "Independent labels from Lagos, London, New York and beyond.",
  },
] as const;

export function getStyleCommunity(id: string): StyleCommunity | undefined {
  return STYLE_COMMUNITIES.find((c) => c.id === id);
}

export function communitySearchAesthetics(communityIds: string[]): string[] {
  const tags = new Set<string>();
  for (const id of communityIds) {
    const c = getStyleCommunity(id);
    c?.searchAesthetics.forEach((t) => tags.add(t));
  }
  return [...tags];
}

/** Communities that benefit from coverage-level filtering. */
export const COVERAGE_AWARE_COMMUNITIES = new Set(["hot-girl-y2k"]);
export const KAWAII_COMMUNITY_ID = "kawaii";
