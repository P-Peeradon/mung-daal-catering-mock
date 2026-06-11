import { defineConfig } from "nitro"

export default defineConfig({
  serverDir: './server',
  runtimeConfig: {
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
  }
});
