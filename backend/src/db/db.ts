import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { config } from "../config/config";

const adapter = new PrismaPg({
  connectionString: config.DATABASE_URL,
});

const PrismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof PrismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();
console.log("Connected to DB");
export default prisma;

if (config.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
