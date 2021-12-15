import pg from "pg";

async function initialize(pool: pg.Pool) {
    await pool.query(`CREATE TABLE IF NOT EXISTS Escola (
        Id SERIAL NOT NULL,
        Nome VARCHAR(255) NOT NULL,
        Sigla VARCHAR(255) NOT NULL,
        CNPJ VARCHAR(18) NOT NULL,
        DataCriacao DATE NOT NULL,
        CodigoINEP VARCHAR(8) NOT NULL,
        NomeEntidadeMantenedora VARCHAR(255) NOT NULL,
        CNPJConselho VARCHAR(18) NOT NULL,
        VigenciaConselho VARCHAR(255) NOT NULL,
        PRIMARY KEY (Id)
    );`);
    await pool.query(`CREATE TABLE IF NOT EXISTS ProcessoEscola(
        Id SERIAL NOT NULL,
        IdEscola INTEGER NOT NULL,
        Nome VARCHAR(255) NOT NULL,
        Resolucao VARCHAR(255) NOT NULL,
        TempoVigencia INTEGER NOT NULL,
        DataInicioVigencia DATE NOT NULL,
        PRIMARY KEY (Id),
        FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
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
