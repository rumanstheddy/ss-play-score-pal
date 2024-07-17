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

// TODO: Change the fetchData method to use the older process
// ** Use this provider file only for fetching Data inside client components
// ** Have configured a different proxy to use it inside Server components

export const buildQuery = ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs): string => {
  let query: string = "fields " + (fields ? fields.join(",") : "*") + ";";
  query += limit ? "limit " + limit + ";" : "";
  query += search ? `search "${search}"` + ";" : "";
  query += filters ? "where " + filters.join(",") + ";" : "";

  return query;
};

const fetchData = async (path: string, query: string) => {
  console.log("path: ", path);
  const proxyUrl = `/api/proxy?path=${path}`;
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
    mode: "cors",
  });

  return response;
};

export const fetchGames = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  // const url = baseUrl + "games";

  const response = await fetchData("games", query);

  const data = await response.json();

  return data;
};

export const fetchScreenshots = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  // const response = await fetchData(baseUrl + "screenshots", query);
  const response = await fetchData("screenshots", query);

  const data = await response.json();

  return data;
};

export const fetchCovers = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData(baseUrl + "covers", query);

  const data = await response.json();

  return data;
};

export const fetchReleaseDates = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData(baseUrl + "release_dates", query);

  const data = await response.json();

  return data;
};

export const fetchGenresById = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  // const response = await fetchData(baseUrl + "genres", query);
  const response = await fetchData("genres", query);

  const data = await response.json();

  return data;
};

export const fetchInvolvedCompanies = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData(baseUrl + "involved_companies", query);

  const data = await response.json();

  return data;
};

export const fetchCompanies = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData(baseUrl + "companies", query);

  const data = await response.json();

  return data;
};

export const fetchPlatforms = async ({
  fields,
  limit,
  search,
  filters,
}: providerFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData(baseUrl + "platforms", query);

  const data = await response.json();

  return data;
};
