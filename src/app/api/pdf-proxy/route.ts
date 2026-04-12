import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  // Auto-rewrite local domains to the configured WORDPRESS_URL if they failure
  let targetUrl = url;
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";

  if (url.includes(".test") || url.includes(".local")) {
    try {
      const parsedUrl = new URL(url);
      const parsedWpUrl = new URL(wpUrl);
      parsedUrl.protocol = parsedWpUrl.protocol;
      parsedUrl.host = parsedWpUrl.host;
      targetUrl = parsedUrl.toString();
    } catch (e) {
      console.warn("[PDF Proxy] Could not parse URL for rewrite");
    }
  }

  try {
    console.log(`[PDF Proxy] Fetching: ${targetUrl} (Original: ${url})`);
    const response = await fetch(targetUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `[PDF Proxy] Back-end error: ${response.status} ${response.statusText}`,
      );
      return new NextResponse(`Back-end error: ${response.status}`, {
        status: response.status,
      });
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", 'inline; filename="diario-oficial.pdf"');
    headers.set("Cache-Control", "public, max-age=3600");

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("[PDF Proxy] Fetch failure:", error.message);
    return new NextResponse(`Fetch failure: ${error.message}`, { status: 500 });
  }
}
