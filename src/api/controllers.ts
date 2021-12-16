import {db} from "./config";
import express from "express";
import {EscolaAutorizada, EscolaBase, EscolaPendente} from "../models/Escola";
import {DistritoAdministrativo, ModeloBD, Processo} from "../models/tipos";

export namespace index {
    export function info(req: express.Request, res: express.Response) {
        res.status(200).send({success: "true", message: "Gestão CME", version: "1.0.0"});
    }
}

function assertNever(shouldBeNever: never): never {
    throw new Error("Was not never: " + shouldBeNever);
}

export namespace escolas {
    function dbToModel(row: { [key: string]: any }): ModeloBD<EscolaBase> {
        return {
            id: row["id"],
            nome: row["nome"],
            sigla: row["sigla"],
            cnpj: row["cnpj"],
            nomeEntidadeMantenedora: row["nomeentidademantenedora"],
            vigenciaConselho: row["vigenciaconselho"],
            cnpjConselho: row["cnpjconselho"],
            codigoInep: row["codigoinep"],
            dataCriacao: new Date(row["datacriacao"]),
            email: row["email"],
            distrito: DistritoAdministrativo[row["distrito"] as keyof typeof DistritoAdministrativo],
            telefone: row["telefone"],
            endereco: row["endereco"],
            cep: row["cep"],
            bairro: row["bairro"],
            cidade: row["cidade"],
            uf: row["uf"],
            servidores: row["servidores"], // TODO fi
        };
    }

    export async function criar(req: express.Request, res: express.Response) {
        const escola = req.body as EscolaBase;
        const tuples: ([string, string, any])[] = Object.entries(escola)
            .map(([key, value], i) => {
                const nomeAtributo = key as keyof EscolaBase;
                const nomeColuna: string = (() => {
                    switch (nomeAtributo) {
                        case "nome":
                            return "Nome";
                        case "sigla":
                            return "Sigla";
                        case "cnpj":
                            return "CNPJ";
                        case "dataCriacao":
                            return "DataCriacao";
                        case "codigoInep":
                            return "CodigoInep";
                        case "nomeEntidadeMantenedora":
                            return "NomeEntidadeMantenedora";
                        case "cnpjConselho":
                            return "CNPJConselho";
                        case "vigenciaConselho":
                            return "VigenciaConselho";
                        case "bairro":
                            return "Bairro";
                        case "cep":
                            return "CEP";
                        case "cidade":
                            return "Cidade";
                        case "distrito":
                            return "Distrito";
                        case "email":
                            return "Email";
                        case "endereco":
                            return "Endereco";
                        case "telefone":
                            return "Telefone";
                        case "uf":
                            return "UF";
                        case "servidores":
                            return "Servidores";
                        default:
                            return assertNever(nomeAtributo);
                    }
                })();
                return [nomeColuna, `$${i + 1}`, value];
            });

        const consulta = await db.pool.query(`INSERT INTO 
            Escola (${tuples.map(tuple => tuple[0]).join(", ")}) 
            VALUES (${tuples.map(tuple => tuple[1]).join(", ")}) 
            RETURNING Id`,
            tuples.map(tuple => tuple[2]),
        );

        for (const row of consulta.rows) {
            const idEscola = row["id"];
            await db.pool.query(`INSERT INTO 
                TriagemEscola (IdEscola, DataInsercao)
                VALUES ($1, $2)`,
                [idEscola, new Date()],
            );
        }

        res.status(201).send({message: "Escola adicionada com sucesso!", body: {escola: req.body}});
    }

    export async function ler(req: express.Request, res: express.Response) {
        const consulta = await db.pool.query(`SELECT * FROM Escola WHERE Id = $1`, [req.query.id]);

        const rows = consulta.rows;
        switch (rows.length) {
            case 0: {
                return res.status(404).send({});
            }
            case 1: {
                const row = rows.pop();
                return res.status(200).send(dbToModel(row));
            }
            default: {
                return res.status(404).send({});
            }
        }
    }

    export async function pendentes(req: express.Request, res: express.Response) {
        const consulta = await db.pool.query(`SELECT * FROM Escola A
            RIGHT JOIN TriagemEscola B
            ON A.Id = B.IdEscola`);

        res.status(200).send(consulta.rows.map(row => {
            const escola: ModeloBD<EscolaPendente> = {
                ...dbToModel(row),
                cadastro: {
                    dataInsercao: new Date(row["datainsercao"]),
                },
            };
            return escola;
        }));
    }

    export async function autorizadas(req: express.Request, res: express.Response) {
        const consulta = await db.pool.query(`SELECT * FROM Escola A 
            LEFT JOIN TriagemEscola B 
            ON A.Id = B.IdEscola 
            WHERE B.IdEscola IS NULL`);
        res.status(200).send(consulta.rows.map(row => {
            const escola: ModeloBD<EscolaAutorizada> = {
                ...dbToModel(row),
                processoAtual: new Processo({
                    nome: "ABC",
                    resolucao: "DEF",
                    duracao: 1,
                    inicio: new Date(2021),
                }),
            };
            return escola;
        }));
    }

    export async function responderTriagem(req: express.Request, res: express.Response) {
        const {idEscola, resposta} = req.body;
        await db.pool.query("DELETE FROM TriagemEscola WHERE IdEscola = $1", [idEscola]);
        if (resposta === "refuse") {
            await db.pool.query("DELETE FROM Escola WHERE Id = $1", [idEscola]);
        }
        res.status(201).send({});
    }

    export async function atualizar(req: express.Request, res: express.Response) {
        const idEscola = parseInt(req.params.id);
        console.log(`backend/escolas: Atualizando escola de ID ${idEscola}`)

        const {nome} = req.body;

        await db.pool.query("UPDATE escola SET Nome = $1 WHERE Id = $2", [nome, idEscola]);
        res.status(200).send({});
    }
}
