if (!process.env.PORT) {
  throw new Error("PORT is not defined in enviornment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined in enviornment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("DATABASE_URL is not defined in enviornment variables");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in enviornment variables");
}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in enviornment variables");
}

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined in enviornment variables");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not defined in enviornment variables",
  );
}

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
