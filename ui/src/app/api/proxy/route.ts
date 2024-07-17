import { NextRequest, NextResponse } from "next/server";

type apiHeaders = {
  Accept: string;
  "Client-ID": string;
  Authorization: string;
};

const headers: apiHeaders = {
  Accept: "application/json",
  "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID as string,
  Authorization: "Bearer " + (process.env.NEXT_PUBLIC_AUTH_TOKEN as string),
};

export async function POST(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  const query = await req.json();

  //   console.log("path ", path);
    console.log("query ", query);

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  //   console.log("url: ", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: query,
    });

    // console.log(response);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    // console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
