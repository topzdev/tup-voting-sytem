import NextAuth from "next-auth";
import { CredentialsProvider } from "next-auth/providers";

const providers = [
  CredentialsProvider({
    name,
  }),
];

export default NextAuth({});
