import pg from "pg";

async function initialize(pool: pg.Pool) {
    await pool.query(`CREATE TABLE IF NOT EXISTS Escola (
      Id SERIAL NOT NULL,
      Nome VARCHAR(255) NOT NULL,
      ProcessoAtual VARCHAR(255),
      Resolucao VARCHAR(30) NOT NULL,
      TempoVigencia INTEGER NOT NULL,
      DataInicioVigencia DATE NOT NULL,
      PRIMARY KEY (Id)
    );`);
    await pool.query(`CREATE TABLE IF NOT EXISTS TriagemEscola (
      Id SERIAL NOT NULL,
      IdEscola INTEGER NOT NULL,
      DataInsercao DATE NOT NULL,
      PRIMARY KEY (Id),
      FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
    );`);
}


const pool = new pg.Pool({connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres"});
initialize(pool).then((_) => console.log("backend: Tabelas inicializadas"));

pool.on('connect', () => {
    console.log('backend: Conexão feita ao banco');
});

export const db = {
    pool: pool,
};
