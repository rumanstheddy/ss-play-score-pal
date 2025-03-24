import { NextRequest } from "next/server";

export async function fetchFromApi(endpoint: string, body: any) {
  // Create a URL for the API route
  const url = new URL(`http://localhost:3000/api/igdb?path=${endpoint}`);

  // Create a NextRequest object
  const request = new NextRequest(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Dynamically import the API route handler
  const { POST: apiHandler } = await import(`@/app/api/igdb/route`);

  // Call the API route handler
  const response = await apiHandler(request);

  // Check if the response is OK
  if (!response.ok) {
    // console.error("Response error:", response);
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  // Parse and return the response data
  const data = await response.json();

  return data;
}
