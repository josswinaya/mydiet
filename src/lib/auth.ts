import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * NextAuth v5 configuration with Credentials provider.
 * Uses bcryptjs for password comparison — no plaintext passwords stored.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
            },
          });

          if (!user) return null;

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValidPassword) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[Auth] authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * Attaches user id to the JWT token so it's accessible in session.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /**
     * Exposes user id on the session object for use in server components/actions.
     */
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
