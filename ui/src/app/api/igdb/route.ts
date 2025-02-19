import { headers } from "@/providers/IGDB/IgdbProvider";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const path = req.nextUrl.searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const query = await req.json();
  const url = `${process.env.NEXT_PUBLIC_GAMES_API_BASE_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: query,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
};
