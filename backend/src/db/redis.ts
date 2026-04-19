import { createClient } from "redis";
import { config } from "../config/config";

const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis() {
  await redisClient.connect();
  console.log("Redis connected");
}

export default redisClient;
