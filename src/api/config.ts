import pg from "pg";
import yesql from "yesql";

class Database {
    private readonly _pool: pg.Pool;
    private readonly _promise: Promise<void>;

    private static async initialize(pool: pg.Pool): Promise<void> {
        // language=SQL format=false
        await pool.query(`
            CREATE TABLE IF NOT EXISTS SetorEscola (
                Id INTEGER NOT NULL,
                Nome VARCHAR(30) UNIQUE NOT NULL,
                PRIMARY KEY (Id)
            );
            INSERT INTO SetorEscola (Id, Nome) VALUES
                (1, 'Pública'),
                (2, 'Privada');

            CREATE TABLE IF NOT EXISTS SiglaEscola (
                Id INTEGER NOT NULL,
                IdSetor INTEGER NOT NULL,
                Nome VARCHAR(30) UNIQUE NOT NULL,
                PRIMARY KEY (Id),
                FOREIGN KEY (IdSetor) REFERENCES SetorEscola (Id)
            );
            INSERT INTO SiglaEscola (Id, IdSetor, Nome) VALUES
                (1, 1, 'EMEIF'),
                (2, 1, 'EMEF'),
                (3, 1, 'EMEI'),
                (4, 1, 'UEI'),
                (5, 2, 'OSC'),
                (6, 2, 'Comunitária'),
                (7, 2, 'Confessional'),
                (8, 2, 'Privada');

            CREATE TABLE IF NOT EXISTS EtapaEnsino (
                Id INTEGER NOT NULL,
                Nome VARCHAR(30) UNIQUE NOT NULL,
                PRIMARY KEY (Id)
            );
            INSERT INTO EtapaEnsino (Id, Nome) VALUES
                (1, 'Educação infantil'),
                (2, 'Educação fundamental'),
                (3, 'Educação fundamental (EJA)');

            CREATE TABLE IF NOT EXISTS ModalidadeEnsino (
                Id INTEGER NOT NULL,
                IdEtapa INTEGER NOT NULL,
                Nome VARCHAR(30) NOT NULL,
                PRIMARY KEY (Id),
                FOREIGN KEY (IdEtapa) REFERENCES EtapaEnsino (Id)
            );
            INSERT INTO ModalidadeEnsino (Id, IdEtapa, Nome) VALUES
                (1, 1, 'Creche'),
                (2, 1, 'Pré-escola'),
                (3, 2, 'CF I (1º, 2º e 3º ano)'),
                (4, 2, 'CF II (4º e 5º ano)'),
                (5, 2, 'CF III (6º e 7º ano)'),
                (6, 2, 'CF IV (8º e 9º ano)'),
                (7, 3, 'CF I (1º, 2º e 3º ano)'),
                (8, 3, 'CF II (4º e 5º ano)'),
                (9, 3, 'CF III (6º e 7º ano)'),
                (10, 3, 'CF IV (8º e 9º ano)');
                  
            CREATE TABLE IF NOT EXISTS DocumentoCadastro (
                Id INTEGER NOT NULL,
                Nome VARCHAR(255) NOT NULL,
                PRIMARY KEY (Id)
            );
            INSERT INTO DocumentoCadastro (Id, Nome) VALUES
                (1, 'Requerimento'),
                (2, 'Regimento escolar'),
                (3, 'Projeto pedagógico'),
                (4, 'Quadro demonstrativo'),
                (5, 'Cronograma de implantação'),
                (6, 'Detalhamento de implantação e desenvolvimento'),
                (7, 'Declaração de equipamentos'),
                (8, 'Alvará de funcionamento'),
                (9, 'Laudo da vigilância sanitária'),
                (10, 'Laudo do corpo de bombeiros'),
                (11, 'Projeto com promoção e acessibilidade'),
                (12, 'Relatório detalhado das condições de oferta dos cursos'),
                (13, 'Comprovante de entrega de censo'),
                (14, 'Escolas anexas no processo da escola matriz'),
                (15, 'Relação dos alunos'),
                (16, 'Plano de cursos'),
                (17, 'Termo de convênio para prática profissional'),
                (18, 'Requerimento dirigido à presidência do CME'),
                (19, 'Comprovante dos atos constitutivos'),
                (20, 'Comprovante de inscrição'),
                (21, 'Comprovante de inscrição no cadastro de contribuição municipal'),
                (22, 'Certidões de regularidades fiscais'),
                (23, 'Certidões de regularidades FGTS'),
                (24, 'Demonstração de patrimônio'),
                (25, 'Biblioteca'),
                (26, 'Acessibilidade'),
                (27, 'Laboratório de informática'),
                (28, 'Sala de recursos multifuncionais'),
                (29, 'Área esportiva'),
                (30, 'Brinquedoteca');

            CREATE TABLE IF NOT EXISTS Escola (
                Id SERIAL NOT NULL,
                Nome VARCHAR(255) NOT NULL,
                DataCriacao DATE NOT NULL,
                CodigoINEP CHAR(8) NOT NULL, -- XXXXXXXX
                CNPJ CHAR(18) NOT NULL, -- XX.XXX.XXX/XXXX-XX
                CNPJConselho CHAR(18) NOT NULL, -- XX.XXX.XXX/XXXX-XX
                VigenciaConselho INTEGER NOT NULL,
                NomeEntidadeMantenedora VARCHAR(255) NOT NULL,
                Email VARCHAR(255) NOT NULL,
                Telefone CHAR(15) NOT NULL, -- (XX) XXXXX-XXXX 
                IdSigla INTEGER NOT NULL,
                PRIMARY KEY (Id),
                FOREIGN KEY (IdSigla) REFERENCES SiglaEscola (Id)
            );
            CREATE TABLE IF NOT EXISTS EnderecoEscola (
                IdEscola INTEGER NOT NULL,
                Distrito CHAR(5) NOT NULL,
                Endereco VARCHAR(255) NOT NULL,
                Cidade VARCHAR(255) NOT NULL,
                UF CHAR(2) NOT NULL,
                Bairro VARCHAR (255) NOT NULL,
                CEP CHAR(10) NOT NULL, -- XXX.XX-XXX
                PRIMARY KEY (IdEscola),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
            );
            CREATE TABLE IF NOT EXISTS ServidorEscola (
                Id SERIAL NOT NULL,
                IdEscola INTEGER NOT NULL,
                Tipo VARCHAR(255) NOT NULL,
                Nome VARCHAR(255) NOT NULL,
                Email VARCHAR(255) NOT NULL,
                Telefone CHAR(15) NOT NULL, -- (XX) XXXXX-XXXX
                PRIMARY KEY (Id),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
            );
            CREATE TABLE IF NOT EXISTS ProcessoEscola (
                Id SERIAL NOT NULL,
                IdEscola INTEGER NOT NULL,
                Nome VARCHAR(255) NOT NULL,
                Resolucao VARCHAR(255) NOT NULL,
                DataInicioVigencia DATE NOT NULL,
                TempoVigencia INTEGER NOT NULL, -- Em anos
                PRIMARY KEY (Id),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
            );
            CREATE TABLE IF NOT EXISTS TriagemEscola (
                IdEscola INTEGER NOT NULL,
                DataInsercao DATE NOT NULL,
                PRIMARY KEY (IdEscola),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
            );
            CREATE TABLE IF NOT EXISTS ConvenioSEMEC (
                Id INTEGER NOT NULL,
                IdEscola INTEGER NOT NULL,
                Objeto VARCHAR(255) NOT NULL,
                Vigencia DATE NOT NULL,
                PRIMARY KEY (Id),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
            );
            CREATE TABLE IF NOT EXISTS ModalidadeEscola (
                IdEscola INTEGER NOT NULL,
                IdModalidade INTEGER NOT NULL,
                PRIMARY KEY (IdEscola),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id),
                FOREIGN KEY (IdModalidade) REFERENCES ModalidadeEnsino (Id)
            );
            CREATE TABLE IF NOT EXISTS Filial (
                Id SERIAL NOT NULL,
                IdEscola INTEGER NOT NULL,
                Nome VARCHAR(255) NOT NULL,
                DataCriacao DATE NOT NULL,
                CodigoINEP CHAR(8) NOT NULL, -- XXXXXXXX
                Email VARCHAR(255) NOT NULL,
                Telefone CHAR(15) NOT NULL, -- (XX) XXXXX-XXXX 
                IdSigla INTEGER NOT NULL,
                PRIMARY KEY (Id),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id),
                FOREIGN KEY (IdSigla) REFERENCES SiglaEscola (Id)
            );
            CREATE TABLE IF NOT EXISTS DocumentoEnviado (
                Id SERIAL NOT NULL,
                IdDocumento INTEGER NOT NULL,
                IdEscola INTEGER NOT NULL,
                Localizacao VARCHAR(255),
                PRIMARY KEY (Id),
                FOREIGN KEY (IdDocumento) REFERENCES DocumentoCadastro (Id),
                FOREIGN KEY (IdEscola) REFERENCES Escola (Id)
            );
        `);
    }

    private async pool(): Promise<pg.Pool> {
        await this._promise;
        return this._pool;
    }

    constructor() {
        this._pool = new pg.Pool({connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres"});
        this._promise = Database.initialize(this._pool);
    }

    async named<R extends pg.QueryResultRow = any>(
        queryTextOrConfig: string,
        values: Record<string, any>,
    ): Promise<pg.QueryResult<R>> {
        const pool = await this.pool();
        return pool.query(yesql.pg(queryTextOrConfig)(values));
    }

    async positional<R extends pg.QueryResultRow = any, I extends any[] = any[]>(
        queryTextOrConfig: string | pg.QueryConfig<I>,
        values?: I,
    ): Promise<pg.QueryResult<R>> {
        const pool = await this.pool();
        return pool.query(queryTextOrConfig, values);
    }


}

const db = new Database();
export default db;