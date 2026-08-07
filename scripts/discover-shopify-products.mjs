/** Quick helper: list Shopify product URLs for catalog maintenance. */
const stores = [
  { base: "https://collinastrada.com", q: ["dress", "cargo", "mesh", "top"] },
  { base: "https://martine-rose.com", q: ["jacket", "trouser", "shirt", "track"] },
  { base: "https://walesbonner.com", q: ["knit", "polo", "trouser", "coat", "wool"] },
  { base: "https://guapestudio.com", q: ["heel", "bag", "mule", "boot"] },
];

for (const { base, q } of stores) {
  const res = await fetch(`${base}/products.json?limit=250`);
  if (!res.ok) {
    console.log(`\n${base}: HTTP ${res.status}`);
    continue;
  }
  const data = await res.json();
  console.log(`\n=== ${base} (${data.products?.length ?? 0} products) ===`);
  for (const product of data.products ?? []) {
    const title = product.title.toLowerCase();
    const handle = product.handle;
    const url = `${base}/products/${handle}`;
    const match = q.some((term) => title.includes(term) || handle.includes(term));
    if (match) {
      console.log(`  ${product.title}`);
      console.log(`    ${url}`);
    }
  }
}
