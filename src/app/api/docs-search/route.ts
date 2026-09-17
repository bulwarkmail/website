import { NextRequest, NextResponse } from "next/server";
import { searchDocs } from "@/lib/docs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const requested = request.nextUrl.searchParams.get("edition");
  const edition = requested === "full" || requested === "lite" ? requested : undefined;
  const results = searchDocs(q, edition);
  return NextResponse.json(results);
}
