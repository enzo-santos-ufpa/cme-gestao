import {db} from "./config";
import express from "express";
import {
    encoding,
    EscolaAutorizada,
    EscolaBase,
    EscolaPendente,
    Processo,
    Servidor
} from "../models/Escola";
import {FlatEncoded, ModeloBD} from "../models/tipos";

type ErroConsulta = { error: string };

export function possuiErro(data: any): data is ErroConsulta {
    return "error" in data;
}

export namespace index {
    export function info(req: express.Request, res: express.Response) {
        res.status(200).send({success: "true", message: "Gestão CME", version: "1.0.0"});
    }
}

export namespace escolas {
    async function parseEscolaBase(row: any): Promise<ModeloBD<EscolaBase>> {
        const id = row.id;
        const consultaServidores = await db.pool.query(
            `SELECT * FROM ServidorEscola WHERE IdEscola = $1`,
            [id],
        );
        const mapeamentoServidores = new Map<string, any>();
        consultaServidores.rows.forEach(row => mapeamentoServidores.set(row["tipo"], row));
        const dadosServidores = {
            diretor: mapeamentoServidores.get("Diretor"),
            secretario: mapeamentoServidores.get("Secretario"),
            coordenador: mapeamentoServidores.get("Coordenador"),
        };

        return {
            id: id,
            nome: row.nome,
            email: row.email,
            telefone: row.telefone,
            endereco: row.endereco,
            cep: row.cep,
            uf: row.uf,
            cidade: row.cidade,
            bairro: row.bairro,
            cnpj: row.cnpj,
            distrito: row.distrito,
            sigla: row.sigla,
            vigenciaConselho: row.vigenciaconselho,
            cnpjConselho: row.cnpjconselho,
            nomeEntidadeMantenedora: row.nomeentidademantenedora,
            codigoInep: row.codigoinep,
            dataCriacao: new Date(row.datacriacao),
            tipo: {
                setor: row["tiposetor"],
                sigla: row["tiposigla"],
            },
            servidores: {
                diretor: ((dadosServidor: any) => {
                    return {
                        nome: dadosServidor["nome"],
                        email: dadosServidor["email"],
                        telefone: dadosServidor["telefone"],
                    };
                })(dadosServidores.diretor),
                secretario: ((dadosServidor: any) => {
                    return {
                        nome: dadosServidor["nome"],
                        email: dadosServidor["email"],
                        telefone: dadosServidor["telefone"],
                    };
                })(dadosServidores.secretario),
                coordenador: ((dadosServidor: any) => {
                    return {
                        nome: dadosServidor["nome"],
                        email: dadosServidor["email"],
                        telefone: dadosServidor["telefone"],
                    };
                })(dadosServidores.coordenador),
            }
        };
    }

    async function parseEscolaPendente(row: any): Promise<ModeloBD<EscolaPendente>> {
        return {
            ...(await parseEscolaBase(row)),
            cadastro: {
                dataInsercao: row["datainsercao"],
            }
        };
    }

    async function parseEscolaAutorizada(row: any): Promise<ModeloBD<EscolaAutorizada>> {
        return {
            ...(await parseEscolaBase(row)),
            processoAtual: new Processo({
                nome: "",
                inicio: new Date(0),
                duracao: NaN,
                resolucao: "",
            }),
        };
    }

    export async function criar(req: express.Request, res: express.Response) {
        async function insereServidor(id: number, tipo: "Diretor" | "Secretario" | "Coordenador", servidor: Servidor) {
            await db.pool.query(`INSERT INTO
                ServidorEscola (IdEscola, Tipo, Nome, Email, Telefone)
                VALUES         (      $1,   $2,   $3,    $4,       $5)`,
                [id, tipo, servidor.nome, servidor.email, servidor.telefone],
            );
        }

        try {
            const data = req.body as FlatEncoded<EscolaBase>;

            const {
                nome,
                sigla,
                dataCriacao,
                codigoInep,
                cnpj,
                cnpjConselho,
                vigenciaConselho,
                nomeEntidadeMantenedora,
                email,
                telefone,
                tipo,
                ...a0
            } = encoding.escolaBase().decode(data);

            const consulta = await db.pool.query(`INSERT INTO 
                Escola (Nome, Sigla, DataCriacao, CodigoINEP, CNPJ, CNPJConselho, VigenciaConselho, NomeEntidadeMantenedora, Email, Telefone, TipoSetor, TipoSigla)
                VALUES (  $1,    $2,          $3,         $4,   $5,           $6,               $7,                      $8,    $9,      $10,       $11,       $12)
                RETURNING Id`,
                [nome, sigla, dataCriacao, codigoInep, cnpj, cnpjConselho, vigenciaConselho, nomeEntidadeMantenedora, email, telefone, tipo.setor, tipo.sigla]
            );

            const {id} = consulta.rows.pop();

            await db.pool.query(`INSERT INTO 
                TriagemEscola (IdEscola, DataInsercao)
                VALUES        (      $1,           $2)`,
                [id, new Date()],
            );

            const {distrito, endereco, cidade, uf, bairro, cep, ...a1} = a0;
            await db.pool.query(`INSERT INTO
                EnderecoEscola (IdEscola, Distrito, Endereco, Cidade, UF, Bairro, CEP)
                VALUES         (      $1,       $2,       $3,     $4, $5,     $6,  $7)`,
                [id, distrito, endereco, cidade, uf, bairro, cep],
            );

            const {servidores, ...a2} = a1;

            const {convenioSemec, ...a3} = a2;
            if (convenioSemec != null) {
                await db.pool.query(`INSERT INTO
                    ConvenioSEMEC (NumeroConvenio, IdEscola, Objeto, Vigencia)
                    VALUES        (            $1,       $2,     $3,       $4)`,
                    [convenioSemec.numConvenio, id, convenioSemec.objeto, convenioSemec.vigencia]);
            }

        } catch (e) {
            return res.status(401).send({error: e + ""});
        }
        return res.status(201).send({message: "Escola adicionada com sucesso!", body: {escola: req.body}});
    }

