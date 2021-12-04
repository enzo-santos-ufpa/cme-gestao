import Escola from "../models/Escola";
import {
    DistritoAdmnistrativo,
    FiltroEscolasBD,
    ModeloBD,
    Processo,
    RespostaCadastro,
    SetorEscola
} from "../models/tipos";
import {networkInterfaces} from "os";
import {logger} from "./utils";

class APIEscola {
    private static async post(caminho: string, object: any): Promise<void> {
        await fetch(APIEscola.url(caminho), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(object),
        });
    }

    private static async get(caminho: string, object: any) {
        const log = logger.client.at("APIEscola#get").log;
        const url = APIEscola.url(caminho) + "?" + new URLSearchParams(object);
        log(`Getting ${url}`)
        return await fetch(url);
    }

    private static url(caminho: string): string {
        const address = Object.values(networkInterfaces())
            .flatMap(child => child)
            .find(network => network.family === "IPv4" && !network.internal)
            ?.address || "localhost";

        const result = `http://${address}:3030/${caminho}`;
        console.log(`Conectando a ${result}`)
        return result;
    }

    async create(nome: string, processoAtual: string, resolucao: string, tempoVigencia: number, dataInicioVigencia: Date): Promise<void> {
        await APIEscola.post(
            "api/escolas",
            {nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia},
        ).catch(_ => {
        });
    }

    async read(filtro?: FiltroEscolasBD): Promise<ModeloBD<Escola>[]> {
        const log = logger.client.at("APIEscola#read").log;
        log(`Filtrando por ${filtro}`)
        return APIEscola.get("api/escolas", filtro)
            .then(response => response.json())
            .then(json => json as any[])
            .then(json => json.map(child => {
                const {id, nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia} = child;
                return {
                    id: id,
                    nome: nome,
                    processoAtual: new Processo(
                        processoAtual,
                        resolucao,
                        new Date(dataInicioVigencia),
                        tempoVigencia,
                    ),
                    cep: "000.00-000",
                    contatoDiretor: {telefone: "(91) 9 9999-9999", whatsapp: "None", email: "abc@def.com"},
                    contatoSecretario: {telefone: "(91) 9 9888-8888", whatsapp: "None", email: "ghi@jkl.com"},
                    email: "escola@escola.com",
                    bairro: "Parque Verde",
                    cidade: "Belém",
                    cnpj: "11111111111111",
                    cnpjConselho: "22222222222222",
                    codigoInep: "33333333",
                    convenioSemec: {numConvenio: 4, objeto: "ABC-DEF", vigencia: "GHI"},
                    dataCriacao: new Date(Date.now()),
                    filiais: [],
                    distrito: DistritoAdmnistrativo.DABEN,
                    endereco: "Um Dois Três da Silva Quatro",
                    telefone: "(91) 9 9777-7777",
                    uf: "PA",
                    sigla: "EMEF",
                    tipo: {nome: "EMEF", setor: SetorEscola.publico},
                    modalidadeEnsino: {nome: "Infantil", etapa: {nome: "Pré-escola"}},
                    vigenciaConselho: "5"
                };
            }))
            .catch(_ => []);
    }

    async answer(escola: ModeloBD<Escola>, resposta: RespostaCadastro): Promise<void> {
        await APIEscola.post("api/escolas/responderCadastro", {idEscola: escola.id, resposta});
    }
}

export const escolas = new APIEscola();
