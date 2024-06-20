const apiUrl = "https://api.igdb.com/v4/";

interface IapiHeaders {
  Accept: string;
  "Client-ID": string;
  Authorization: string;
}

const apiHeaders: IapiHeaders = {
    Accept : "application/json",
    "Client-ID": "",
    Authorization : 
};

const searchGame = async () => {
  const data = await fetch(apiUrl, {
    method: "POST",
    headers: {},
  });
};
