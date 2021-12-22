import db from "./config";
import express from "express";
import {
    encoding,
    EscolaAutorizada,
    EscolaBase,
    EscolaPendente,
    ModalidadeEnsino,
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
    async function parseServidores(id: number): Promise<Record<"diretor" | "secretario" | "coordenador", Servidor>> {
        function toServidor<K extends "Diretor" | "Secretario" | "Coordenador">(map: Map<string, any>, key: K): Servidor {
            const row = map.get(key);
            return {
                nome: row["nome"] as string,
                email: row["email"] as string,
                telefone: row["telefone"] as string,
            };
        }

        const consulta = await db.positional(
            `SELECT *
             FROM ServidorEscola
             WHERE IdEscola = $1`,
            [id],
        );
        const mapeamento = new Map<string, any>();
        consulta.rows.forEach(row => mapeamento.set(row["tipo"], row));
        return {
            diretor: toServidor(mapeamento, "Diretor"),
            secretario: toServidor(mapeamento, "Secretario"),
            coordenador: toServidor(mapeamento, "Coordenador"),
        };
    }

    async function parseModalidadesEnsino(id: number): Promise<ModalidadeEnsino[]> {
        return [];
    }

    async function parseEscolaBase(row: any): Promise<ModeloBD<EscolaBase>> {
        const id = row.id;
        const servidores = await parseServidores(id);
        const modalidades = await parseModalidadesEnsino(id);
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
            ...servidores,
            modalidadesEnsino: modalidades,
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
        try {
            let consulta;
            const data = encoding.escolaBase().decode(req.body as FlatEncoded<EscolaBase>);

            // language=SQL format=false
            consulta = await db.positional(`SELECT Id FROM SiglaEscola WHERE Nome = $1`, [data.sigla]);
            if (!consulta.rows.length) {
                return res.status(401).send({error: `Sigla inválida: ${data.sigla}`});
            }
            const idSigla = consulta.rows.pop()["id"];

            // language=SQL format=false
            consulta = await db.named(`INSERT INTO
                Escola (Nome, DataCriacao, CodigoINEP, CNPJ, CNPJConselho, VigenciaConselho, NomeEntidadeMantenedora, Email, Telefone, IdSigla)
                VALUES(:nome, :dataCriacao, :codigoInep, :cnpj, :cnpjConselho, :vigenciaConselho, :nomeEntidadeMantenedora, :email, :telefone, :idSigla)`,
                {...data, idSigla});

            const escola: ModeloBD<EscolaBase> = {...data, id: consulta.rows.pop()};

            // language=SQL format=false
            await db.named(`INSERT INTO
                EnderecoEscola (IdEscola, Distrito, Endereco, Cidade, UF, Bairro, CEP)
                VALUES (:id, :distrito, :endereco, :cidade, :uf, :bairro, :cep)`,
                {...escola});

            for (const modalidade of escola.modalidadesEnsino) {
                // language=SQL format=false
                consulta = await db.positional(`SELECT
                    ModalidadeEnsino.Id
                    FROM ModalidadeEnsino
                    JOIN EtapaEnsino ON EtapaEnsino.Id = ModalidadeEnsino.IdEtapa
                    WHERE EtapaEnsino.Nome = $1 AND ModalidadeEnsino.Nome = $2`,
                    [modalidade.etapa, modalidade.nome]);

                if (!consulta.rows.length) {
                    return res.status(401).send({error: `Modalidade inválida: ${modalidade}`});
                }
                const idModalidade = consulta.rows.pop()["id"];

                // language=SQL format=false
                await db.positional(`INSERT INTO
                    ModalidadeEscola (IdEscola, IdModalidade)
                    VALUES ($1, $2)`,
                    [escola.id, idModalidade])
            }

            const convenio = escola.convenioSemec;
            if (convenio != null) {
                // language=SQL format=false
                await db.positional(`INSERT INTO
                    ConvenioSEMEC (Id, IdEscola, Objeto, Vigencia)
                    VALUES ($1, $2, $3, $4)`,
                    [convenio.numConvenio, escola.id, convenio.objeto, convenio.vigencia])
            }

            const servidores: Record<string, Servidor> = {
                diretor: escola.diretor,
                secretario: escola.secretario,
                coordenador: escola.coordenador
            };
            for (const [tipo, servidor] of Object.entries(servidores)) {
                if (servidor == null) continue;

                // language=SQL format=false
                await db.positional(`INSERT INTO
                    ServidorEscola (IdEscola, Tipo, Nome, Email, Telefone)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [escola.id, tipo, servidor.nome, servidor.email, servidor.telefone]);
            }

            // TODO add DocumentoEnviado
            // TODO add Filial

            // language=SQL format=false
            await db.positional(`INSERT INTO
                TriagemEscola (IdEscola, DataInsercao)
                VALUES ($1, $2)`,
                [escola.id, new Date()]);

        } catch (e) {
            return res.status(401).send({error: e + ""});
        }
        return res.status(201).send({message: "Escola adicionada com sucesso!", body: {escola: req.body}});
    }

    export async function consultar(req: express.Request, res: express.Response) {
        let consulta;

        // language=SQL format=false
        consulta = await db.positional(`SELECT 
                Escola.Id,
                Escola.Nome,
                Escola.DataCriacao,
                Escola.CodigoINEP,
                Escola.CNPJ,
                Escola.CNPJConselho,
                Escola.VigenciaConselho,
                Escola.NomeEntidadeMantenedora,
                Escola.Email,
                Escola.Telefone,
                EnderecoEscola.Distrito,
                EnderecoEscola.Endereco,
                EnderecoEscola.Cidade,
                EnderecoEscola.UF,
                EnderecoEscola.Bairro,
                ConvenioSemec.Id as IdConvenioSEMEC,
                ConvenioSemec.Objeto,
                ConvenioSemec.Vigencia,
                ProcessoEscola.Id,
                ProcessoEscola.Nome,
                ProcessoEscola.Resolucao,
                ProcessoEscola.DataInicioVigencia,
                ProcessoEscola.TempoVigencia,
                TriagemEscola.DataInsercao as DataInsercaoTriagem
            FROM Escola
            JOIN EnderecoEscola ON Escola.Id = EnderecoEscola.IdEscola
            LEFT JOIN ConvenioSEMEC ON Escola.Id = ConvenioSEMEC.IdEscola
            LEFT JOIN ProcessoEscola ON Escola.Id = ProcessoEscola.IdEscola
            LEFT JOIN TriagemEscola ON Escola.Id = TriagemEscola.IdEscola 
            WHERE Escola.Id = $1`,
            [req.query.id]);

        const rows = consulta.rows;
        switch (rows.length) {
            case 0: {
                return res.status(404).send({error: "Escola com o ID fornecido não existe"});
            }
            case 1: {
                const row = rows.pop();
                const {id} = row;
                // language=SQL format=false
                consulta = await db.positional(`SELECT
                        (
                            SELECT
                                EtapaEnsino.Nome as NomeEtapa,
                                ModalidadeEnsino.Nome as NomeModalidade
                            FROM ModalidadeEnsino
                            JOIN EtapaEnsino ON EtapaEnsino.Id = ModalidadeEnsino.IdEtapa
                            WHERE ModalidadeEnsino.Id = ModalidadeEscola.IdModalidade
                        )
                    FROM ModalidadeEscola
                    WHERE ModalidadeEscola.IdEscola = $1`,
                    [id]);

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
            const consulta = await db.positional(`SELECT *
                                             FROM Escola
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
            const consulta = await db.positional(`
                SELECT *,
                       Escola.Id AS EscolaId
                FROM Escola
                         JOIN EnderecoEscola ON Escola.Id = EnderecoEscola.IdEscola
                         LEFT JOIN ConvenioSEMEC ON Escola.Id = ConvenioSEMEC.IdEscola
                         LEFT JOIN TriagemEscola ON Escola.Id = TriagemEscola.IdEscola
                WHERE TriagemEscola.IdEscola IS NULL;
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
            await db.positional("DELETE FROM TriagemEscola WHERE IdEscola = $1", [id]);
            if (resposta === "refuse") {
                await db.positional("DELETE FROM ServidorEscola WHERE IdEscola = $1", [id]);
                await db.positional("DELETE FROM EnderecoEscola WHERE IdEscola = $1", [id]);
                await db.positional("DELETE FROM Escola WHERE Id = $1", [id]);
            }
        } catch (e) {
            console.log(e);
            return res.status(401).send({error: e});
        }
        res.status(201).send({});
    }
}
