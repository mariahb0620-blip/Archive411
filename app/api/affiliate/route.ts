import { NextRequest, NextResponse } from "next/server";

const RAKUTEN_TRACKING_BASE =
  process.env.RAKUTEN_TRACKING_BASE ??
  "https://click.linksynergy.com/deeplink";

const IMPACT_TRACKING_BASE =
  process.env.IMPACT_TRACKING_BASE ??
  "https://your-impact-tracking-url.com/deeplink";

const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID ?? "placeholder-id";
const RAKUTEN_MID = process.env.RAKUTEN_MID ?? "placeholder-mid";

const IMPACT_CAMPAIGN_ID = process.env.IMPACT_CAMPAIGN_ID ?? "placeholder-campaign";
const IMPACT_MEDIA_PARTNER_ID =
  process.env.IMPACT_MEDIA_PARTNER_ID ?? "placeholder-partner";

type AffiliateNetwork = "rakuten" | "impact";

interface AffiliateRequestBody {
  query?: string;
}

function detectAffiliateNetwork(query: string): AffiliateNetwork {
  const normalized = query.toLowerCase();

  if (
    normalized.includes("macy's") ||
    normalized.includes("macys") ||
    normalized.includes("macys.com")
  ) {
    return "rakuten";
  }

  if (normalized.includes("ssense") || normalized.includes("farfetch")) {
    return "impact";
  }

  return "impact";
}

function extractDestinationUrl(query: string): string {
  const urlMatch = query.match(/https?:\/\/[^\s]+/i);
  return urlMatch?.[0] ?? query;
}

function buildRakutenAffiliateUrl(destinationUrl: string): string {
  const params = new URLSearchParams({
    id: RAKUTEN_AFFILIATE_ID,
    mid: RAKUTEN_MID,
    murl: destinationUrl,
  });

  return `${RAKUTEN_TRACKING_BASE}?${params.toString()}&u1=archive411_user_click`;
}

function buildImpactAffiliateUrl(destinationUrl: string): string {
  const params = new URLSearchParams({
    campaignId: IMPACT_CAMPAIGN_ID,
    mediaPartnerId: IMPACT_MEDIA_PARTNER_ID,
    url: destinationUrl,
    subId1: "archive411_user_click",
  });

  return `${IMPACT_TRACKING_BASE}?${params.toString()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AffiliateRequestBody;
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    const network = detectAffiliateNetwork(query);
    const destinationUrl = extractDestinationUrl(query);

    const affiliateUrl =
      network === "rakuten"
        ? buildRakutenAffiliateUrl(destinationUrl)
        : buildImpactAffiliateUrl(destinationUrl);

    return NextResponse.json({ affiliateUrl, network });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
