import {db} from "./config";
import express from "express";
import {
    DistritoAdministrativo,
    encoding,
    EscolaBase,
    EscolaPendente,
    Servidor
} from "../models/Escola";
import {FlatEncoded, ModeloBD} from "../models/tipos";

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
            distrito: DistritoAdministrativo[row.distrito as keyof typeof DistritoAdministrativo],
            sigla: row.sigla,
            vigenciaConselho: row.vigenciaconselho,
            cnpjConselho: row.cnpjconselho,
            nomeEntidadeMantenedora: row.nomeentidademantenedora,
            codigoInep: row.codigoinep,
            dataCriacao: new Date(row.datacriacao),
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
                ...a0
            } = encoding.escolaBase().decode(data);

            const consulta = await db.pool.query(`INSERT INTO 
                Escola (Nome, Sigla, DataCriacao, CodigoINEP, CNPJ, CNPJConselho, VigenciaConselho, NomeEntidadeMantenedora, Email, Telefone)
                VALUES (  $1,    $2,          $3,         $4,   $5,           $6,               $7,                      $8,    $9,      $10)
                RETURNING Id`,
                [nome, sigla, dataCriacao, codigoInep, cnpj, cnpjConselho, vigenciaConselho, nomeEntidadeMantenedora, email, telefone]
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
                [id, DistritoAdministrativo[distrito], endereco, cidade, uf, bairro, cep],
            );

            const {servidores, ...a2} = a1;

            await insereServidor(id, "Diretor", servidores.diretor);
            await insereServidor(id, "Coordenador", servidores.coordenador);
            await insereServidor(id, "Secretario", servidores.secretario);

        } catch (e) {
            return res.status(401).send({error: e + ""});
        }
        return res.status(201).send({message: "Escola adicionada com sucesso!", body: {escola: req.body}});
    }

    // export async function ler(req: express.Request, res: express.Response) {
    //     const consulta = await db.pool.query(`SELECT * FROM Escola WHERE Id = $1`, [req.query.id]);
    //
    //     const rows = consulta.rows;
    //     switch (rows.length) {
    //         case 0: {
    //             return res.status(404).send({});
    //         }
    //         case 1: {
    //             const row = rows.pop();
    //             return res.status(200).send(dbToModel(row));
    //         }
    //         default: {
    //             return res.status(404).send({});
    //         }
    //     }
    // }
    //

    export async function pendentes(req: express.Request, res: express.Response) {
        const encoder = encoding.lista(encoding.modeloDB(encoding.escolaPendente()));
        const data: ModeloBD<EscolaPendente>[] = [];

        try {
            const consulta = await db.pool.query(`SELECT * FROM Escola
                JOIN EnderecoEscola ON Escola.Id = EnderecoEscola.IdEscola
                RIGHT JOIN TriagemEscola ON Escola.Id = TriagemEscola.IdEscola`);

            for (const row of consulta.rows) {
                data.push(await parseEscolaPendente(row));
            }
        } catch (e) {
            return res.status(401).send({error: e + ""});
        }

        res.status(200).send(encoder.encode(data));
    }

    //
    // export async function autorizadas(req: express.Request, res: express.Response) {
    //     const consulta = await db.pool.query(`SELECT * FROM Escola A
    //         LEFT JOIN TriagemEscola B
    //         ON A.Id = B.IdEscola
    //         WHERE B.IdEscola IS NULL`);
    //     res.status(200).send(consulta.rows.map(row => {
    //         const escola: ModeloBD<EscolaAutorizada> = {
    //             ...dbToModel(row),
    //             processoAtual: new Processo({
    //                 nome: "ABC",
    //                 resolucao: "DEF",
    //                 duracao: 1,
    //                 inicio: new Date(2021),
    //             }),
    //         };
    //         return escola;
    //     }));
    // }
    //
    // export async function responderTriagem(req: express.Request, res: express.Response) {
    //     const {idEscola, resposta} = req.body;
    //     await db.pool.query("DELETE FROM TriagemEscola WHERE IdEscola = $1", [idEscola]);
    //     if (resposta === "refuse") {
    //         await db.pool.query("DELETE FROM Escola WHERE Id = $1", [idEscola]);
    //     }
    //     res.status(201).send({});
    // }
    //
    // export async function atualizar(req: express.Request, res: express.Response) {
    //     const idEscola = parseInt(req.params.id);
    //     console.log(`backend/escolas: Atualizando escola de ID ${idEscola}`)
    //
    //     const {nome} = req.body;
    //
    //     await db.pool.query("UPDATE escola SET Nome = $1 WHERE Id = $2", [nome, idEscola]);
    //     res.status(200).send({});
    // }
}
