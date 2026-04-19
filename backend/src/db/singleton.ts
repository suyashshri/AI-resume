import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { config } from "../config/config";

const adapter = new PrismaPg({
  connectionString: config.DATABASE_URL,
});

const createPrismaClient = () => {
  return new PrismaClient({ adapter });
};

type PrismaClientType = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

export default prisma;

if (config.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
