if (!process.env.PORT) {
  throw new Error("PORT is not defined in enviornment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined in enviornment variables");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in enviornment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in enviornment variables");
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

if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error("FIRECRAWL_API_KEY is not defined in environment variables");
}

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
