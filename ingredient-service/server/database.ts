import mysql from 'mysql2/promise';
import { useRuntimeConfig } from 'nitro/runtime-config';

const config = useRuntimeConfig();

const pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

export default pool;