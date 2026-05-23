import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let prisma;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  // Prevent multiple instances of Prisma Client in development due to hot reloading
  if (!global.globalPrisma) {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    global.globalPrisma = new PrismaClient({ adapter });
  }
  prisma = global.globalPrisma;
}

export default prisma;
