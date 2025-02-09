// import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// export const config = {
//   runtime: "nodejs", // Force the middleware to use Node.js runtime
// };

// config({ path: ".env.local" });
const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(databaseUrl);
