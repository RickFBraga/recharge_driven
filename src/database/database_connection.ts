import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

db.connect()
    .then(() => {
        console.log('Conectado ao banco de dados com sucesso!');
    })
    .catch((err: unknown) => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

export default db;
