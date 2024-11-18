import { NextResponse } from "next/server";

export function middleware(request: NextResponse) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
