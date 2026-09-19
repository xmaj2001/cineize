// Shared Prisma client and faker instance for all seed files
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "../../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

export const prisma = new PrismaClient({ adapter });
export { faker };
