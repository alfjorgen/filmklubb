import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Secret on-demand revalidation endpoint.
 *
 *   POST (or GET) /api/revalidate?secret=YOUR_SECRET
 *
 * Forces a refresh of the cached film data after an urgent program change,
 * instead of waiting for the hourly ISR window. The secret comes from the
 * REVALIDATE_SECRET env var and is compared in constant time.
 */
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function handle(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not configured." },
      { status: 500 },
    );
  }

  const provided = req.nextUrl.searchParams.get("secret") ?? "";
  if (!timingSafeEqual(provided, expected)) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret." },
      { status: 401 },
    );
  }

  revalidateTag("films");
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

// Allow GET too, so the refresh can be triggered from a browser/cron with a URL.
export async function GET(req: NextRequest) {
  return handle(req);
}
