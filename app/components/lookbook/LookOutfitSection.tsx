"use client";

import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import EditorialButton from "@/app/components/EditorialButton";
import ProductSourceActions from "@/app/components/showroom/ProductSourceActions";
import { getVerifiedDesignersSync } from "@/lib/catalog/verifiedPool";
import { productImage } from "@/app/data/catalogImages";
import { formatCurrency, checkSizeAvailability } from "@/app/services/lookbook.service";
import { isShowroomProduct } from "@/app/services/showroom.service";
import { resolveProductShopUrl } from "@/app/utils/productShopUrl";
import type { Look, Product } from "@/app/types/domain";

interface LookOutfitSectionProps {
  look: Look;
  products: Product[];
  userSizes: string[];
  replacing: string | null;
  onReplaceItem: (productId: string, category: string) => void;
}

function ShopLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export default function LookOutfitSection({
  look,
  products,
  userSizes,
  replacing,
  onReplaceItem,
}: LookOutfitSectionProps) {
  const designers = getVerifiedDesignersSync();

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

      {products.length === 0 && (look.productIds?.length ?? 0) > 0 && (
        <p className="mt-4 text-sm text-accent">
          Product details could not be loaded. Try generating a new lookbook from Build My Look.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {products.map((product) => {
          const designer = product.designerId
            ? designers.find((d) => d.id === product.designerId)
            : undefined;
          const sizeStatus = checkSizeAvailability(product, userSizes);
          const isSoldOut = product.inventoryStatus === "sold-out";
          const shopUrl = resolveProductShopUrl(product, designer?.website);
          const showroomFlow = isShowroomProduct(product);
          const imageSrc = product.imageUrls[0] ?? productImage(product.category);

          const imageBlock = (
            <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/40">
              <AppImage
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-[1.02]"
                sizes="(max-width:640px) 50vw, 33vw"
              />
            </div>
          );

          return (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-smoke/40 bg-charcoal/20"
            >
              {shopUrl && !showroomFlow && !isSoldOut ? (
                <ShopLink href={shopUrl} className="block">
                  {imageBlock}
                </ShopLink>
              ) : (
                imageBlock
              )}

              <div className="flex flex-1 flex-col p-3 md:p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                  {designer?.labelName ?? product.category}
                </p>
                {shopUrl && !showroomFlow ? (
                  <ShopLink
                    href={shopUrl}
                    className="mt-1 line-clamp-2 text-sm text-ivory hover:text-accent"
                  >
                    {product.name}
                  </ShopLink>
                ) : (
                  <p className="mt-1 line-clamp-2 text-sm text-ivory">{product.name}</p>
                )}
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

                {showroomFlow ? (
                  <ProductSourceActions product={product} userSizes={userSizes} />
                ) : shopUrl && !isSoldOut ? (
                  <div className="mt-4 space-y-2">
                    <a
                      href={shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ivory active:scale-[0.98]"
                    >
                      Shop now
                    </a>
                    <ProductSourceActions product={product} userSizes={userSizes} />
                  </div>
                ) : designer?.website ? (
                  <div className="mt-4">
                    <a
                      href={designer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-smoke/60 px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-accent active:scale-[0.98]"
                    >
                      Visit designer
                    </a>
                  </div>
                ) : null}

                {designer && (
                  <Link
                    href={`/designers/${designer.slug}`}
                    className="mt-2 text-[10px] uppercase tracking-[0.15em] text-accent hover:underline"
                  >
                    View designer profile
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
