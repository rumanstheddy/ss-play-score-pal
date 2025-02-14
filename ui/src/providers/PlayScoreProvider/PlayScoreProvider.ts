type GqlQueryArgs<T> = {
  isQuery: boolean;
  name: string;
  fields: string | undefined;
  parameters?: Record<string, string>;
  variables?: Record<string, T>;
};

export const buildGqlQuery = <T>({
  isQuery = true,
  name,
  fields,
  parameters,
  variables,
}: GqlQueryArgs<T>) => {
  let query: string = `${isQuery ? `query` : `mutation`} ${name}${
    isQuery ? `Query` : `Mutation`
  } ${
    parameters
      ? `(${Object.keys(parameters)
          .map((key) => `${key}: ${parameters[key]}`)
          .join(", ")})`
      : ""
  } {
      ${name.toLowerCase()} ${
    variables
      ? `(${Object.keys(variables)
          .map((v) => `${v}: $${v}`)
          .join(", ")})`
      : ""
  } { ${fields} }
  }`;

  return query;
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
