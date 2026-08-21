/**
 * Archive411 Style Inspiration Board — Part 2
 *
 * Creative references for vibe and garment direction. NOT partnerships,
 * endorsements, or identity assignments. Names map to searchable style
 * attributes so lookbooks pull clothing with this energy.
 *
 * North-star vibe: @alyazmine — aesthetic + designers she wears as the
 * goal feel of the app and the kinds of clothing it should surface.
 */

export interface InspirationReference {
  id: string;
  handle: string;
  displayName: string;
  city: "New York City" | "London" | "Paris" | "Ho Chi Minh City" | "Global" | "Abu Dhabi";
  role: string;
  /** Why this reference matters for Archive411. */
  why: string;
  /** Tags the catalog / search should boost when this vibe is selected. */
  attributes: string[];
  /** Optional brand/designer keywords associated with this vibe. */
  brandKeywords?: string[];
  priority?: boolean;
}

/** Overall app vibe goal — feminine/editorial inspiration north star. */
export const APP_VIBE_NORTH_STAR = {
  handle: "@alyazmine",
  displayName: "Alyazmine",
  note:
    "Add to the inspiration list: her aesthetic and the designers she wears are the goal vibe of the app and the kinds of clothing it will pull.",
  attributes: [
    "editorial",
    "sexy",
    "chic",
    "body-conscious",
    "nightlife",
    "emerging-designers",
    "high-low",
    "statement-footwear",
    "strong-accessories",
    "fashion-aware",
  ],
} as const;

/** Strongest first 12 for a balanced menswear reference board. */
export const PRIORITY_MENSWEAR_INSPIRATION_IDS = [
  "jovel-roystan",
  "bloody-osiris",
  "dapper-dan",
  "kerwin-frost",
  "daniel-simmons",
  "sangiev",
  "elias-riadi",
  "ibrahim-kamara",
  "gauthier-borsarello",
  "youssouf-fofana",
  "kiddy-smile",
  "wisdom-kaye",
] as const;

