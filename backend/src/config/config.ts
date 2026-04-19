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

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};
