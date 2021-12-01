import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {Pool} = pg;
const pool = new Pool({connectionString: process.env.DATABASE_URL});
pool.query(
    "CREATE TABLE IF NOT EXISTS escola (" +
    "   Id SERIAL PRIMARY KEY," +
    "   Nome VARCHAR(255) NOT NULL," +
    "   ProcessoAtual VARCHAR(30) NOT NULL," +
    "   Resolucao VARCHAR(30) NOT NULL," +
    "   TempoVigencia INTEGER NOT NULL," +
    "   DataInicioVigencia DATE NOT NULL" +
    ");"
);

pool.on('connect', () => {
    console.log('backend: Conexão feita ao banco');
});

export const db = {
    pool: pool,
};
