import type { Product } from "@/app/types/domain";

/** Products available only through showroom fitting / reservation flows. */
export const SHOWROOM_PRODUCT_PATCHES: Record<
  string,
  Pick<Product, "showroomId" | "purchaseFlow">
> = {
  "prod-paris-bias-skirt": {
    showroomId: "sr-paris-archive",
    purchaseFlow: "showroom-fitting",
  },
  "prod-paris-tabi-maryjane": {
    showroomId: "sr-paris-archive",
    purchaseFlow: "showroom-fitting",
  },
  "prod-vintage-cavalli-ref": {
    showroomId: "sr-paris-archive",
    purchaseFlow: "showroom-fitting",
  },
  "prod-hcmc-draped-mini": {
    showroomId: "sr-hcmc-styling",
    purchaseFlow: "showroom-fitting",
  },
  "prod-hcmc-lowrise": {
    showroomId: "sr-hcmc-styling",
    purchaseFlow: "showroom-fitting",
  },
  "prod-hcmc-mesh-layer": {
    showroomId: "sr-hcmc-styling",
    purchaseFlow: "showroom-fitting",
  },
  "prod-nyc-corset": {
    showroomId: "sr-nyc-clienteling",
    purchaseFlow: "showroom-fitting",
  },
  "prod-nyc-bomber": {
    showroomId: "sr-nyc-clienteling",
    purchaseFlow: "showroom-fitting",
  },
  "prod-hcmc-heels": {
    showroomId: "sr-hcmc-styling",
    purchaseFlow: "made-to-order",
  },
};

export function applyShowroomPatches(products: Product[]): Product[] {
  return products.map((p) => {
    const patch = SHOWROOM_PRODUCT_PATCHES[p.id];
    return patch ? { ...p, ...patch } : p;
  });
}
