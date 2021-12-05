import {db} from "./config";
import express from "express";

export namespace index {
    export function info(req: express.Request, res: express.Response) {
        res.status(200).send({success: "true", message: "Gestão CME", version: "1.0.0"});
    }
}

export namespace escolas {
    export async function criar(req: express.Request, res: express.Response) {
        const {nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia} = req.body;
        const consulta = await db.pool.query(`INSERT INTO 
            Escola (Nome, ProcessoAtual, Resolucao, TempoVigencia, DataInicioVigencia) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING Id`,
            [nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia],
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
