import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  return handleRevalidate(req);
}

// Allow GET requests for manual testing
export async function GET(req: NextRequest) {
  return handleRevalidate(req);
}

async function handleRevalidate(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const path = searchParams.get("path");

    if (!secret || secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/");
      revalidatePath("/posts");
      revalidatePath("/categories");
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: (error as Error).message },
      { status: 500 }
    );
  }
}
