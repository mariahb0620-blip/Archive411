"use client";

import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import EditorialButton from "@/app/components/EditorialButton";
import ProductSourceActions from "@/app/components/showroom/ProductSourceActions";
import { BETA_DESIGNERS } from "@/app/data/betaCatalog";
import { productImage } from "@/app/data/catalogImages";
import { formatCurrency, checkSizeAvailability } from "@/app/services/lookbook.service";
import type { Look, Product } from "@/app/types/domain";

interface LookOutfitSectionProps {
  look: Look;
  products: Product[];
  userSizes: string[];
  replacing: string | null;
  onReplaceItem: (productId: string, category: string) => void;
}

export default function LookOutfitSection({
  look,
  products,
  userSizes,
  replacing,
  onReplaceItem,
}: LookOutfitSectionProps) {
  return (
    <section className="border-b border-smoke/30 py-10 md:py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-ivory md:text-3xl">{look.title}</h2>
        <p className="text-sm text-accent">
          {formatCurrency(look.totalEstimatedPrice, look.currency)}
        </p>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{look.explanation}</p>

      {look.stylingExplanation && (
        <p className="mt-4 max-w-2xl border-l-2 border-accent/40 pl-4 text-sm italic leading-relaxed text-ivory/90">
          {look.stylingExplanation}
        </p>
      )}

      {look.matchExplanation && !look.matchExplanation.toLowerCase().includes("mock development") && (
        <p className="mt-3 text-xs text-smoke">{look.matchExplanation}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {products.map((product) => {
          const designer = product.designerId
            ? BETA_DESIGNERS.find((d) => d.id === product.designerId)
            : undefined;
          const sizeStatus = checkSizeAvailability(product, userSizes);
          const isSoldOut = product.inventoryStatus === "sold-out";
          const isBrokenLink = product.productUrl.includes("example.com");

          return (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border border-smoke/40 bg-charcoal/20"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <AppImage
                  src={product.imageUrls[0] ?? productImage(product.category)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:640px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-3 md:p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                  {designer?.labelName ?? product.category}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-ivory">{product.name}</p>
                <p className="mt-1 text-sm text-accent">
                  {formatCurrency(product.price, product.currency)}
                </p>
                {product.condition !== "new" && (
                  <p className="mt-1 text-xs capitalize text-smoke">{product.condition}</p>
                )}
                {isSoldOut && (
                  <p className="mt-2 text-xs text-smoke">Sold out at source</p>
                )}
                {sizeStatus === "check" && userSizes.length > 0 && (
                  <p className="mt-2 text-xs text-accent">Check size availability</p>
                )}
                {sizeStatus === "unavailable" && (
                  <p className="mt-2 text-xs text-smoke">Not in your selected size</p>
                )}
                {!isBrokenLink && !isSoldOut && (
                  <ProductSourceActions product={product} userSizes={userSizes} />
                )}
                {designer && (
                  <Link
                    href={`/designers/${designer.slug}`}
                    className="mt-2 text-[10px] uppercase tracking-[0.15em] text-accent hover:underline"
                  >
                    View designer
                  </Link>
                )}
                <div className="mt-auto pt-3">
                  <EditorialButton
                    variant="ghost"
                    disabled={replacing === product.id}
                    onClick={() => onReplaceItem(product.id, product.category)}
                  >
                    {replacing === product.id ? "Replacing..." : "Replace item"}
                  </EditorialButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
