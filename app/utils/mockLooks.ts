import type {
  BudgetTier,
  Garment,
  GenerationSettings,
  OutfitLook,
} from "@/app/types/styling";
import { placeholderFromSeed } from "@/app/data/productImagery";

/** No stock photography — local product placeholders until retailer feeds connect. */
const localImage = (id: string) => placeholderFromSeed(id);

const LOOK_TEMPLATES: Omit<OutfitLook, "id" | "tier">[] = [
  {
    title: "Midnight Structure",
    tagline: "Tailored lines meet quiet confidence",
    heroImageUrl: localImage("photo-1515886657613-9f3515b0c78f"),
    totalPrice: 1240,
    garments: [
      {
        id: "g1-blazer",
        name: "Double-Breasted Wool Blazer",
        brand: "Calvin Klein",
        price: 189,
        retailer: "macys",
        imageUrl: localImage("photo-1594938298603-c8148c4dae35"),
        affiliateUrl: "https://www.macys.com/shop/product/calvin-klein-blazer",
      },
      {
        id: "g1-trousers",
        name: "High-Rise Wide Leg Trousers",
        brand: "Bar III",
        price: 79,
        retailer: "macys",
        imageUrl: localImage("photo-1594633312681-425c7b97ccd1"),
        affiliateUrl: "https://www.macys.com/shop/product/bar-iii-trousers",
      },
      {
        id: "g1-boots",
        name: "Leather Ankle Boots",
        brand: "Saint Laurent",
        price: 895,
        retailer: "luxury",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.ysl.com/en-us/shoes/ankle-boots",
      },
      {
        id: "g1-bag",
        name: "Structured Mini Tote",
        brand: "Coach",
        price: 295,
        retailer: "macys",
        imageUrl: localImage("photo-1584917865442-de89df76afd3"),
        affiliateUrl: "https://www.macys.com/shop/product/coach-tote",
      },
    ],
  },
  {
    title: "Urban Ease",
    tagline: "Street-luxe without the effort",
    heroImageUrl: localImage("photo-1483985988354-763728e79a0b"),
    totalPrice: 680,
    garments: [
      {
        id: "g2-hoodie",
        name: "Premium Cotton Hoodie",
        brand: "Nike",
        price: 85,
        retailer: "macys",
        imageUrl: localImage("photo-1556821840-3a63f95609a7"),
        affiliateUrl: "https://www.macys.com/shop/product/nike-hoodie",
      },
      {
        id: "g2-denim",
        name: "Relaxed Straight Denim",
        brand: "Levi's",
        price: 98,
        retailer: "macys",
        imageUrl: localImage("photo-1542272604-787c3835535d"),
        affiliateUrl: "https://www.macys.com/shop/product/levis-denim",
      },
      {
        id: "g2-sneakers",
        name: "Low-Top Leather Sneakers",
        brand: "Common Projects",
        price: 425,
        retailer: "luxury",
        imageUrl: localImage("photo-1606107557195-0e29a4b5b4aa"),
        affiliateUrl: "https://www.commonprojects.com/sneakers",
      },
      {
        id: "g2-cap",
        name: "Minimalist Cap",
        brand: "Rag & Bone",
        price: 72,
        retailer: "macys",
        imageUrl: localImage("photo-1588850561407-ed78c962de19"),
        affiliateUrl: "https://www.macys.com/shop/product/rag-bone-cap",
      },
    ],
  },
  {
    title: "Gallery Opening",
    tagline: "Art-world polish for after dark",
    heroImageUrl: localImage("photo-1539008835657-9e8e96875921"),
    totalPrice: 1890,
    garments: [
      {
        id: "g3-dress",
        name: "Bias-Cut Slip Dress",
        brand: "Reformation",
        price: 248,
        retailer: "macys",
        imageUrl: localImage("photo-1595777457583-95e059d581b8"),
        affiliateUrl: "https://www.macys.com/shop/product/slip-dress",
      },
      {
        id: "g3-coat",
        name: "Oversized Wool Coat",
        brand: "Max Mara",
        price: 1290,
        retailer: "luxury",
        imageUrl: localImage("photo-1539533018447-63fcce2678e3"),
        affiliateUrl: "https://www.maxmara.com/wool-coat",
      },
      {
        id: "g3-heels",
        name: "Pointed Toe Pumps",
        brand: "Stuart Weitzman",
        price: 352,
        retailer: "macys",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.macys.com/shop/product/stuart-weitzman-pumps",
      },
    ],
  },
  {
    title: "Weekend Edit",
    tagline: "Effortless layers for slow mornings",
    heroImageUrl: localImage("photo-1469334031218-e382a71b716b"),
    totalPrice: 420,
    garments: [
      {
        id: "g4-knit",
        name: "Cashmere Blend Sweater",
        brand: "Charter Club",
        price: 89,
        retailer: "macys",
        imageUrl: localImage("photo-1576566588028-4147f3842f27"),
        affiliateUrl: "https://www.macys.com/shop/product/cashmere-sweater",
      },
      {
        id: "g4-chinos",
        name: "Slim Chino Pants",
        brand: "Alfani",
        price: 65,
        retailer: "macys",
        imageUrl: localImage("photo-1473966968600-fa801b869a1a"),
        affiliateUrl: "https://www.macys.com/shop/product/alfani-chinos",
      },
      {
        id: "g4-loafers",
        name: "Suede Loafers",
        brand: "Cole Haan",
        price: 168,
        retailer: "macys",
        imageUrl: localImage("photo-1560769629-975ec94aa046"),
        affiliateUrl: "https://www.macys.com/shop/product/cole-haan-loafers",
      },
      {
        id: "g4-watch",
        name: "Minimalist Watch",
        brand: "MVMT",
        price: 98,
        retailer: "macys",
        imageUrl: localImage("photo-1523275335684-37898b6baf30"),
        affiliateUrl: "https://www.macys.com/shop/product/mvmt-watch",
      },
    ],
  },
  {
    title: "Power Lunch",
    tagline: "Boardroom ready, editorially refined",
    heroImageUrl: localImage("photo-1490481651871-ab68de25d43d"),
    totalPrice: 980,
    garments: [
      {
        id: "g5-blouse",
        name: "Silk Button-Front Blouse",
        brand: "Anne Klein",
        price: 79,
        retailer: "macys",
        imageUrl: localImage("photo-1564257631407-3deb25e9c8e0"),
        affiliateUrl: "https://www.macys.com/shop/product/anne-klein-blouse",
      },
      {
        id: "g5-skirt",
        name: "Pencil Midi Skirt",
        brand: "Alfani",
        price: 69,
        retailer: "macys",
        imageUrl: localImage("photo-1583496664526-173dd5e543d2"),
        affiliateUrl: "https://www.macys.com/shop/product/pencil-skirt",
      },
      {
        id: "g5-blazer2",
        name: "Structured Blazer",
        brand: "Theory",
        price: 495,
        retailer: "luxury",
        imageUrl: localImage("photo-1594938298603-c8148c4dae35"),
        affiliateUrl: "https://www.theory.com/blazer",
      },
      {
        id: "g5-pumps",
        name: "Classic Pumps",
        brand: "Naturalizer",
        price: 89,
        retailer: "macys",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.macys.com/shop/product/naturalizer-pumps",
      },
      {
        id: "g5-earrings",
        name: "Gold Hoop Earrings",
        brand: "Kate Spade",
        price: 78,
        retailer: "macys",
        imageUrl: localImage("photo-1535632066927-ab7c9ab60908"),
        affiliateUrl: "https://www.macys.com/shop/product/kate-spade-earrings",
      },
    ],
  },
  {
    title: "Neon Nights",
    tagline: "After-hours energy with edge",
    heroImageUrl: localImage("photo-1509631179647-0177331693ae"),
    totalPrice: 1150,
    garments: [
      {
        id: "g6-top",
        name: "Metallic Crop Top",
        brand: "Free People",
        price: 68,
        retailer: "macys",
        imageUrl: localImage("photo-1566174053879-31528523f8ae"),
        affiliateUrl: "https://www.macys.com/shop/product/metallic-top",
      },
      {
        id: "g6-leather",
        name: "Leather Mini Skirt",
        brand: "AllSaints",
        price: 298,
        retailer: "macys",
        imageUrl: localImage("photo-1583496664526-173dd5e543d2"),
        affiliateUrl: "https://www.macys.com/shop/product/leather-skirt",
      },
      {
        id: "g6-jacket",
        name: "Cropped Moto Jacket",
        brand: "Acne Studios",
        price: 620,
        retailer: "luxury",
        imageUrl: localImage("photo-1551028719-00167b16eac5"),
        affiliateUrl: "https://www.acnestudios.com/moto-jacket",
      },
      {
        id: "g6-boots2",
        name: "Platform Ankle Boots",
        brand: "Steve Madden",
        price: 164,
        retailer: "macys",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.macys.com/shop/product/platform-boots",
      },
    ],
  },
  {
    title: "Coastal Minimal",
    tagline: "Clean lines, sun-washed palette",
    heroImageUrl: localImage("photo-1434389677669-e08b4cac3105"),
    totalPrice: 540,
    garments: [
      {
        id: "g7-linen",
        name: "Linen Button-Down",
        brand: "Tommy Hilfiger",
        price: 89,
        retailer: "macys",
        imageUrl: localImage("photo-1596755094514-f87e34085b2c"),
        affiliateUrl: "https://www.macys.com/shop/product/linen-shirt",
      },
      {
        id: "g7-shorts",
        name: "Tailored Shorts",
        brand: "J.Crew",
        price: 78,
        retailer: "macys",
        imageUrl: localImage("photo-1591195853828-11db59a633f6"),
        affiliateUrl: "https://www.macys.com/shop/product/tailored-shorts",
      },
      {
        id: "g7-sandals",
        name: "Leather Slide Sandals",
        brand: "Bottega Veneta",
        price: 290,
        retailer: "luxury",
        imageUrl: localImage("photo-1603487745087-3faa4b6f0c82"),
        affiliateUrl: "https://www.bottegaveneta.com/sandals",
      },
      {
        id: "g7-tote",
        name: "Canvas Tote Bag",
        brand: "Madewell",
        price: 83,
        retailer: "macys",
        imageUrl: localImage("photo-1590875123103-9e793109a8e6"),
        affiliateUrl: "https://www.macys.com/shop/product/canvas-tote",
      },
    ],
  },
  {
    title: "Studio Session",
    tagline: "Movement-ready athleisure elevated",
    heroImageUrl: localImage("photo-1518310959331-1ee27c683b6e"),
    totalPrice: 380,
    garments: [
      {
        id: "g8-leggings",
        name: "High-Waist Leggings",
        brand: "Alo Yoga",
        price: 98,
        retailer: "macys",
        imageUrl: localImage("photo-1506629082955-511b8f8c9c68"),
        affiliateUrl: "https://www.macys.com/shop/product/alo-leggings",
      },
      {
        id: "g8-bra",
        name: "Sports Bra",
        brand: "Nike",
        price: 55,
        retailer: "macys",
        imageUrl: localImage("photo-1571902943202-507ec2618e8f"),
        affiliateUrl: "https://www.macys.com/shop/product/nike-sports-bra",
      },
      {
        id: "g8-jacket2",
        name: "Lightweight Track Jacket",
        brand: "Adidas",
        price: 85,
        retailer: "macys",
        imageUrl: localImage("photo-1556821840-3a63f95609a7"),
        affiliateUrl: "https://www.macys.com/shop/product/adidas-jacket",
      },
      {
        id: "g8-sneakers2",
        name: "Retro Running Sneakers",
        brand: "New Balance",
        price: 142,
        retailer: "macys",
        imageUrl: localImage("photo-1606107557195-0e29a4b5b4aa"),
        affiliateUrl: "https://www.macys.com/shop/product/new-balance-sneakers",
      },
    ],
  },
  {
    title: "Autumn Layers",
    tagline: "Textured warmth in muted tones",
    heroImageUrl: localImage("photo-1487222477894-8943e31ef7b2"),
    totalPrice: 720,
    garments: [
      {
        id: "g9-turtleneck",
        name: "Merino Turtleneck",
        brand: "Uniqlo",
        price: 49,
        retailer: "macys",
        imageUrl: localImage("photo-1576566588028-4147f3842f27"),
        affiliateUrl: "https://www.macys.com/shop/product/merino-turtleneck",
      },
      {
        id: "g9-coat2",
        name: "Trench Coat",
        brand: "London Fog",
        price: 189,
        retailer: "macys",
        imageUrl: localImage("photo-1539533018447-63fcce2678e3"),
        affiliateUrl: "https://www.macys.com/shop/product/trench-coat",
      },
      {
        id: "g9-scarf",
        name: "Cashmere Scarf",
        brand: "Burberry",
        price: 395,
        retailer: "luxury",
        imageUrl: localImage("photo-1520903920243-00d872a2d1c5"),
        affiliateUrl: "https://www.burberry.com/cashmere-scarf",
      },
      {
        id: "g9-boots3",
        name: "Chelsea Boots",
        brand: "Clarks",
        price: 87,
        retailer: "macys",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.macys.com/shop/product/chelsea-boots",
      },
    ],
  },
  {
    title: "Date Night",
    tagline: "Romantic silhouettes, modern restraint",
    heroImageUrl: localImage("photo-1515372039744-b8f02a3ae446"),
    totalPrice: 860,
    garments: [
      {
        id: "g10-dress2",
        name: "Wrap Midi Dress",
        brand: "Diane von Furstenberg",
        price: 368,
        retailer: "macys",
        imageUrl: localImage("photo-1595777457583-95e059d581b8"),
        affiliateUrl: "https://www.macys.com/shop/product/wrap-dress",
      },
      {
        id: "g10-clutch",
        name: "Evening Clutch",
        brand: "Saint Laurent",
        price: 395,
        retailer: "luxury",
        imageUrl: localImage("photo-1584917865442-de89df76afd3"),
        affiliateUrl: "https://www.ysl.com/en-us/bags/clutch",
      },
      {
        id: "g10-heels2",
        name: "Strappy Heels",
        brand: "Sam Edelman",
        price: 97,
        retailer: "macys",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.macys.com/shop/product/strappy-heels",
      },
    ],
  },
  {
    title: "Creative Director",
    tagline: "Avant-garde proportions for the bold",
    heroImageUrl: localImage("photo-1558618666-fcd25c85cd64"),
    totalPrice: 2100,
    garments: [
      {
        id: "g11-blazer3",
        name: "Oversized Deconstructed Blazer",
        brand: "Maison Margiela",
        price: 1290,
        retailer: "luxury",
        imageUrl: localImage("photo-1594938298603-c8148c4dae35"),
        affiliateUrl: "https://www.maisonmargiela.com/blazer",
      },
      {
        id: "g11-tee",
        name: "Essential White Tee",
        brand: "Hanes",
        price: 18,
        retailer: "macys",
        imageUrl: localImage("photo-1521572163474-6864f9cf17ab"),
        affiliateUrl: "https://www.macys.com/shop/product/white-tee",
      },
      {
        id: "g11-pants",
        name: "Wide Pleated Trousers",
        brand: "Pleats Please",
        price: 425,
        retailer: "luxury",
        imageUrl: localImage("photo-1594633312681-425c7b97ccd1"),
        affiliateUrl: "https://www.isseymiyake.com/trousers",
      },
      {
        id: "g11-shoes",
        name: "Chunky Platform Oxfords",
        brand: "Dr. Martens",
        price: 168,
        retailer: "macys",
        imageUrl: localImage("photo-1560769629-975ec94aa046"),
        affiliateUrl: "https://www.macys.com/shop/product/doc-martens",
      },
      {
        id: "g11-glasses",
        name: "Geometric Sunglasses",
        brand: "Ray-Ban",
        price: 199,
        retailer: "macys",
        imageUrl: localImage("photo-1572635196233-14fbfa7876a9"),
        affiliateUrl: "https://www.macys.com/shop/product/ray-ban-sunglasses",
      },
    ],
  },
  {
    title: "Quiet Luxury",
    tagline: "Understated elegance, no logos needed",
    heroImageUrl: localImage("photo-1496747611176-843222e1eead"),
    totalPrice: 1450,
    garments: [
      {
        id: "g12-cardigan",
        name: "Cashmere Cardigan",
        brand: "Naadam",
        price: 295,
        retailer: "macys",
        imageUrl: localImage("photo-1576566588028-4147f3842f27"),
        affiliateUrl: "https://www.macys.com/shop/product/cashmere-cardigan",
      },
      {
        id: "g12-trousers2",
        name: "Silk Wide-Leg Trousers",
        brand: "The Row",
        price: 890,
        retailer: "luxury",
        imageUrl: localImage("photo-1594633312681-425c7b97ccd1"),
        affiliateUrl: "https://www.therow.com/trousers",
      },
      {
        id: "g12-flats",
        name: "Leather Ballet Flats",
        brand: "Margaux",
        price: 185,
        retailer: "macys",
        imageUrl: localImage("photo-1543163521-1bf539c55dd2"),
        affiliateUrl: "https://www.macys.com/shop/product/ballet-flats",
      },
      {
        id: "g12-belt",
        name: "Thin Leather Belt",
        brand: "Hermès",
        price: 680,
        retailer: "luxury",
        imageUrl: localImage("photo-1624224426880-25c953220102"),
        affiliateUrl: "https://www.hermes.com/belt",
      },
    ],
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function adjustPriceForBudget(
  look: Omit<OutfitLook, "id" | "tier">,
  budget: BudgetTier
): Omit<OutfitLook, "id" | "tier"> {
  const multiplier: Record<BudgetTier, number> = {
    "under-200": 0.25,
    "200-500": 0.45,
    "500-1000": 0.65,
    "1000-plus": 0.85,
    "high-low-blend": 1,
    "no-limit": 1.4,
  };

  const factor = multiplier[budget];
  const garments: Garment[] = look.garments.map((g) => ({
    ...g,
    price: Math.round(g.price * factor),
  }));

  return {
    ...look,
    garments,
    totalPrice: garments.reduce((sum, g) => sum + g.price, 0),
  };
}

export function generateMockLooks(
  settings: GenerationSettings
): OutfitLook[] {
  const seed = hashString(
    `${settings.mode}-${settings.categories.join(",")}-${settings.budget}-${settings.aesthetic}`
  );

  const shuffled = [...LOOK_TEMPLATES].sort((a, b) => {
    const hashA = hashString(a.title + seed);
    const hashB = hashString(b.title + seed);
    return hashA - hashB;
  });

  return shuffled.slice(0, 12).map((template, index) => {
    const adjusted = adjustPriceForBudget(template, settings.budget);
    return {
      ...adjusted,
      id: `look-${index + 1}`,
      tier: settings.budget,
    };
  });
}
