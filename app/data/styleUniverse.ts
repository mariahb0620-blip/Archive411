/**
 * Archive411 Style Universe — creative references, not partnerships.
 * Celebrity names map to style attributes only; never used in public lookbook titles
 * unless the user explicitly searches for that style direction.
 */

export const STYLE_ENERGY = [
  "cool",
  "sexy",
  "chic",
  "experimental",
  "youthful",
  "editorial",
  "street-style",
  "fashion-aware",
  "globally-influenced",
  "wearable-unexpected",
] as const;

/** Internal style-direction references — searchable, not endorsement. */
export const STYLE_DIRECTION_REFERENCES = {
  "playful-y2k-body-conscious": {
    label: "Playful Y2K body-conscious",
    attributes: [
      "y2k",
      "feminine",
      "playful",
      "body-conscious",
      "low-rise",
      "cropped",
      "mini",
      "draped",
      "earth-tones",
      "bright-accents",
      "textural",
      "vacation-nightlife",
      "emerging-designers",
      "movement-friendly",
    ],
    searchAliases: ["tyla", "tyla energy", "tyla-inspired", "playful y2k"],
  },
  "high-low-luxury-street": {
    label: "High-low luxury street",
    attributes: [
      "high-low",
      "luxury-streetwear",
      "oversized-outerwear",
      "statement-footwear",
      "unusual-proportions",
      "vintage-designer",
      "sporty-glamour",
      "strong-accessories",
      "monochrome",
      "sheer-layering",
      "body-conscious",
      "menswear-womenswear-mix",
    ],
    searchAliases: ["rihanna", "rihanna energy", "rihanna-inspired", "high low"],
  },
  "luxury-streetwear-tailoring": {
    label: "Luxury streetwear tailoring",
    attributes: [
      "luxury-streetwear",
      "tailoring-sportswear",
      "gender-expansive",
      "wide-leg",
      "kilt-layering",
      "technical-footwear",
      "vintage-denim",
      "statement-jacket",
      "preppy",
      "racing",
      "colorful-knitwear",
      "avant-garde-accessories",
      "designer-archive",
    ],
    searchAliases: ["asap rocky", "a$ap rocky", "rocky energy", "rocky-inspired"],
  },
  "pop-glamour-y2k-nightlife": {
    label: "Pop glamour Y2K nightlife",
    attributes: [
      "pop-glamour",
      "y2k",
      "nightlife",
      "mini",
      "metallic",
      "corsetry",
      "fitted-dress",
      "feminine-tailoring",
      "statement-boots",
      "platform",
      "bright-colors",
      "stage-wearable",
      "playful-polish",
    ],
    searchAliases: ["zara larsson", "larsson energy", "pop glamour", "stage nightlife"],
  },
} as const;

export type StyleDirectionId = keyof typeof STYLE_DIRECTION_REFERENCES;

export interface CityFashionProfile {
  city: string;
  country: string;
  neighborhoods: string[];
  energy: string[];
  aestheticTags: string[];
  /** Reference brand names for search matching — not partnership claims. */
  brandKeywords: string[];
  productDirections: string[];
}

