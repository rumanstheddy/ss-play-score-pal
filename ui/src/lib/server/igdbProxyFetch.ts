import { NextRequest } from "next/server";

//TODO: Learn more about how proxies and SSR works in Server components

export const igdbProxyFetch = async (path: string, body: any) => {
  //TODO: Change the base url for production build
  const url = new URL(`http://localhost:3000/api/igdb?path=${path}`);

  const request = new NextRequest(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const { POST: proxyHandler } = await import("@/app/api/igdb/route");

  // Call the proxy handler and convert the response to JSON
  const response = await proxyHandler(request);
  const data = await response.json();

  return data;
};
