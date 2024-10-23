import prisma from "@/lib/db";
// import { compare } from "bcryptjs";
// import bcrypt again when we have implemented hashing of passwords
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // if (!user || !(await compare(credentials.password, user.password))) {
        // Replace the line below with the one above when we have added password hashing
        if (!user || password !== user.password) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, session }) => {
      console.log("JWT Callback", { token, user, session });
      // Pass user id into token
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    session: ({ session, token, user }) => {
      console.log("Session Callback", { session, token, user });
      // Pass user id to the session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
};

export const getAuth = () => getServerSession(authOptions);
