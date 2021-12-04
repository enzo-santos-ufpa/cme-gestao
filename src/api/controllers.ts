import {db} from "./config";
import express from "express";
import {FiltroEscolasBD} from "../models/tipos";
import {logger} from "../lib/utils";

export namespace index {
    export function info(req: express.Request, res: express.Response) {
        res.status(200).send({success: "true", message: "Gestão CME", version: "1.0.0"});
    }
}

export namespace escolas {
    export async function create(req: express.Request, res: express.Response) {
        const log = logger.server.at("escolas#create").log;

        const {nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia} = req.body;
        log(`Criando escola ${nome}`);

        const consulta = await db.pool.query("INSERT INTO " +
            "Escola (Nome, ProcessoAtual, Resolucao, TempoVigencia, DataInicioVigencia) " +
            "VALUES ($1, $2, $3, $4, $5) " +
            "RETURNING Id",
            [nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia],
        );
        log(`Inserção em Escola: ${JSON.stringify(consulta)}`)

        for (const row of consulta.rows) {
            const idEscola = row["id"];
            const consulta = await db.pool.query("INSERT INTO " +
                "TriagemEscola (IdEscola, DataInsercao) " +
                "VALUES ($1, $2)",
                [idEscola, new Date()],
            );
            log(`Inserção em TriagemEscola: ${JSON.stringify(consulta)}`)
        }

        res.status(201).send({message: "Escola adicionada com sucesso!", body: {escola: req.body}});
    }

    export async function read(req: express.Request, res: express.Response) {
        const log = logger.server.at("escolas#read").log;

        const params = req.query as (FiltroEscolasBD | {});
        log(`Lendo escolas com filtro ${JSON.stringify(params)}`)

        const consultaTexto: string = (() => {
            if (!Object.keys(params).length) return "SELECT * FROM escola";
            const filtro = params as FiltroEscolasBD;
            switch (filtro.cadastro) {
                case "all":
                    return "SELECT * FROM Escola";
                case "only-authorized":
                    return "SELECT * FROM Escola A " +
                        "LEFT JOIN TriagemEscola B " +
                        "ON A.Id = B.IdEscola " +
                        "WHERE B.IdEscola IS NULL";
                case "only-pending":
                    return "SELECT * " +
                        "FROM Escola A " +
                        "RIGHT JOIN TriagemEscola B " +
                        "ON A.Id = B.IdEscola";
            }
        })();
        log(`Calcula consulta ${consultaTexto}`);

        const consulta = await db.pool.query(consultaTexto);
        log(`Consulta em Escola: ${consulta}`);

        res.status(200).send(consulta.rows.map(row => {
            return {
                dataInicioVigencia: row["datainiciovigencia"],
                id: row["id"],
                nome: row["nome"],
                processoAtual: row["processoatual"],
                resolucao: row["resolucao"],
                tempoVigencia: row["tempovigencia"],
            }
        }));
    }

    export async function answerSchool(req: express.Request, res: express.Response) {
        const {idEscola, answer} = req.params;

        await db.pool.query("DELETE FROM TriagemEscola WHERE IdEscola = $1", [idEscola]);
        if (answer === "refuse") {
            await db.pool.query("DELETE FROM Escola WHERE Id = $1", [idEscola]);
        }
        res.status(201).send({message: "Escola respondida com sucesso!", body: {escola: req.body}});
    }

    export async function update(req: express.Request, res: express.Response) {
        const idEscola = parseInt(req.params.id);
        console.log(`backend/escolas: Atualizando escola de ID ${idEscola}`)

        const {nome} = req.body;

        await db.pool.query("UPDATE escola SET Nome = $1 WHERE Id = $2", [nome, idEscola]);
        res.status(200).send({message: "Escola atualizada com sucesso!"});
    }
}
