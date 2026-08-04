export const FASHION_CITIES = [
  { city: "New York City", country: "United States", region: "Americas" },
  { city: "Paris", country: "France", region: "Europe" },
  { city: "London", country: "United Kingdom", region: "Europe" },
  { city: "Ho Chi Minh City", country: "Vietnam", region: "Southeast Asia" },
  { city: "Bangkok", country: "Thailand", region: "Southeast Asia" },
  { city: "Tokyo", country: "Japan", region: "East Asia" },
  { city: "Seoul", country: "South Korea", region: "East Asia" },
  { city: "Lagos", country: "Nigeria", region: "Africa" },
  { city: "Copenhagen", country: "Denmark", region: "Europe" },
  { city: "Milan", country: "Italy", region: "Europe" },
  { city: "Los Angeles", country: "United States", region: "Americas" },
] as const;

export const HOMEPAGE_COLLECTIONS = [
  { id: "hcmc", title: "New from Ho Chi Minh City", href: "/independent?city=Ho Chi Minh City" },
  { id: "bangkok", title: "Bangkok Designers to Know", href: "/independent?city=Bangkok" },
  { id: "london", title: "Independent London", href: "/independent?city=London" },
  { id: "nyc", title: "Emerging New York", href: "/independent?city=New York City" },
  { id: "paris", title: "Paris Beyond the Main Houses", href: "/independent?city=Paris" },
  { id: "tokyo", title: "Tokyo After Dark", href: "/independent?city=Tokyo" },
  { id: "mto", title: "Handmade and Made to Order", href: "/independent?madeToOrder=1" },
  { id: "vintage-y2k", title: "Vintage Y2K Footwear", href: "/destinations" },
  { id: "chic-sexy", title: "Chic and Sexy Under $250", href: "/search?aesthetic=Chic and sexy" },
  { id: "new-archive", title: "New Designers in the Archive", href: "/designers" },
] as const;

export const INDEPENDENT_SECTIONS = HOMEPAGE_COLLECTIONS.map((c) => c.title);
