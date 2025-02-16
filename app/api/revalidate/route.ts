import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  // Get secret token from request URL
  const secret = req.nextUrl.searchParams.get("secret");
  const validSecret = process.env.WORDPRESS_WEBHOOK_SECRET;

  // Validate the secret token
  if (!secret || secret !== validSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate all WordPress-related cache tags
    revalidateTag("wordpress");

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: err.message },
      { status: 500 }
    );
  }
}
