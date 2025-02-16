import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    // Get secret token from request URL
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Validate the secret token
    if (!secret || secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // Revalidate all WordPress-related cache tags
    revalidateTag("wordpress");

    return NextResponse.json({ revalidated: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error revalidating", error: err?.message || err },
      { status: 500 }
    );
  }
}
