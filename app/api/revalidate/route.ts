import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Handle both GET and POST requests
export async function GET(req: NextRequest) {
  return handleRevalidate(req);
}

export async function POST(req: NextRequest) {
  return handleRevalidate(req);
}

// Main function to handle revalidation
async function handleRevalidate(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const path = url.searchParams.get("path");

    // Validate the secret key
    if (!secret || secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // If path is provided, revalidate only that page
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ message: `Revalidated ${path}` });
    }

    // Default revalidate for common pages
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath("/categories");

    return NextResponse.json({ message: "Revalidated all main pages" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: (error as Error).message },
      { status: 500 }
    );
  }
}
