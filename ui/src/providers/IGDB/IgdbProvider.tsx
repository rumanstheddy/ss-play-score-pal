const baseUrl = "/igdb/";

type ApiHeaders = {
  Accept: string;
  "Client-ID": string;
  Authorization: string;
};

export const headers: ApiHeaders = {
  Accept: "application/json",
  "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID as string,
  Authorization: "Bearer " + (process.env.NEXT_PUBLIC_AUTH_TOKEN as string),
};

type ProviderFnArgs = {
  fields?: string[];
  limit?: number;
  search?: string;
  filters?: string[];
};

// ** Use this provider file only for fetching Data inside client components
// ** Have configured a different proxy to use it inside Server components

export const buildQuery = ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs): string => {
  let query: string = "fields " + (fields ? fields.join(",") : "*") + ";";
  query += limit ? "limit " + limit + ";" : "";
  query += search ? `search "${search}"` + ";" : "";
  query += filters ? "where " + filters.join(",") + ";" : "";

  return query;
};

const fetchData = async (path: string, query: string) => {
  const response = await fetch(baseUrl + path, {
    method: "POST",
    headers: headers,
    body: query,
    mode: "cors",
  });

  return response;
};

export const fetchGames = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("games", query);

  const data = await response.json();

  return data;
};

export const fetchScreenshots = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("screenshots", query);

  const data = await response.json();

  return data;
};

export const fetchCovers = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("covers", query);

  const data = await response.json();

  return data;
};

export const fetchArtworks = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("artworks", query);

  const data = await response.json();

  return data;
};

export const fetchReleaseDates = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("release_dates", query);

  const data = await response.json();

  return data;
};

export const fetchGenresById = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("genres", query);

  const data = await response.json();

  return data;
};

export const fetchInvolvedCompanies = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("involved_companies", query);

  const data = await response.json();

  return data;
};

export const fetchCompanies = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("companies", query);

  const data = await response.json();

  return data;
};

export const fetchPlatforms = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("platforms", query);

  const data = await response.json();

  return data;
};

export const fetchVideos = async ({
  fields,
  limit,
  search,
  filters,
}: ProviderFnArgs) => {
  const query = buildQuery({ fields, limit, search, filters });

  const response = await fetchData("game_videos", query);

  const data = await response.json();

  return data;
};
