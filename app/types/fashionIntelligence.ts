export type IntelligenceRetailer = "macys" | "luxury";
export type TrackingNetwork = "rakuten" | "impact";

export interface IntelligenceGarment {
  id: string;
  name: string;
  brand: string;
  price: number;
  retailer: IntelligenceRetailer;
  trackingNetwork: TrackingNetwork;
  imageUrl: string;
  affiliateUrl: string;
}

export interface LookbookProfile {
  id: string;
  index: number;
  title: string;
  tagline: string;
  season: string;
  subculture: string;
  historicalInfluence: string;
  runwayReference: string;
  curationNarrative: string;
  heroImageUrl: string;
  garments: IntelligenceGarment[];
  totalPrice: number;
}