export const CITY_FASHION_PROFILES: CityFashionProfile[] = [
  {
    city: "Ho Chi Minh City",
    country: "Vietnam",
    neighborhoods: ["District 1", "District 3", "Thao Dien"],
    energy: ["concept-store", "local-labels", "humid-climate", "nightlife", "streetwear"],
    aestheticTags: ["contemporary", "y2k", "deconstructed", "sheer", "low-rise", "sculptural"],
    brandKeywords: [
      "fanci club",
      "fancy club",
      "lsoul",
      "la lune",
      "moi dien",
      "môi điên",
      "datt",
      "beuter",
      "summer mermaid",
      "wet avocado",
      "wet avocado club",
      "chalay",
      "new playground",
      "rue miche",
    ],
    productDirections: [
      "low-rise trousers",
      "deconstructed denim",
      "draped mini",
      "sheer tops",
      "mesh layering",
      "sculptural skirts",
      "gender-neutral streetwear",
    ],
  },
  {
    city: "Bangkok",
    country: "Thailand",
    neighborhoods: ["Thonglor", "Ari", "Silom"],
    energy: ["independent", "resort", "handmade", "nightlife", "humid"],
    aestheticTags: ["resort-wear", "handmade", "crochet", "nightlife", "beach-to-night"],
    brandKeywords: ["chalay", "work from beach", "sretsis", "gentlewoman", "greyhound", "matter makers"],
    productDirections: ["crochet sets", "draped skirts", "vacation dresses", "artisan knitwear"],
  },
  {
    city: "New York City",
    country: "United States",
    neighborhoods: ["SoHo", "Lower East Side", "Brooklyn", "Williamsburg"],
    energy: ["street-style", "nightlife", "downtown", "elevated-streetwear"],
    aestheticTags: ["elevated-streetwear", "nightlife", "y2k", "workwear-glamour", "corsetry"],
    brandKeywords: [
      "guizio",
      "danielle guizio",
      "telfar",
      "luar",
      "sandy liang",
      "collina strada",
      "eckhaus latta",
      "area",
      "vaquera",
      "khaite",
      "mirror palais",
      "miaou",
      "ediketed",
      "jaded london",
    ],
    productDirections: [
      "low-rise denim",
      "corset tops",
      "baby tees",
      "statement leather",
      "wide-leg trousers",
      "sheer layering",
      "technical sneakers",
    ],
  },
  {
    city: "London",
    country: "United Kingdom",
    neighborhoods: ["Shoreditch", "Dalston", "Mayfair", "Soho"],
    energy: ["experimental", "punk", "corsetry", "terrace", "gender-expansive"],
    aestheticTags: ["experimental", "punk", "corsetry", "plaid", "deconstructed-tailoring"],
    brandKeywords: [
      "knwls",
      "poster girl",
      "dilara findikoglu",
      "chopova lowena",
      "simone rocha",
      "mowalola",
      "martine rose",
      "wales bonner",
      "charles jeffrey",
      "alkaia",
    ],
    productDirections: [
      "mini kilts",
      "skirts over trousers",
      "distressed knitwear",
      "romantic-hard footwear",
      "statement belts",
    ],
  },
  {
    city: "Paris",
    country: "France",
    neighborhoods: ["Le Marais", "Saint-Germain", "Belleville"],
    energy: ["runway", "archive", "avant-garde", "tailoring", "subversive-elegance"],
    aestheticTags: ["runway-inspired", "archive-fashion", "body-conscious", "sheer", "sculptural"],
    brandKeywords: [
      "margiela",
      "marine serre",
      "mugler",
      "gaultier",
      "courreges",
      "coperni",
      "jacquemus",
      "rick owens",
      "alaia",
      "cavalli",
    ],
    productDirections: [
      "tabi footwear",
      "sculptural heels",
      "bias-cut skirts",
      "mesh layers",
      "archive prints",
      "subversive tailoring",
    ],
  },
  {
    city: "Tokyo",
    country: "Japan",
    neighborhoods: ["Shibuya", "Harajuku", "Shimokitazawa", "Daikanyama"],
    energy: ["subculture", "avant-garde", "layering", "archive", "gender-neutral"],
    aestheticTags: ["avant-garde", "deconstructed", "layered-black", "technical", "patchwork"],
    brandKeywords: [
      "comme des garcons",
      "yohji",
      "sacai",
      "undercover",
      "needles",
      "kapital",
      "ambush",
      "toga",
      "doublet",
    ],
    productDirections: [
      "deconstructed tailoring",
      "wide trousers",
      "asymmetric skirts",
      "platform shoes",
      "utilitarian bags",
    ],
  },
];

export const FOOTWEAR_STYLE_TAGS = [
  "technical-sneakers",
  "salomon-style",
  "tabi",
  "mary-janes",
  "kitten-heels",
  "sculptural-heels",
  "platform-boots",
  "combat-boots",
  "loafers",
  "ballet-flats",
  "vintage-footwear",
  "statement-boots",
] as const;

export const SILHOUETTE_TAGS = [
  "body-conscious",
  "low-rise",
  "oversized",
  "column",
  "wide-leg",
  "mini",
  "cropped",
  "sheer-layering",
  "deconstructed",
  "draped",
  "bias-cut",
  "gender-expansive",
] as const;

export const COVERAGE_TAGS = [
  "sheer",
  "strategic-cutout",
  "open-back",
  "full-coverage",
  "layered-coverage",
  "slit",
] as const;

/** Six look interpretations required per lookbook. */
export const LOOK_INTERPRETATIONS = [
  {
    id: "everyday",
    title: "Everyday Edit",
    description: "Wearable interpretation — easy separates you could actually live in.",
    requiredCategories: ["tops", "bottoms"] as const,
    preferredTags: ["everyday", "contemporary", "minimalist"],
    avoidDuplicateCategory: "dresses",
  },
  {
    id: "street-style",
    title: "Street-Style Edit",
    description: "Fashion-week energy — layering, proportion play and unexpected pairings.",
    requiredCategories: ["outerwear", "shoes"] as const,
    preferredTags: ["streetwear", "elevated-streetwear", "street-style"],
    avoidDuplicateCategory: null,
  },
  {
    id: "polished",
    title: "Polished Edit",
    description: "Elevated and intentional — tailoring, structure and refined accessories.",
    requiredCategories: ["outerwear", "handbags"] as const,
    preferredTags: ["tailored", "soft-tailoring", "quiet-luxury", "chic"],
    avoidDuplicateCategory: null,
  },
  {
    id: "nightlife",
    title: "Nightlife Edit",
    description: "Going-out interpretation — movement, texture and statement footwear.",
    requiredCategories: ["shoes"] as const,
    preferredTags: ["nightlife", "going-out", "clubwear", "chic-and-sexy"],
    preferCategories: ["dresses", "tops", "sets"] as const,
    avoidDuplicateCategory: null,
  },
  {
    id: "independent",
    title: "Independent Label Edit",
    description: "Emerging and local designers — concept stores and small-batch labels.",
    requiredCategories: [] as const,
    preferredTags: ["independent", "emerging", "handmade", "artisanal"],
    requireIndependent: true,
    avoidDuplicateCategory: null,
  },
  {
    id: "unexpected",
    title: "Unexpected Mix",
    description: "Cross-department styling — menswear with feminine pieces, vintage with contemporary.",
    requiredCategories: ["shoes", "handbags"] as const,
    preferredTags: ["experimental", "gender-expansive", "high-low"],
    requireMixedPresentation: true,
    avoidDuplicateCategory: null,
  },
] as const;

