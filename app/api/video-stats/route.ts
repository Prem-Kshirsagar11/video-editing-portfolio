import { NextRequest, NextResponse } from "next/server";

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch && ytMatch[1]) return ytMatch[1];
  return null;
}

// In-memory cache for fast subsequent requests
const statsCache = new Map<string, { views?: number | string; likes?: number | string; comments?: number | string }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");
  const videoIdParam = searchParams.get("id");

  const videoId = videoIdParam || (videoUrl ? extractYoutubeId(videoUrl) : null);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid video URL or ID" }, { status: 400 });
  }

  // Check cache first
  if (statsCache.has(videoId)) {
    return NextResponse.json(
      { stats: statsCache.get(videoId), videoId },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  try {
    // Fetch from InnerTube API and returnyoutubedislike API in parallel
    const [innertubeRes, rydRes] = await Promise.allSettled([
      fetch("https://www.youtube.com/youtubei/v1/next?prettyPrint=false", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240101.01.00",
              hl: "en",
              gl: "US",
            },
          },
          videoId,
        }),
      }),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`),
    ]);

    let views: number | string | undefined;
    let likes: number | string | undefined;
    let comments: number | string | undefined;

    // Parse InnerTube API response (views, likes, comments)
    if (innertubeRes.status === "fulfilled" && innertubeRes.value.ok) {
      try {
        const data = await innertubeRes.value.json();
        const contents =
          data?.contents?.twoColumnWatchNextResults?.results?.results?.contents || [];

        // Extract view count from primary info
        const primaryInfo = contents.find(
          (r: Record<string, unknown>) => r?.videoPrimaryInfoRenderer
        );
        if (primaryInfo) {
          const viewText =
            primaryInfo.videoPrimaryInfoRenderer?.viewCount?.videoViewCountRenderer?.viewCount
              ?.simpleText;
          if (viewText) {
            const parsed = parseInt(viewText.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(parsed)) views = parsed;
          }

          // Extract likes from the like button
          const menuRenderer =
            primaryInfo.videoPrimaryInfoRenderer?.videoActions?.menuRenderer;
          if (menuRenderer) {
            const topLevelButtons = menuRenderer.topLevelButtons || [];
            for (const btn of topLevelButtons) {
              const segmented = btn?.segmentedLikeDislikeButtonViewModel;
              if (segmented) {
                const accessibilityText =
                  segmented?.likeButtonViewModel?.likeButtonViewModel
                    ?.toggleButtonViewModel?.toggleButtonViewModel
                    ?.defaultButtonViewModel?.buttonViewModel?.accessibilityText;
                if (accessibilityText) {
                  const likeMatch = accessibilityText.match(
                    /([0-9,]+)\s+other\s+people/i
                  );
                  if (likeMatch) {
                    const parsed = parseInt(
                      likeMatch[1].replace(/,/g, ""),
                      10
                    );
                    if (!isNaN(parsed)) likes = parsed;
                  }
                }
              }
            }
          }
        }

        // Extract comment count from engagement panels
        const engagementPanels = data?.engagementPanels || [];
        for (const panel of engagementPanels) {
          const header = panel?.engagementPanelSectionListRenderer?.header;
          const commentRuns =
            header?.engagementPanelTitleHeaderRenderer?.contextualInfo?.runs;
          if (commentRuns) {
            const commentText = commentRuns
              .map((r: { text: string }) => r.text)
              .join("")
              .trim();
            if (commentText) comments = commentText;
          }
        }
      } catch {
        // InnerTube parse failed, continue with RYD fallback
      }
    }

    // Parse returnyoutubedislike API response (fallback for views & likes)
    if (rydRes.status === "fulfilled" && rydRes.value.ok) {
      try {
        const rydData = await rydRes.value.json();
        if (!views && rydData.viewCount) views = rydData.viewCount;
        if (!likes && rydData.likes) likes = rydData.likes;
      } catch {
        // RYD parse failed
      }
    }

    const result = {
      views: views ?? undefined,
      likes: likes ?? undefined,
      comments: comments ?? undefined,
    };

    statsCache.set(videoId, result);

    return NextResponse.json(
      { stats: result, videoId },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video stats", details: String(error) },
      { status: 500 }
    );
  }
}
