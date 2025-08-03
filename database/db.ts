export const poolConfig = {
  user: process.env.DB_SUPER_ADMIN,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_SUPER_ADMIN_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false, // disables certificate verification (okay for dev)
  },
};
