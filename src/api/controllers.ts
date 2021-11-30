import {db} from "./config";
import express from "express";

export namespace index {
    export async function info(req: express.Request, res: express.Response) {
        res.status(200).send({success: "true", message: "Gestão CME", version: "1.0.0"});
    }
}

export namespace escolas {
    export async function create(req: express.Request, res: express.Response) {
        const {nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia} = req.body;
        console.log(`backend/escolas: Criando escola ${nome}`)

        await db.query("INSERT INTO " +
            "escola (Nome, ProcessoAtual, Resolucao, TempoVigencia, DataInicioVigencia) " +
            "VALUES ($1, $2, $3, $4, $5)",
            [nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia],
        );

        res.status(201).send({message: "Escola adicionada com sucesso!", body: {escola: req.body}});
    }

    export async function read(req: express.Request, res: express.Response) {
        console.log("backend/escolas: Lendo escolas")

        const consulta = await db.query("SELECT * FROM escola ORDER BY Nome ASC");
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

    export async function update(req: express.Request, res: express.Response) {
        const idEscola = parseInt(req.params.id);
        console.log(`backend/escolas: Atualizando escola de ID ${idEscola}`)

        const {nome} = req.body;

        await db.query("UPDATE escola SET Nome = $1 WHERE Id = $2", [nome, idEscola]);
        res.status(200).send({message: "Escola atualizada com sucesso!"});
    }
}
