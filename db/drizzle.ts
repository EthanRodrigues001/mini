// import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// export const config = {
//   runtime: "nodejs", // Force the middleware to use Node.js runtime
// };

// config({ path: ".env.local" });

export const db = drizzle(process.env.DATABASE_URL!);
