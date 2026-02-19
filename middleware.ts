import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "pharmacies-de-garde.net";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");

  const isWww = host.startsWith("www.");
  const isHttp = proto === "http";

  if (!host.includes(CANONICAL_HOST)) {
    return NextResponse.next();
  }

  if (isWww || isHttp) {
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}
