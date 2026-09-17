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

function parseISO8601Duration(durationStr: string): string | null {
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return null;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${minutes}:${formattedSeconds}`;
  }
}

function formatSeconds(totalSecs: number): string {
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const formattedSeconds = seconds.toString().padStart(2, "0");
  if (hours > 0) {
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  return `${minutes}:${formattedSeconds}`;
}

// In-memory cache for fast subsequent requests
const durationCache = new Map<string, string>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");
  const videoIdParam = searchParams.get("id");

  const videoId = videoIdParam || (videoUrl ? extractYoutubeId(videoUrl) : null);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid video URL or ID" }, { status: 400 });
  }

  // Check cache first
  if (durationCache.has(videoId)) {
    return NextResponse.json(
      { duration: durationCache.get(videoId), videoId },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  }

  try {
    const endpoints = [
      `https://www.youtube.com/watch?v=${videoId}`,
      `https://youtube.com/shorts/${videoId}`,
    ];

    let formattedDuration: string | null = null;

    for (const url of endpoints) {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 86400 },
      });

      if (!res.ok) continue;

      const html = await res.text();

      // 1. Try itemprop="duration"
      const metaMatch = html.match(/itemprop=["']duration["']\s+content=["']([^"']+)["']/i);
      if (metaMatch && metaMatch[1]) {
        formattedDuration = parseISO8601Duration(metaMatch[1]);
        if (formattedDuration) break;
      }

      // 2. Try approxDurationMs
      const approxMatch = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
      if (approxMatch && approxMatch[1]) {
        const ms = parseInt(approxMatch[1], 10);
        if (!isNaN(ms)) {
          formattedDuration = formatSeconds(Math.round(ms / 1000));
          break;
        }
      }

      // 3. Try lengthSeconds
      const lengthMatch = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
      if (lengthMatch && lengthMatch[1]) {
        const sec = parseInt(lengthMatch[1], 10);
        if (!isNaN(sec)) {
          formattedDuration = formatSeconds(sec);
          break;
        }
      }
    }

    if (formattedDuration) {
      durationCache.set(videoId, formattedDuration);
      return NextResponse.json(
        { duration: formattedDuration, videoId },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }
      );
    }

    return NextResponse.json({ error: "Could not determine duration" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video duration", details: String(error) },
      { status: 500 }
    );
  }
}
