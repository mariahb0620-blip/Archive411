import type { Product } from "@/app/types/domain";

export function checkSizeAvailability(
  product: Product,
  userSizes: string[]
): "confirmed" | "check" | "unavailable" {
  if (!userSizes.length) return "check";
  if (product.availableSizes.includes("Custom") || product.inventoryStatus === "made-to-order") {
    return "check";
  }
  const match = userSizes.some((us) =>
    product.availableSizes.some(
      (ps) => ps.toLowerCase() === us.toLowerCase() || ps.includes(us)
    )
  );
  if (match) return "confirmed";
  if (product.inventoryStatus === "sold-out") return "unavailable";
  return "check";
}
