import { NextRequest } from "next/server";

//TODO: Learn more about how proxies and SSR work in Server components

export const fetchFromProxy = async (path: string, body: any) => {
  const url = new URL(`http://localhost:3000/api/proxy?path=${path}`);

  const request = new NextRequest(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const { POST: proxyHandler } = await import("@/app/api/proxy/route");

  // Call the proxy handler and convert the response to JSON
  const response = await proxyHandler(request);
  const data = await response.json();

  return data;
};
