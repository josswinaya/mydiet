import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma Client instance (Prisma v5).
 * Prevents creating multiple connections during Next.js hot-reloads in development.
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
