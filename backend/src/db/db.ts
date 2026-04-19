import { connectRedis } from "./redis";
import prisma from "./singleton";

export async function startDBserver() {
  try {
    await prisma.$connect();
    console.log("Connected to DB");

    await connectRedis();
  } catch (error) {
    console.error("Startup failed", error);
    process.exit(1);
  }
}
