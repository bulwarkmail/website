import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL =
  "https://raw.githubusercontent.com/bulwarkmail/webmail/main/setup.sh";

export async function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent")?.toLowerCase() ?? "";

  // Detect CLI tools (curl, wget, httpie, fetch, etc.)
  const isCLI =
    ua.startsWith("curl/") ||
    ua.startsWith("wget/") ||
    ua.startsWith("httpie/") ||
    ua.includes("powershell") ||
    ua.includes("python-requests") ||
    ua === "";

  if (isCLI) {
    // Fetch the script from GitHub and stream it back
    const upstream = await fetch(SCRIPT_URL);
    if (!upstream.ok) {
      return new NextResponse("Failed to fetch install script", {
        status: 502,
      });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }

  // Browser visitors get redirected to the installation docs
  return NextResponse.redirect(
    new URL("/docs/getting-started/installation", request.url)
  );
}
