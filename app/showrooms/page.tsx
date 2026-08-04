"use client";

import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/app/components/AppHeader";
import RouteGuard from "@/app/components/RouteGuard";
import { getAllShowrooms } from "@/app/services/showroom.service";

function ShowroomsContent() {
  const showrooms = getAllShowrooms();

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
          Showroom / Private Shopping
        </p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          Appointment-based fashion sources
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Some participating retailers operate as showrooms, styling studios and private shopping
          spaces — not traditional off-the-rack stores. Browse digitally, build a fitting list,
          and request try-ons before you travel.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {showrooms.map((sr) => (
            <Link
              key={sr.id}
              href={`/showrooms/${sr.slug}`}
              className="group border border-smoke/50 bg-charcoal transition-colors hover:border-accent/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={sr.coverImageUrl}
                  alt={sr.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  {sr.retailerClassification}
                </p>
                <h2 className="mt-2 font-display text-2xl text-ivory">{sr.name}</h2>
                <p className="mt-2 text-xs text-muted">
                  {sr.city}, {sr.country}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-muted">{sr.biography}</p>
                <p className="mt-4 text-xs text-smoke">{sr.appointmentNotice}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ShowroomsPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <ShowroomsContent />
    </RouteGuard>
  );
}
