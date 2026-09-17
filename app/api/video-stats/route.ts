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
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch video" }, { status: 502 });
    }

    const html = await res.text();

    // View count
    let views: number | null = null;
    const viewJson = html.match(/"viewCount":\s*"(\d+)"/);
    if (viewJson) {
      views = parseInt(viewJson[1], 10);
    } else {
      const viewMeta = html.match(/itemprop=["']interactionCount["']\s+content=["'](\d+)["']/i);
      if (viewMeta) views = parseInt(viewMeta[1], 10);
    }

    // Likes count
    let likes: number | string | null = null;
    const likeJson = html.match(/"likeCount":\s*"(\d+)"/);
    if (likeJson) {
      likes = parseInt(likeJson[1], 10);
    } else {
      const likeText =
        html.match(/"accessibilityData":\{"label":"([0-9,.]+[KM]?\s+likes)"\}/i) ||
        html.match(/"defaultText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+likes?)"/i);
      if (likeText) likes = likeText[1].replace(/likes?/i, "").trim();
    }

    // Comments count
    let comments: number | string | null = null;
    const commentMatch =
      html.match(/"totalComments":\s*"?(\d+)"?/) ||
      html.match(/"commentsCount":\{"runs":\[\{"text":"([^"]+)"\}/) ||
      html.match(/"commentCount":\s*"(\d+)"/);
    if (commentMatch) {
      comments = commentMatch[1];
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
