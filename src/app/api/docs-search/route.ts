import { NextRequest, NextResponse } from "next/server";
import { searchDocs } from "@/lib/docs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = searchDocs(q);
  return NextResponse.json(results);
}
