// src/lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;
globalForPrisma.prisma = globalForPrisma.prisma || undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;