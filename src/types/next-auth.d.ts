import type { DefaultSession } from "next-auth";

/**
 * Extends NextAuth's default Session type to include user id.
 * This makes session.user.id accessible throughout the app with full type safety.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
