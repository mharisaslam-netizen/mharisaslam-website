import { NextResponse } from "next/server";
import { getRun } from "workflow/api";
import { verifyReleaseApprovalToken } from "../../../../lib/release-auth";
import { verifyLiveUrl } from "../../../../lib/connectors/verify";
import { publishXPost } from "../../../../lib/connectors/x";
import {
  decryptXRefreshToken,
  encryptXRefreshToken,
  X_REFRESH_COOKIE
} from "../../../../lib/x-cookie";

export const runtime = "nodejs";

function cookieValue(cookie: string, name: string) {
  const match = cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const campaignRunId = String(body?.campaignRunId || "");
  const releaseToken = String(body?.releaseToken || "");
  const confirmation = String(body?.confirmation || "");

  if (!campaignRunId || !releaseToken) {
    return NextResponse.json(
      { error: "Fresh campaign approval is required before retrying X." },
      { status: 400 }
    );
  }

  if (confirmation !== "RETRY X NOW") {
    return NextResponse.json(
      { error: "Explicit X retry confirmation was not supplied." },
      { status: 400 }
    );
  }

  if (!verifyReleaseApprovalToken(releaseToken, campaignRunId)) {
    return NextResponse.json(
      { error: "Campaign approval expired or is invalid. Approve the package again." },
      { status: 403 }
    );
  }

  try {
    const run = await getRun(campaignRunId);
    const status = String(await run.status || "").toLowerCase();
    if (status !== "completed") {
      return NextResponse.json(
        { error: "Campaign must be completed before X can be published." },
        { status: 409 }
      );
    }

    const campaign: any = await run.returnValue;
    const artifacts = campaign?.artifacts || {};
    const article = artifacts?.article || {};
    const channels = artifacts?.channels || {};
    const verification = artifacts?.verification || {};

    if (!verification?.safeToStage) {
      return NextResponse.json(
        { error: "Campaign verification did not clear this package for release." },
        { status: 409 }
      );
    }

    if (!article?.slug || !channels?.xPost) {
      return NextResponse.json(
        { error: "Campaign is missing the approved X release artifacts." },
        { status: 422 }
      );
    }

    const canonicalUrl =
      "https://www.mharisaslam.com/insights/" + article.slug;

    const live = await verifyLiveUrl(canonicalUrl);
    if (!live.ok || live.status !== 200) {
      return NextResponse.json(
        { error: "Canonical article is not live, so X was not published." },
        { status: 409 }
      );
    }

    const cookie = request.headers.get("cookie") || "";
    const encryptedRefresh = cookieValue(cookie, X_REFRESH_COOKIE);
    const cookieRefresh = decryptXRefreshToken(encryptedRefresh);

    if (!cookieRefresh) {
      return NextResponse.json(
        {
          error:
            "The new X authorization is not available in this browser session. Reconnect X, then return here and retry."
        },
        { status: 409 }
      );
    }

    const draft = String(channels.xPost || "").trim();
    const text = draft.includes(canonicalUrl)
      ? draft
      : draft + "\n\n" + canonicalUrl;

    const published = await publishXPost({
      text,
      refreshToken: cookieRefresh
    });

    const { nextRefreshToken, ...safePublished } = published;
    const response = NextResponse.json({
      x: safePublished,
      canonicalUrl,
      retriedAt: new Date().toISOString()
    });

    if (nextRefreshToken) {
      response.cookies.set(
        X_REFRESH_COOKIE,
        encryptXRefreshToken(String(nextRefreshToken)),
        {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 180
        }
      );
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "X retry failed."
      },
      { status: 500 }
    );
  }
}
