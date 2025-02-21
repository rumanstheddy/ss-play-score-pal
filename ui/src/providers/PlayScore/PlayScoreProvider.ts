const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type GqlQueryArgs<T> = {
  isQuery: boolean;
  name: string;
  functionName: string;
  fields: string | undefined;
  parameters?: Record<string, string>;
  variables?: Record<string, T>;
};

export const buildGqlQuery = <T>({
  isQuery = true,
  name,
  functionName,
  fields,
  parameters,
  variables,
}: GqlQueryArgs<T>) => {
  const queryName = `${isQuery ? `query` : `mutation`} ${name}${
    isQuery ? `Query` : `Mutation`
  }`;

  const queryParams = `${
    parameters
      ? `(${Object.keys(parameters)
          .map((key) => `${key}: ${parameters[key]}`)
          .join(", ")})`
      : ""
  }`;

  const queryFn = `${functionName} ${
    variables
      ? `(${Object.keys(variables)
          .map((v) => `${v}: $${v}`)
          .join(", ")})`
      : ""
  } { ${fields} }`;

  let query: string = `${queryName} ${queryParams} {
      ${queryFn}
  }`;

  return query;
};

const fetchData = async <T>(query: string, variables?: Record<string, T>) => {
  const response = await fetch(baseUrl as string, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return response;
};

export const login = async <T>({
  fields,
  parameters,
  variables,
}: Partial<GqlQueryArgs<T>>) => {
  const query = buildGqlQuery({
    isQuery: true,
    fields,
    name: "Login",
    functionName: "login",
    parameters,
    variables,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return await res.json();
};

export const signup = async <T>({
  fields,
  parameters,
  variables,
}: Partial<GqlQueryArgs<T>>) => {
  const query = buildGqlQuery({
    isQuery: false,
    fields,
    name: "Signup",
    functionName: "signup",
    parameters,
    variables,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return await res.json();
};

export const createPlayScore = async <T>({
  fields,
  parameters,
  variables,
}: Partial<GqlQueryArgs<T>>) => {
  const query = buildGqlQuery({
    isQuery: false,
    fields,
    name: "CreatePlayScore",
    functionName: "createPlayScore",
    parameters,
    variables,
  });

  const res = await fetchData(query, variables);

  return await res.json();
};

export const getPlayScoresForGame = async <T>({
  fields,
  parameters,
  variables,
}: Partial<GqlQueryArgs<T>>) => {
  const query = buildGqlQuery({
    isQuery: true,
    fields,
    name: "PlayscoresForGame",
    functionName: "playScoresByGameId",
    parameters,
    variables,
  });

  const res = await fetchData(query, variables);

  return await res.json();
};

export const getUser = async <T>({
  fields,
  parameters,
  variables,
}: Partial<GqlQueryArgs<T>>) => {
  const query = buildGqlQuery({
    isQuery: true,
    fields,
    name: "User",
    functionName: "user",
    parameters,
    variables,
  });

  const res = await fetchData(query, variables);

  return await res.json();
};
