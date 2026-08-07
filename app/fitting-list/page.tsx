"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import ShowroomNotice from "@/app/components/showroom/ShowroomNotice";
import RouteGuard from "@/app/components/RouteGuard";
import { MOCK_PRODUCTS } from "@/app/data/mockCatalog";
import { useApp } from "@/app/context/AppContext";
import { formatCurrency } from "@/app/services/lookbook.service";
import {
  getFittingLists,
  removeFittingListItem,
  submitTryOnRequest,
  updateFittingList,
} from "@/app/services/fittingList.service";
import { getShowroomById } from "@/app/services/showroom.service";
import type { FittingList } from "@/app/types/domain";

function FittingListContent() {
  const { user } = useApp();
  const [lists, setLists] = useState<FittingList[]>([]);
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [contactName, setContactName] = useState(user?.name ?? "");
  const [message, setMessage] = useState("");

  const refresh = () => setLists(getFittingLists());

  useEffect(() => {
    refresh();
  }, []);

  const draftLists = lists.filter((l) => l.status === "draft");
  const submittedLists = lists.filter((l) => l.status !== "draft");

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Fitting list</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          Showroom try-on requests
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Save pieces from the same showroom, choose sizes, and submit a try-on request before
          your appointment. Only the information needed to manage your fitting is shared with the
          retailer.
        </p>

        {message && (
          <p className="mt-6 border border-accent/30 bg-accent/5 p-4 text-sm text-accent">
            {message}
          </p>
        )}

        {draftLists.length === 0 && submittedLists.length === 0 && (
          <p className="mt-12 text-sm text-muted">
            Your fitting list is empty. Add pieces from a showroom product using{" "}
            <strong className="font-normal text-ivory">Request to Try On</strong>.
          </p>
        )}

        {draftLists.map((list) => {
          const showroom = getShowroomById(list.showroomId);
          if (!showroom) return null;

          return (
            <section key={list.id} className="mt-12 border border-smoke/40 p-6 md:p-8">
              <h2 className="font-display text-2xl text-ivory">{list.title}</h2>
              <ShowroomNotice showroom={showroom} compact />

              <ul className="mt-8 divide-y divide-smoke/30">
                {list.items.map((item) => {
                  const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <li key={item.id} className="flex gap-4 py-5">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-smoke/40">
                        <AppImage
                          src={product.imageUrls[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-ivory">{product.name}</p>
                        <p className="mt-1 text-xs text-muted">
                          Size {item.preferredSize}
                          {item.alternativeSizes.length
                            ? ` · also try ${item.alternativeSizes.join(", ")}`
                            : ""}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            removeFittingListItem(list.id, item.id);
                            refresh();
                          }}
                          className="mt-2 text-[10px] uppercase tracking-[0.2em] text-smoke hover:text-ivory"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm text-accent">
                        {formatCurrency(product.price, product.currency)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              {list.items.length > 0 && (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <label className="block text-xs text-muted">
                    Preferred fitting date
                    <input
                      type="date"
                      value={list.preferredDate ?? ""}
                      onChange={(e) => {
                        updateFittingList(list.id, { preferredDate: e.target.value });
                        refresh();
                      }}
                      className="mt-1 w-full border border-smoke/60 bg-charcoal px-3 py-2 text-ivory"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={list.privateFittingRequested ?? false}
                      onChange={(e) => {
                        updateFittingList(list.id, {
                          privateFittingRequested: e.target.checked,
                        });
                        refresh();
                      }}
                    />
                    Private fitting requested
                  </label>
                  <label className="block text-xs text-muted md:col-span-2">
                    Fit or accessibility notes
                    <textarea
                      rows={2}
                      value={list.generalNotes ?? ""}
                      onChange={(e) => {
                        updateFittingList(list.id, { generalNotes: e.target.value });
                        refresh();
                      }}
                      placeholder="Alternative sizes, mobility needs, styling preferences…"
                      className="mt-1 w-full border border-smoke/60 bg-charcoal px-3 py-2 text-ivory"
                    />
                  </label>
                </div>
              )}

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <label className="block text-xs text-muted">
                  Contact name (for appointment)
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-1 w-full border border-smoke/60 bg-charcoal px-3 py-2 text-ivory"
                  />
                </label>
                <label className="block text-xs text-muted">
                  Contact email
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 w-full border border-smoke/60 bg-charcoal px-3 py-2 text-ivory"
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <EditorialButton
                  onClick={() => {
                    const result = submitTryOnRequest(list.id, {
                      name: contactName,
                      email: contactEmail,
                    });
                    setMessage(result.message);
                    refresh();
                  }}
                  disabled={!list.items.length}
                >
                  Submit Try-On Request
                </EditorialButton>
                <Link href={`/showrooms/${showroom.slug}`}>
                  <EditorialButton variant="ghost">View Showroom</EditorialButton>
                </Link>
              </div>
            </section>
          );
        })}

        {submittedLists.map((list) => (
          <section key={list.id} className="mt-12 border border-smoke/30 p-6 opacity-90">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{list.status}</p>
            <h2 className="mt-2 font-display text-xl text-ivory">{list.title}</h2>
            <p className="mt-3 text-sm text-accent">{list.confirmationNote}</p>
            <p className="mt-2 text-xs text-smoke">
              {list.items.length} piece{list.items.length === 1 ? "" : "s"} · submitted{" "}
              {list.submittedAt ? new Date(list.submittedAt).toLocaleDateString() : ""}
            </p>
          </section>
        ))}

        <p className="mt-12 text-xs text-smoke">
          Mock beta flow — requests are saved locally. Production will route to verified retailer
          booking systems with minimal personal data.
        </p>
      </main>
    </div>
  );
}

export default function FittingListPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <FittingListContent />
    </RouteGuard>
  );
}
