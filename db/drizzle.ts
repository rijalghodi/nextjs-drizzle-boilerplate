import { config } from "dotenv";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

config({ path: [".env", ".env.local"] });

export const db =
  process.env.NODE_ENV === "production"
    ? neonDrizzle(process.env.DATABASE_URL!, { schema })
    : pgDrizzle({ connection: process.env.DATABASE_URL!, schema });
