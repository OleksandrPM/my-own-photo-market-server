import { Pool } from "pg";

const poolConfig = {
  user: process.env.DB_SUPER_ADMIN,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_SUPER_ADMIN_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: 20, // limit connections
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 5000, // fail fast if DB is unreachable
  ssl: false,
};

export const pool = new Pool(poolConfig);
