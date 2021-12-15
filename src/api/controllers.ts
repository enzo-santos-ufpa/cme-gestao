import {db} from "./config";
import express from "express";
import {EscolaAutorizada, EscolaBase} from "../models/Escola";
import {ModeloBD, Processo} from "../models/tipos";
import {logger} from "../lib/utils";

export namespace index {
    export function info(req: express.Request, res: express.Response) {
        res.status(200).send({success: "true", message: "Gestão CME", version: "1.0.0"});
    }
}

function assertNever(shouldBeNever: never): never {
    throw new Error("Was not never: " + shouldBeNever);
}

export namespace escolas {
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

    export async function pendentes(req: express.Request, res: express.Response) {
        const consulta = await db.pool.query(`SELECT * FROM Escola A
            RIGHT JOIN TriagemEscola B
            ON A.Id = B.IdEscola`);

        res.status(200).send(consulta.rows.map(row => {
            return {
                dataInicioVigencia: row["datainiciovigencia"],
                id: row["idescola"],
                nome: row["nome"],
                processoAtual: row["processoatual"],
                resolucao: row["resolucao"],
                tempoVigencia: row["tempovigencia"],
                dataInsercao: row["datainsercao"]
            };
        }));
    }

    export async function autorizadas(req: express.Request, res: express.Response) {
        const consulta = await db.pool.query(`SELECT * FROM Escola A 
            LEFT JOIN TriagemEscola B 
            ON A.Id = B.IdEscola 
            WHERE B.IdEscola IS NULL`);
        res.status(200).send(consulta.rows.map(row => {
            const escola: ModeloBD<EscolaAutorizada> = {
                id: row["id"],
                nome: row["nome"],
                sigla: row["sigla"],
                cnpj: row["cnpj"],
                nomeEntidadeMantenedora: row["nomeentidademantenedora"],
                vigenciaConselho: row["vigenciaconselho"],
                cnpjConselho: row["cnpjConselho"],
                codigoInep: row["codigoinep"],
                dataCriacao: row["datacriacao"],
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
        res.status(201).send({message: "Escola respondida com sucesso!", body: {escola: req.body}});
    }

    export async function atualizar(req: express.Request, res: express.Response) {
        const idEscola = parseInt(req.params.id);
        console.log(`backend/escolas: Atualizando escola de ID ${idEscola}`)

        const {nome} = req.body;

        await db.pool.query("UPDATE escola SET Nome = $1 WHERE Id = $2", [nome, idEscola]);
        res.status(200).send({message: "Escola atualizada com sucesso!"});
    }
}
