import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    password: 'clave123',
    host: 'localhost',
    port: 5432,
    database: 'parcial1sw1'
});
