import { createClient } from "redis";
import { config } from "../config/config";

const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis() {
  await redisClient.connect();
  try {
    await redisClient.sendCommand([
      "CONFIG",
      "SET",
      "maxmemory-policy",
      "noeviction",
    ]);
  } catch {
    console.warn(
      "Could not set Redis eviction policy — set maxmemory-policy=noeviction in your Redis dashboard",
    );
  }
  console.log("Redis connected");
}

export default redisClient;
