const baseUrl = "/igdb/";

type IapiHeaders = {
  Accept: string;
  "Client-ID": string;
  Authorization: string;
};

const apiHeaders: IapiHeaders = {
  Accept: "application/json",
  "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID as string,
  Authorization: "Bearer " + (process.env.NEXT_PUBLIC_AUTH_TOKEN as string),
};

const searchGame = async (body) => {
  console.log("searchGame data: ");

  const response = await fetch(baseUrl + "games", {
    method: "POST",
    headers: apiHeaders,
    body: body,
    mode: "cors",
  });

  const data = await response.json();
  console.log("searchGame data: ", data);
  return data;
};

export { searchGame };