    export async function consultar(req: express.Request, res: express.Response) {
        const consulta = await db.pool.query(`SELECT * FROM Escola 
            JOIN EnderecoEscola ON Escola.Id = EnderecoEscola.IdEscola
            LEFT JOIN ConvenioSEMEC ON Escola.Id = ConvenioSEMEC.IdEscola
            WHERE Escola.Id = $1`, [req.query.id]);

        const rows = consulta.rows;
        switch (rows.length) {
            case 0: {
                return res.status(404).send({error: "Escola com o ID fornecido não existe"});
            }
            case 1: {
                const row = rows.pop();
                const encoder = encoding.modeloDB(encoding.escolaBase());
                const escola = await parseEscolaPendente(row);
                return res.status(200).send(encoder.encode(escola));
            }
            default: {
                return res.status(404).send({error: "Mais de uma escola com o ID fornecido existe"});
            }
        }
    }

    export async function pendentes(req: express.Request, res: express.Response) {
        const encoder = encoding.lista(encoding.modeloDB(encoding.escolaPendente()));
        const data: ModeloBD<EscolaPendente>[] = [];

        try {
            const consulta = await db.pool.query(`SELECT * FROM Escola
                JOIN EnderecoEscola ON Escola.Id = EnderecoEscola.IdEscola
                LEFT JOIN ConvenioSEMEC ON Escola.Id = ConvenioSEMEC.IdEscola
                RIGHT JOIN TriagemEscola ON Escola.Id = TriagemEscola.IdEscola`);

            for (const row of consulta.rows) {
                data.push(await parseEscolaPendente(row));
            }
        } catch (e) {
            return res.status(401).send({error: e + ""});
        }

        res.status(200).send(encoder.encode(data));
    }

    export async function autorizadas(req: express.Request, res: express.Response) {
        const encoder = encoding.lista(encoding.modeloDB(encoding.escolaAutorizada()));
        const data: ModeloBD<EscolaAutorizada>[] = [];
        try {
            const consulta = await db.pool.query(`
                SELECT 
                    *,
                    Escola.Id as EscolaId
                FROM Escola
                JOIN EnderecoEscola ON Escola.Id = EnderecoEscola.IdEscola
                LEFT JOIN ConvenioSEMEC ON Escola.Id = ConvenioSEMEC.IdEscola
                LEFT JOIN TriagemEscola ON Escola.Id = TriagemEscola.IdEscola
                WHERE TriagemEscola.Id IS NULL;
                `);

            for (const row of consulta.rows) {
                data.push(await parseEscolaAutorizada({...row, id: row["escolaid"]}));
            }
        } catch (e) {
            console.error(e);
            return res.status(401).send({error: e + ""});
        }

        res.status(200).send(encoder.encode(data));
    }

    export async function responderTriagem(req: express.Request, res: express.Response) {
        try {
            const {id, resposta} = req.body;
            console.log(id);
            console.log(resposta);
            await db.pool.query("DELETE FROM TriagemEscola WHERE IdEscola = $1", [id]);
            if (resposta === "refuse") {
                await db.pool.query("DELETE FROM ServidorEscola WHERE IdEscola = $1", [id]);
                await db.pool.query("DELETE FROM EnderecoEscola WHERE IdEscola = $1", [id]);
                await db.pool.query("DELETE FROM Escola WHERE Id = $1", [id]);
            }
        } catch (e) {
            console.log(e);
            return res.status(401).send({error: e});
        }
        res.status(201).send({});
    }
}
