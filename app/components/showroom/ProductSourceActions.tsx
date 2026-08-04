"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/app/types/domain";
import EditorialButton from "@/app/components/EditorialButton";
import ShowroomNotice from "@/app/components/showroom/ShowroomNotice";
import {
  getProductShowroom,
  isShowroomProduct,
} from "@/app/services/showroom.service";
import { addProductToFittingList } from "@/app/services/fittingList.service";

interface ProductSourceActionsProps {
  product: Product;
  userSizes?: string[];
  onAddedToFittingList?: () => void;
}

export default function ProductSourceActions({
  product,
  userSizes = [],
  onAddedToFittingList,
}: ProductSourceActionsProps) {
  const [preferredSize, setPreferredSize] = useState(
    userSizes[0] ?? product.availableSizes[0] ?? ""
  );
  const [altSize, setAltSize] = useState("");
  const [added, setAdded] = useState(false);
  const showroom = getProductShowroom(product);
  const showroomFlow = isShowroomProduct(product) && showroom;

  if (showroomFlow) {
    return (
      <div className="mt-4 space-y-4">
        <ShowroomNotice showroom={showroom} compact />
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
          Showroom / Private Shopping — not off-the-rack
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-muted">
            Preferred size
            <select
              value={preferredSize}
              onChange={(e) => setPreferredSize(e.target.value)}
              className="border border-smoke/60 bg-charcoal px-2 py-2 text-ivory"
            >
              {product.availableSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Alternative size (optional)
            <select
              value={altSize}
              onChange={(e) => setAltSize(e.target.value)}
              className="border border-smoke/60 bg-charcoal px-2 py-2 text-ivory"
            >
              <option value="">None</option>
              {product.availableSizes
                .filter((s) => s !== preferredSize)
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <EditorialButton
            onClick={() => {
              addProductToFittingList(
                product,
                preferredSize,
                altSize ? [altSize] : []
              );
              setAdded(true);
              onAddedToFittingList?.();
            }}
            disabled={added || !preferredSize}
          >
            {added ? "Added to fitting list" : "Request to Try On"}
          </EditorialButton>
          {showroom.bookingUrl && (
            <a
              href={showroom.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-smoke/60 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ivory hover:border-accent"
            >
              Book a Fitting
            </a>
          )}
          <Link
            href={`/showrooms/${showroom.slug}`}
            className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-accent hover:text-ivory"
          >
            View Showroom
          </Link>
        </div>
        <Link
          href="/fitting-list"
          className="block text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ivory"
        >
          Open fitting list →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <a
        href={product.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ivory"
      >
        Visit product website
      </a>
      {product.madeToOrder && (
        <span className="text-[10px] uppercase tracking-[0.15em] text-smoke">
          Made to order available
        </span>
      )}
    </div>
  );
}
