if (!process.env.PORT) {
  throw new Error("PORT is not defined in enviornment variables");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in enviornment variables");
}

export const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};
