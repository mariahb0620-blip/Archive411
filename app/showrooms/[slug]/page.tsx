"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import ShowroomNotice from "@/app/components/showroom/ShowroomNotice";
import RouteGuard from "@/app/components/RouteGuard";
import { MOCK_DESIGNERS } from "@/app/data/mockCatalog";
import { formatCurrency } from "@/app/services/lookbook.service";
import {
  getShowroomBySlug,
  getShowroomProducts,
} from "@/app/services/showroom.service";
import { addProductToFittingList } from "@/app/services/fittingList.service";

function ShowroomDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const showroom = getShowroomBySlug(slug);
  const products = showroom ? getShowroomProducts(showroom.id) : [];

  if (!showroom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-sm text-muted">Showroom not found.</p>
      </div>
    );
  }

  const designers = showroom.designerIds
    .map((id) => MOCK_DESIGNERS.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <div className="relative mb-10 aspect-[21/9] overflow-hidden border border-smoke/40">
          <Image src={showroom.coverImageUrl} alt={showroom.name} fill className="object-cover" sizes="1200px" priority />
        </div>

        <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
          {showroom.retailerClassification}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ivory md:text-5xl">{showroom.name}</h1>
        <p className="mt-2 text-sm text-muted">
          {showroom.address} · {showroom.city}, {showroom.country}
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{showroom.biography}</p>

        <div className="mt-8 max-w-2xl">
          <ShowroomNotice showroom={showroom} />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCell label="Appointment" value={showroom.appointmentRequired ? "Required" : "Optional"} />
          <InfoCell label="Walk-in" value={showroom.walkInAvailable ? "Available" : "Not available"} />
          <InfoCell label="Fittings" value={showroom.fittingAvailable ? "Yes" : "No"} />
          <InfoCell label="Styling assistance" value={showroom.stylingAssistance ? "Yes" : "No"} />
          <InfoCell label="Made to order" value={showroom.madeToOrder ? "Yes" : "Limited"} />
          <InfoCell label="International clients" value={showroom.internationalClients ? "Welcome" : "Local focus"} />
          <InfoCell label="Languages" value={showroom.languagesSpoken.join(", ")} />
          <InfoCell label="Size range" value={showroom.sizeRange} />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {showroom.bookingUrl && (
            <a href={showroom.bookingUrl} target="_blank" rel="noopener noreferrer">
              <EditorialButton>Book a Fitting</EditorialButton>
            </a>
          )}
          <Link href="/fitting-list">
            <EditorialButton variant="ghost">Open Fitting List</EditorialButton>
          </Link>
          {showroom.contactEmail && (
            <a
              href={`mailto:${showroom.contactEmail}`}
              className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ivory"
            >
              Contact a Stylist
            </a>
          )}
        </div>

        {designers.length > 0 && (
          <section className="mt-16 border-t border-smoke/30 pt-12">
            <h2 className="text-[10px] uppercase tracking-[0.35em] text-muted">Designers carried</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {designers.map((d) => (
                <li key={d!.id}>
                  <Link
                    href={`/designers/${d!.slug}`}
                    className="border border-smoke/50 px-3 py-2 text-xs text-ivory hover:border-accent"
                  >
                    {d!.labelName}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <h2 className="text-[10px] uppercase tracking-[0.35em] text-muted">Showroom catalog</h2>
          <p className="mt-2 text-xs text-smoke">
            Mock reference inventory — select pieces for your fitting list before your appointment.
          </p>
          <ul className="mt-8 divide-y divide-smoke/30">
            {products.map((product) => (
              <li key={product.id} className="flex gap-4 py-6">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-smoke/40">
                  <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ivory">{product.name}</p>
                  <p className="mt-1 text-sm text-accent">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                  <p className="mt-1 text-xs text-smoke">
                    Sizes: {product.availableSizes.join(", ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <EditorialButton
                      variant="ghost"
                      onClick={() =>
                        addProductToFittingList(
                          product,
                          product.availableSizes[0] ?? "M"
                        )
                      }
                    >
                      Request to Try On
                    </EditorialButton>
                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ivory"
                    >
                      Ask About Availability
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-smoke/40 p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-sm text-ivory">{value}</p>
    </div>
  );
}

export default function ShowroomDetailPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <ShowroomDetailContent />
    </RouteGuard>
  );
}
