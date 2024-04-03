import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { env } from "~/env";
import { db } from "~/server/db";
import { SignJWT, importJWK } from "jose";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

const generateJWT = async (payload: any) => {
  const secret = env.NEXTAUTH_SECRET || "secret";

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(jwk);

  return jwt;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.uid = user.id;
        token.jwtToken = user.token;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.jwtToken = token.jwtToken;
      }

      return session;
    },
  },
  // adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
          select: {
            email: true,
            password: true,
            id: true,
          },
        });
        if (!user) return null;
        const passwordCorrect = await compare(
          credentials?.password || "",
          user.password,
        );

        if (passwordCorrect) {
          const jwt = await generateJWT({
            id: user.id,
          });
          await db.user.update({
            where: {
              id: user.id,
            },
            data: {
              token: jwt,
            },
          });
          return {
            id: user.id,
            email: user.email,
            token: jwt,
          };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
