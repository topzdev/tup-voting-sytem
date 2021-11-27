import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import adminAuthApi, { AdminUser } from "../../../src/apis/admin/auth.api";

export default async function auth(req, res) {
  const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
      id: "admin-auth",
      name: "Credentials",
      authorize: async (credentials, req) => {
        if (!credentials) throw Error("Credentials must be provided");

        const response = await adminAuthApi.login(credentials);

        if (response.data.error) {
          throw response.data.error.mess;
        }

        console.log("Credential Login", response.data);

        if (response.data) {
          return response.data;
        } else {
          return null;
        }
      },
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password here",
        },
      },
    }),
  ];

  const callbacks: NextAuthOptions["callbacks"] = {
    jwt: ({ token, user }) => {
      if (user) {
        console.log("User", user);

        token = {
          accessToken: user.token,
          admin: user.user,
        };
      }

      return token;
    },

    session: async ({ session, token }) => {
      console.log("SESSION: ", token);

      session.token = token.accessToken;
      session.admin = token.admin as AdminUser;

      console.log("FINAL SESSION", session);

      return session;
    },
  };

  return await NextAuth(req, res, {
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    callbacks,
    session: {
      strategy: "jwt",
    },
  });
}
