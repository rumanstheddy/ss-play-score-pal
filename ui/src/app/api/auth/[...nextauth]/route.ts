import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { login } from "@/providers/PlayScore/PlayScoreProvider";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const { email, password } = credentials as Record<
          "email" | "password",
          string
        >;

        // const res = await fetch("http://localhost:4000", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     query:
        //       "query loginQuery ($email: String!, $password: String!) { login(email : $email, password : $password) { _id firstName lastName } }",
        //     variables: {
        //       email: email,
        //       password: password,
        //     },
        //   }),
        //   headers: { "Content-Type": "application/json" },
        // });

        const data = await login({
          fields: "_id firstName lastName",
          parameters: { $email: "String!", $password: "String!" },
          variables: { email: email, password: password },
        });

        // If no error and we have user data, return it
        if (!data.errors && data.data) {
          return data.data;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],

  // TODO: Check decryption operation failed error message

  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
