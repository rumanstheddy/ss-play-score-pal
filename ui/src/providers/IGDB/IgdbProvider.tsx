const baseUrl = "/igdb/";

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

type providerFnArgs = {
  fields?: string[];
  limit?: number;
  search?: string;
  filters?: string[];
};

const searchGames = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  console.log("searchGame data: ");

  let query: string = "fields " + (fields ? fields.join(",") : "*") + ";";
  query += limit ? "limit " + limit + ";" : "";
  query += search ? `search "${search}"` + ";" : "";
  query += filters ? "where " + filters.join(",") + ";" : "";

  const response = await fetch(baseUrl + "games", {
    method: "POST",
    headers: headers,
    body: query,
    mode: "cors",
  });

  const data = await response.json();
  console.log("searchGame data: ", data);
  return data;
};

export { searchGames };
