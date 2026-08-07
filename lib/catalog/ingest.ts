import type { ImportProductRecord, ImportSummary } from "@/lib/catalog/types";
import { verifyProductStatic, applyVerificationToProduct } from "@/lib/catalog/verifyProduct";
import { normalizeImportRecord } from "@/lib/catalog/providers/types";
import type { Product } from "@/app/types/domain";

export interface IngestOptions {
  dryRun?: boolean;
  skipFetch?: boolean;
}

export function ingestImportRecords(
  records: ImportProductRecord[],
  options: IngestOptions = {}
): { products: Product[]; summary: ImportSummary } {
  const summary: ImportSummary = {
    added: 0,
    updated: 0,
    verified: 0,
    rejected: 0,
    needsManualReview: 0,
    errors: [],
  };

  const products: Product[] = [];
  const now = new Date().toISOString();

  for (const record of records) {
    try {
      const normalized = normalizeImportRecord(record);
      let product: Product = {
        ...normalized,
        id: normalized.id!,
        updatedAt: now,
        lastVerifiedAt: now,
        shippingDestinations: normalized.shippingDestinations ?? ["US", "EU", "UK"],
        condition: "new",
        aestheticTags: normalized.aestheticTags ?? [],
        presentationTags: normalized.presentationTags ?? [],
        occasionTags: normalized.occasionTags ?? [],
        climateTags: normalized.climateTags ?? [],
        departmentTags: normalized.departmentTags ?? [],
        availableSizes: normalized.availableSizes ?? [],
        imageUrls: normalized.imageUrls ?? [],
        inventoryStatus: normalized.inventoryStatus ?? "in-stock",
      };

      const staticResult = verifyProductStatic(product);
      product = applyVerificationToProduct(product, staticResult);

      if (staticResult.verificationStatus === "verified") {
        summary.verified++;
        if (options.dryRun) summary.added++;
        else summary.added++;
      } else if (
        staticResult.verificationStatus === "manual_review" ||
        staticResult.verificationStatus === "pending"
      ) {
        summary.needsManualReview++;
      } else {
        summary.rejected++;
        summary.errors.push(
          `${record.productName}: ${staticResult.verificationStatus} — ${staticResult.issues.join(", ")}`
        );
        if (options.dryRun) continue;
      }

      products.push(product);
    } catch (err) {
      summary.rejected++;
      summary.errors.push(`${record.productName}: ${String(err)}`);
    }
  }

  return { products, summary };
}

export async function ingestFromProvider(
  fetchFn: () => Promise<ImportProductRecord[]>,
  options: IngestOptions = {}
): Promise<{ products: Product[]; summary: ImportSummary }> {
  const records = await fetchFn();
  if (!records.length) {
    return {
      products: [],
      summary: {
        added: 0,
        updated: 0,
        verified: 0,
        rejected: 0,
        needsManualReview: 0,
        errors: ["Provider returned no products (credentials missing or empty feed)"],
      },
    };
  }
  return ingestImportRecords(records, options);
}
