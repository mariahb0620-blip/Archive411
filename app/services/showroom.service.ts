import { MOCK_PRODUCTS, MOCK_SHOWROOMS } from "@/app/data/seed";
import type { Product, Showroom } from "@/app/types/domain";

export function getShowroomById(id: string): Showroom | null {
  return MOCK_SHOWROOMS.find((s) => s.id === id) ?? null;
}

export function getShowroomBySlug(slug: string): Showroom | null {
  return MOCK_SHOWROOMS.find((s) => s.slug === slug) ?? null;
}

export function getShowroomProducts(showroomId: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.showroomId === showroomId);
}

export function getAllShowrooms(): Showroom[] {
  return MOCK_SHOWROOMS;
}

export function isShowroomProduct(product: Product): boolean {
  return (
    product.purchaseFlow === "showroom-fitting" ||
    product.purchaseFlow === "made-to-order" ||
    Boolean(product.showroomId)
  );
}

export function getProductShowroom(product: Product): Showroom | null {
  if (!product.showroomId) return null;
  return getShowroomById(product.showroomId);
}

export function showroomAppointmentLabel(showroom: Showroom): string {
  if (showroom.appointmentRequired && !showroom.walkInAvailable) {
    return showroom.appointmentNotice;
  }
  if (showroom.appointmentRequired && showroom.walkInAvailable) {
    return `${showroom.appointmentNotice} Walk-ins may browse selected display pieces.`;
  }
  return "Walk-in welcome. Private fittings available by request.";
}
