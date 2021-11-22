import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import adminAuthApi from "../../../src/apis/admin/auth.api";

export default async function auth(req, res) {
  const providers = [
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

        if (response.data.user) {
          return response.data.user;
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

  return await NextAuth(req, res, {
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day cache
    },
  });
}