export const STYLE_INSPIRATION_REFERENCES: InspirationReference[] = [
  // —— New York ——
  {
    id: "jovel-roystan",
    handle: "@jovelroystan",
    displayName: "Jovel Roystan",
    city: "New York City",
    role: "Creator / style reference",
    why: "Best starting point: relaxed tailoring, streetwear, knitwear, interesting proportions, accessories, wearable experimentation.",
    attributes: [
      "relaxed-tailoring",
      "streetwear",
      "knitwear",
      "interesting-proportions",
      "accessories",
      "wearable-experimental",
      "elevated-streetwear",
    ],
    priority: true,
  },
  {
    id: "bloody-osiris",
    handle: "@bloodyosiris",
    displayName: "Bloody Osiris",
    city: "New York City",
    role: "Street style reference",
    why: "Extreme street style, oversized silhouettes, Rick Owens-adjacent, technical pieces, luxury streetwear, boots, layering, fashion-week energy.",
    attributes: [
      "oversized",
      "rick-owens-adjacent",
      "technical",
      "luxury-streetwear",
      "boots",
      "layering",
      "avant-garde",
      "fashion-week",
    ],
    brandKeywords: ["Rick Owens"],
    priority: true,
  },
  {
    id: "luka-sabbat",
    handle: "@lukasabbat",
    displayName: "Luka Sabbat",
    city: "New York City",
    role: "Downtown creative / model reference",
    why: "Downtown NYC: vintage, relaxed tailoring, leather, skinny and oversized silhouettes, model-creative-streetwear bridge.",
    attributes: [
      "downtown",
      "vintage",
      "relaxed-tailoring",
      "leather",
      "skinny",
      "oversized",
      "streetwear",
    ],
  },
  {
    id: "kerwin-frost",
    handle: "@kerwinfrost",
    displayName: "Kerwin Frost",
    city: "New York City",
    role: "Maximalist menswear reference",
    why: "Maximalism, unusual proportions, thrift mixed with haute couture, statement outerwear, playful menswear.",
    attributes: [
      "maximalism",
      "unusual-proportions",
      "thrift-couture",
      "high-low",
      "statement-outerwear",
      "playful",
      "couture-streetwear",
    ],
    priority: true,
  },
  {
    id: "jake-woolf",
    handle: "@jakewoolf",
    displayName: "Jake Woolf",
    city: "New York City",
    role: "Fashion-insider menswear",
    why: "Denim, knitwear, tailoring, niche brands, footwear, clothing-nerd references.",
    attributes: ["denim", "knitwear", "tailoring", "niche-brands", "footwear", "fashion-insider"],
  },
  {
    id: "man-in-suede",
    handle: "@maninsuede",
    displayName: "Man in Suede / Die Workwear-style",
    city: "New York City",
    role: "Classic menswear education",
    why: "Tailoring, fabric, classic menswear, shape, historical context — not hype dressing.",
    attributes: ["classic-tailoring", "fabric-led", "workwear", "historical", "shape"],
  },
  {
    id: "watching-new-york",
    handle: "@watchingnewyork",
    displayName: "Watching New York",
    city: "New York City",
    role: "Street fashion documentation",
    why: "Real stylish men across ages, races, bodies, neighborhoods, and subcultures — not one wardrobe.",
    attributes: [
      "street-style",
      "nyc-street",
      "diverse-bodies",
      "subcultures",
      "real-wardrobe",
    ],
  },
  {
    id: "dapper-dan",
    handle: "@dapperdanharlem",
    displayName: "Dapper Dan",
    city: "New York City",
    role: "Harlem / Black luxury history",
    why: "Black luxury style, Harlem tailoring, logo culture, custom clothing, hip-hop fashion history, aspiration and designer fashion.",
    attributes: [
      "black-luxury",
      "harlem-tailoring",
      "logo-culture",
      "custom-clothing",
      "hip-hop-fashion",
      "aspirational",
    ],
    priority: true,
  },
  {
    id: "wisdom-kaye",
    handle: "@wisdm",
    displayName: "Wisdom Kaye",
    city: "Global",
    role: "Runway-level menswear storytelling",
    why: "NY/Paris/London circuit: dramatic proportions, fantasy styling, tailoring, color, skirts, coats, complete visual storytelling.",
    attributes: [
      "dramatic-proportions",
      "runway-menswear",
      "fantasy-styling",
      "tailoring",
      "color",
      "skirts",
      "coats",
      "editorial",
      "gender-expansive",
    ],
    priority: true,
  },

  // —— London ——
  {
    id: "daniel-simmons",
    handle: "@imdanielsimmons",
    displayName: "Daniel Simmons",
    city: "London",
    role: "Clean contemporary menswear",
    why: "Wide trousers, knitwear, coats, neutral palettes, minimal sneakers, loafers, understated luxury.",
    attributes: [
      "wide-trousers",
      "knitwear",
      "coats",
      "neutral-palette",
      "minimal-sneakers",
      "loafers",
      "understated-luxury",
      "contemporary",
    ],
    priority: true,
  },
  {
    id: "sangiev",
    handle: "@sangiev",
    displayName: "Sangiev",
    city: "London",
    role: "Avant-garde London menswear",
    why: "Rick Owens, Chrome Hearts, leather, boots, dramatic silhouettes, jewelry, dark palettes, gender-fluid styling.",
    attributes: [
      "avant-garde",
      "rick-owens-adjacent",
      "chrome-hearts-adjacent",
      "leather",
      "boots",
      "dramatic-silhouettes",
      "jewelry",
      "dark-palette",
      "gender-fluid",
    ],
    brandKeywords: ["Rick Owens", "Chrome Hearts"],
    priority: true,
  },
  {
    id: "elias-riadi",
    handle: "@eliasriadi",
    displayName: "Elias Riadi",
    city: "London",
    role: "Younger London fashion",
    why: "Cropped tops, oversized denim, skirts, handbags, nightlife, masculine/feminine mix.",
    attributes: [
      "cropped",
      "oversized-denim",
      "skirts",
      "handbags",
      "nightlife",
      "gender-expansive",
      "youthful",
    ],
    priority: true,
  },
  {
    id: "gallucks",
    handle: "@gallucks",
    displayName: "Joel Mcloughlin / Gallucks",
    city: "London",
    role: "Dark minimal / technical",
    why: "Dark minimalism, technical fashion, oversized layers, monochrome, luxury streetwear, wearable avant-garde.",
    attributes: [
      "dark-minimalism",
      "technical",
      "oversized-layers",
      "monochrome",
      "luxury-streetwear",
      "wearable-avant-garde",
    ],
  },
  {
    id: "matt-edwards",
    handle: "@mattredwards",
    displayName: "Matt R. Edwards",
    city: "London",
    role: "Black London menswear / lifestyle",
    why: "Polished everyday dressing, tailoring, smart casual, accessible formulas, Black British representation.",
    attributes: [
      "polished-everyday",
      "tailoring",
      "smart-casual",
      "accessible",
      "black-british-menswear",
    ],
  },
  {
    id: "alistair-guy",
    handle: "@alistairguy",
    displayName: "Alistair Guy",
    city: "London",
    role: "Classic British gentleman",
    why: "Suits, coats, formalwear, tailoring, refined masculine presentation.",
    attributes: ["suits", "coats", "formalwear", "classic-tailoring", "refined"],
  },
  {
    id: "sam-gray",
    handle: "@samgraystyle",
    displayName: "Sam Gray",
    city: "London",
    role: "Contemporary classic",
    why: "Hotel-bar elegance, tailoring, smart casual, polished wardrobe basics.",
    attributes: ["contemporary-classic", "tailoring", "smart-casual", "polished-basics"],
  },
  {
    id: "sam-hulme",
    handle: "@its_samhulme",
    displayName: "Sam Hulme",
    city: "London",
    role: "Accessible menswear education",
    why: "Everyday fits, affordable basics, layering, trousers, sneakers, clear styling education.",
    attributes: ["everyday", "affordable-basics", "layering", "trousers", "sneakers", "replicable"],
  },
  {
    id: "ibrahim-kamara",
    handle: "@ibkamara",
    displayName: "Ibrahim Kamara",
    city: "London",
    role: "Editorial / image-making",
    why: "Black futurism, editorial menswear, historical references, gender expansiveness, deconstruction, image-making.",
    attributes: [
      "black-futurism",
      "editorial",
      "historical-references",
      "gender-expansive",
      "deconstruction",
      "afrofuturism",
      "image-making",
    ],
    priority: true,
  },
  {
    id: "charles-jeffrey",
    handle: "@charlesjeffreyloverboy",
    displayName: "Charles Jeffrey LOVERBOY",
    city: "London",
    role: "Designer / queer London",
    why: "Queer London menswear, punk, kilts, makeup, exaggerated tailoring, club culture, theatrical styling.",
    attributes: [
      "queer-fashion",
      "punk",
      "kilts",
      "exaggerated-tailoring",
      "club-culture",
      "theatrical",
      "gender-expansive",
    ],
    brandKeywords: ["Charles Jeffrey LOVERBOY"],
  },

  // —— Paris ——
  {
    id: "gauthier-borsarello",
    handle: "@gauthierborsarello",
    displayName: "Gauthier Borsarello",
    city: "Paris",
    role: "Creative director / vintage menswear knowledge",
    why: "Fursac CD; vintage menswear, tailoring, military, workwear, French style history.",
    attributes: [
      "french-tailoring",
      "vintage-menswear",
      "military",
      "workwear",
      "french-style-history",
      "elegant-everyday",
    ],
    brandKeywords: ["Fursac"],
    priority: true,
  },
  {
    id: "youssouf-fofana",
    handle: "@youssouf.f",
    displayName: "Youssouf Fofana",
    city: "Paris",
    role: "Maison Château Rouge co-founder",
    why: "Contemporary Black Paris, African-diaspora references, color, streetwear, tailoring, sneakers, culturally grounded design.",
    attributes: [
      "black-paris",
      "african-diaspora",
      "color",
      "streetwear",
      "tailoring",
      "sneakers",
      "community-fashion",
    ],
    brandKeywords: ["Maison Château Rouge"],
    priority: true,
  },
  {
    id: "stephane-ashpool",
    handle: "@stephaneashpool",
    displayName: "Stéphane Ashpool",
    city: "Paris",
    role: "Pigalle / luxury sportswear",
    why: "Paris basketball culture, luxury sportswear, tailoring, Pigalle, color, community and fashion.",
    attributes: ["luxury-sportswear", "basketball-culture", "tailoring", "pigalle", "color"],
  },
  {
    id: "edmond-luu",
    handle: "@edmondluu",
    displayName: "Edmond Luu",
    city: "Paris",
    role: "Pièces Uniques founder",
    why: "Romanticism, youth culture, tailoring, anime/fantasy influence, gender-fluid proportions.",
    attributes: [
      "romantic",
      "youth-culture",
      "tailoring",
      "fantasy",
      "gender-fluid",
      "paris-menswear",
    ],
    brandKeywords: ["Pièces Uniques"],
  },
  {
    id: "bach-buquen",
    handle: "@bachbuquen",
    displayName: "Bách Buquen",
    city: "Paris",
    role: "French-Vietnamese creator / model",
    why: "Gen Z Paris styling, makeup, slim silhouettes, gender-fluid dressing, youthful experimentation.",
    attributes: ["gen-z", "slim-silhouettes", "gender-fluid", "youthful", "paris-experimentation"],
  },
  {
    id: "kiddy-smile",
    handle: "@kiddysmile",
    displayName: "Kiddy Smile",
    city: "Paris",
    role: "Ballroom / club / queer Paris",
    why: "Black queer Paris fashion, ballroom and club influence, color, tailoring, body-conscious menswear, statement accessories.",
    attributes: [
      "black-queer-paris",
      "ballroom",
      "club-culture",
      "color",
      "tailoring",
      "body-conscious",
      "statement-accessories",
      "gender-expression",
    ],
    priority: true,
  },
  {
    id: "oliver-church",
    handle: "@oliverchurch",
    displayName: "Oliver Church",
    city: "Paris",
    role: "Artisanal / deadstock",
    why: "Handmade Paris menswear, antique fabrics, natural dyeing, workwear, repair, historical material intelligence.",
    attributes: [
      "artisanal",
      "handmade",
      "deadstock",
      "natural-dye",
      "workwear",
      "repair",
      "historical-materials",
    ],
  },
  {
    id: "maison-chateau-rouge",
    handle: "@maisonchateaurouge",
    displayName: "Maison Château Rouge",
    city: "Paris",
    role: "Brand / community",
    why: "Community, collaborators, styling, Parisian African-diaspora fashion.",
    attributes: ["african-diaspora", "community-fashion", "color", "paris-street"],
    brandKeywords: ["Maison Château Rouge"],
  },
  {
    id: "fursac",
    handle: "@fursac",
    displayName: "Fursac",
    city: "Paris",
    role: "French tailoring house",
    why: "French tailoring, vintage references, suiting, coats, elegant everyday menswear.",
    attributes: ["french-tailoring", "suiting", "coats", "elegant-everyday", "vintage-references"],
    brandKeywords: ["Fursac"],
  },
  {
    id: "leon-dame",
    handle: "@leondame",
    displayName: "Leon Dame",
    city: "Paris",
    role: "Runway / androgynous menswear",
    why: "Paris runway menswear and androgynous fashion; heels, short shorts, fitted tailoring, theatrical movement, Margiela, challenging conventional masculine presentation.",
    attributes: [
      "androgynous",
      "runway-menswear",
      "heels",
      "short-shorts",
      "fitted-tailoring",
      "theatrical",
      "margiela-adjacent",
      "gender-expansive",
    ],
    brandKeywords: ["Maison Margiela"],
  },

  // —— Additional labels / regions ——
  {
    id: "wet-avocado-club",
    handle: "@wetavocadoclub",
    displayName: "Wet Avocado Club",
    city: "Ho Chi Minh City",
    role: "HCMC womenswear label",
    why: "Fitted, sexy, playful, nightlife and Y2K-adjacent styling; worldwide shipping.",
    attributes: [
      "fitted",
      "sexy",
      "playful",
      "nightlife",
      "y2k",
      "body-conscious",
      "hcmc",
    ],
    brandKeywords: ["Wet Avocado Club"],
  },
  {
    id: "jeevan-hussain-rehar",
    handle: "@jeevanbyhussainrehar",
    displayName: "Jeevan by Hussain Rehar",
    city: "Global",
    role: "South Asian luxury",
    why: "Embroidery, silk, ornamentation, dramatic silhouettes; expands Archive411 beyond Western-only references.",
    attributes: [
      "south-asian-luxury",
      "embroidery",
      "silk",
      "ornamentation",
      "dramatic-silhouettes",
      "evening",
    ],
    brandKeywords: ["Jeevan by Hussain Rehar"],
  },
  {
    id: "28natelier",
    handle: "@28natelier",
    displayName: "28NATELIER",
    city: "Abu Dhabi",
    role: "Independent womenswear",
    why: "In-house production, architectural shapes, romantic materials.",
    attributes: ["architectural", "romantic", "independent", "womenswear", "made-in-house"],
    brandKeywords: ["28NATELIER"],
  },
  {
    id: "raboesy",
    handle: "@raboesy",
    displayName: "Raboesy",
    city: "Global",
    role: "Balletcore footwear (verify before live ingestion)",
    why: "Ballet flats and feminine footwear references. Requires quality and retailer verification — Etsy store inactive; limited buyer info.",
    attributes: ["balletcore", "ballet-flats", "feminine-footwear", "needs-verification"],
    brandKeywords: ["Raboesy"],
  },
];

export function getPriorityMenswearInspiration(): InspirationReference[] {
  const set = new Set<string>(PRIORITY_MENSWEAR_INSPIRATION_IDS);
  return STYLE_INSPIRATION_REFERENCES.filter((r) => set.has(r.id));
}

export function getInspirationByCity(city: string): InspirationReference[] {
  const c = city.toLowerCase();
  return STYLE_INSPIRATION_REFERENCES.filter((r) =>
    r.city.toLowerCase().includes(c.replace("new york", "new york city"))
  );
}

/** Flatten attributes for search / look assembly boosts. */
export function inspirationSearchAesthetics(ids?: string[]): string[] {
  const pool = ids?.length
    ? STYLE_INSPIRATION_REFERENCES.filter((r) => ids.includes(r.id))
    : getPriorityMenswearInspiration();
  return [...new Set(pool.flatMap((r) => r.attributes))];
}

export function inspirationBrandKeywords(): string[] {
  return [
    ...new Set(
      STYLE_INSPIRATION_REFERENCES.flatMap((r) => r.brandKeywords ?? []).concat([
        APP_VIBE_NORTH_STAR.displayName,
      ])
    ),
  ];
}