export const MIXED_STYLING_NOTES = [
  "Menswear blazer with a fitted mini dress and technical sneakers.",
  "Wide menswear trousers with a corset top and Mary Janes.",
  "Feminine sheer top with masculine cargo trousers and loafers.",
  "Skirt layered over menswear trousers with technical sneakers.",
  "Oversized jersey with a mini skirt and tall boots.",
  "Tailored suit with a sheer shirt and sculptural handbag.",
  "Body-conscious dress with an oversized leather jacket.",
  "Cropped menswear jacket with a draped skirt and Tabi-inspired flats.",
];

/** Parse user query for style-direction references and city/brand keywords. */
export function parseStyleUniverseQuery(query: string): {
  aesthetics: string[];
  city?: string;
  styleDirectionLabels: string[];
} {
  const lower = query.toLowerCase();
  const aesthetics: string[] = [];
  const styleDirectionLabels: string[] = [];

  for (const ref of Object.values(STYLE_DIRECTION_REFERENCES)) {
    if (ref.searchAliases.some((alias) => lower.includes(alias))) {
      aesthetics.push(...ref.attributes);
      styleDirectionLabels.push(ref.label);
    }
  }

  for (const profile of CITY_FASHION_PROFILES) {
    if (lower.includes(profile.city.toLowerCase())) {
      aesthetics.push(...profile.aestheticTags, ...profile.energy);
    }
    for (const n of profile.neighborhoods) {
      if (lower.includes(n.toLowerCase())) aesthetics.push(...profile.aestheticTags);
    }
    for (const brand of profile.brandKeywords) {
      if (lower.includes(brand)) aesthetics.push(...profile.aestheticTags, "contemporary");
    }
  }

  const energyMap: Record<string, string[]> = {
    sexy: ["body-conscious", "sheer-layering", "chic-and-sexy", "draped"],
    chic: ["chic", "tailored", "editorial"],
    cool: ["editorial", "street-style", "minimalist"],
    experimental: ["experimental", "avant-garde", "deconstructed"],
    youthful: ["y2k", "playful", "contemporary"],
    editorial: ["runway-inspired", "editorial", "fashion-aware"],
    street: ["streetwear", "elevated-streetwear", "street-style"],
    "fashion week": ["runway-inspired", "editorial", "street-style"],
    opening: ["going-out", "chic", "statement-footwear"],
    "music event": ["streetwear", "experimental", "statement-footwear"],
    "creative office": ["soft-tailoring", "elevated-streetwear", "contemporary"],
    traveling: ["resort-wear", "layering", "versatile"],
    sheer: ["sheer-layering", "sheer", "layering"],
    "low-rise": ["low-rise", "y2k", "body-conscious"],
    "body-conscious": ["body-conscious", "fitted", "draped"],
    tailoring: ["tailored", "soft-tailoring"],
    sneakers: ["technical-sneakers", "elevated-streetwear"],
    salomon: ["technical-sneakers", "street-style"],
    tabi: ["tabi", "sculptural", "avant-garde"],
    "mary jane": ["mary-janes", "feminine"],
    vintage: ["vintage", "archive-fashion"],
    corset: ["corsetry", "body-conscious"],
    cargo: ["streetwear", "utility"],
    mesh: ["sheer-layering", "mesh", "y2k"],
    metallic: ["metallic", "pop-glamour", "y2k"],
    platform: ["platform", "statement-footwear"],
  };

  for (const [key, tags] of Object.entries(energyMap)) {
    if (lower.includes(key)) aesthetics.push(...tags);
  }

  let city: string | undefined;
  for (const profile of CITY_FASHION_PROFILES) {
    if (lower.includes(profile.city.toLowerCase())) {
      city = profile.city;
      break;
    }
  }
  if (!city && /\bnyc\b|new york city/.test(lower)) city = "New York City";
  if (!city && /\bhcmc\b|saigon/.test(lower)) city = "Ho Chi Minh City";

  return {
    aesthetics: [...new Set(aesthetics)],
    city,
    styleDirectionLabels,
  };
}
