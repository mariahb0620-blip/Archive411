import type { FittingList, FittingListItem, Product, TryOnRequestPayload } from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";
import { getShowroomById } from "@/app/services/showroom.service";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function readAllLists(): FittingList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.fittingLists);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAllLists(lists: FittingList[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.fittingLists, JSON.stringify(lists));
}

export function getFittingLists(): FittingList[] {
  return readAllLists();
}

export function getFittingListById(listId: string): FittingList | null {
  return readAllLists().find((l) => l.id === listId) ?? null;
}

export function getOrCreateDraftList(showroomId: string): FittingList {
  const showroom = getShowroomById(showroomId);
  const existing = readAllLists().find(
    (l) => l.showroomId === showroomId && l.status === "draft"
  );
  if (existing) return existing;

  const list: FittingList = {
    id: id("fl"),
    showroomId,
    title: showroom ? `${showroom.city} Showroom Appointment` : "Showroom Appointment",
    items: [],
    status: "draft",
  };
  writeAllLists([...readAllLists(), list]);
  return list;
}

export function addProductToFittingList(
  product: Product,
  preferredSize: string,
  alternativeSizes: string[] = [],
  fitNotes?: string
): FittingList {
  if (!product.showroomId) {
    throw new Error("Product is not available through a showroom fitting flow.");
  }

  const lists = readAllLists();
  let list = lists.find(
    (l) => l.showroomId === product.showroomId && l.status === "draft"
  );

  if (!list) {
    list = getOrCreateDraftList(product.showroomId);
  }

  const item: FittingListItem = {
    id: id("fli"),
    productId: product.id,
    showroomId: product.showroomId,
    preferredSize,
    alternativeSizes,
    fitNotes,
    addedAt: new Date().toISOString(),
  };

  const withoutDup = list.items.filter((i) => i.productId !== product.id);
  list = { ...list, items: [...withoutDup, item] };

  writeAllLists(
    lists.some((l) => l.id === list!.id)
      ? lists.map((l) => (l.id === list!.id ? list! : l))
      : [...lists, list!]
  );

  return list!;
}

export function updateFittingList(
  listId: string,
  patch: Partial<
    Pick<
      FittingList,
      "preferredDate" | "privateFittingRequested" | "generalNotes" | "title"
    >
  >
): FittingList | null {
  const lists = readAllLists();
  const idx = lists.findIndex((l) => l.id === listId);
  if (idx < 0) return null;
  lists[idx] = { ...lists[idx], ...patch };
  writeAllLists(lists);
  return lists[idx];
}

export function removeFittingListItem(listId: string, itemId: string): FittingList | null {
  const lists = readAllLists();
  const idx = lists.findIndex((l) => l.id === listId);
  if (idx < 0) return null;
  lists[idx] = {
    ...lists[idx],
    items: lists[idx].items.filter((i) => i.id !== itemId),
  };
  writeAllLists(lists);
  return lists[idx];
}

/** Mock submission — production would POST to retailer API with minimal PII. */
export function submitTryOnRequest(
  listId: string,
  contact: { name?: string; email?: string }
): { success: boolean; list: FittingList | null; message: string } {
  const lists = readAllLists();
  const idx = lists.findIndex((l) => l.id === listId);
  if (idx < 0) {
    return { success: false, list: null, message: "Fitting list not found." };
  }

  const list = lists[idx];
  if (!list.items.length) {
    return { success: false, list, message: "Add at least one piece before submitting." };
  }

  const payload: TryOnRequestPayload = {
    fittingListId: list.id,
    showroomId: list.showroomId,
    contactEmail: contact.email,
    contactName: contact.name,
    preferredDate: list.preferredDate,
    privateFittingRequested: list.privateFittingRequested,
    generalNotes: list.generalNotes,
    items: list.items.map((i) => ({
      productId: i.productId,
      preferredSize: i.preferredSize,
      alternativeSizes: i.alternativeSizes,
      fitNotes: i.fitNotes,
      accessibilityNotes: i.accessibilityNotes,
    })),
  };

  // Mock: log payload structure only — no external transmission in beta
  if (typeof window !== "undefined") {
    sessionStorage.setItem("archive411-last-tryon-request", JSON.stringify(payload));
  }

  lists[idx] = {
    ...list,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    confirmationNote:
      "Request received (mock). The showroom will confirm availability and appointment details. No payment required at this stage.",
  };
  writeAllLists(lists);

  return {
    success: true,
    list: lists[idx],
    message: lists[idx].confirmationNote ?? "Request submitted.",
  };
}

export function countFittingListItems(): number {
  return readAllLists()
    .filter((l) => l.status === "draft")
    .reduce((sum, l) => sum + l.items.length, 0);
}
