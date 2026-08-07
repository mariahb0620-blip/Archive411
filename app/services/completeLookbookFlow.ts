import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {
  BuildLookAnswers,
  GenerationMethod,
  Look,
  Lookbook,
  Product,
} from "@/app/types/domain";
import { storeLookbookSession } from "@/app/services/lookbook.service";

type SaveLookbookFn = (
  lookbook: Lookbook,
  session?: {
    looks: Look[];
    method: GenerationMethod;
    buildPreferences?: BuildLookAnswers;
    products?: Product[];
  }
) => Promise<void>;

/** Store session, save to archive, then open the lookbook detail view. */
export async function completeLookbookFlow(
  router: AppRouterInstance,
  saveLookbook: SaveLookbookFn,
  params: {
    lookbook: Lookbook;
    looks: Look[];
    method: GenerationMethod;
    buildPreferences?: BuildLookAnswers;
    products?: Product[];
  }
) {
  storeLookbookSession(
    params.lookbook,
    params.looks,
    params.method,
    params.buildPreferences,
    params.products
  );

  await saveLookbook(params.lookbook, {
    looks: params.looks,
    method: params.method,
    buildPreferences: params.buildPreferences,
    products: params.products,
  });

  storeLookbookSession(
    { ...params.lookbook, saved: true },
    params.looks,
    params.method,
    params.buildPreferences,
    params.products
  );

  router.push(`/lookbooks/${params.lookbook.id}`);
}
