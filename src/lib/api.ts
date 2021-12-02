import Escola from "../models/Escola";
import {DistritoAdmnistrativo, Processo, SetorEscola} from "../models/tipos";
import {networkInterfaces} from "os";


class APIEscola {
    private static url(caminho: string): string {
        const address = Object.values(networkInterfaces())
            .flatMap(child => child)
            .find(network => network.family === "IPv4" && !network.internal)
            ?.address || "localhost";

        const result = `http://${address}:3030/${caminho}`;
        console.log(`Conectando a ${result}`)
        return result;
    }

    async create(nome: string, processoAtual: string, resolucao: string, tempoVigencia: number, dataInicioVigencia: Date) {
        return await fetch(APIEscola.url("api/escolas"), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia}),
        }).catch(_ => {
        });
    }

    async read(): Promise<Escola[]> {
        return await fetch(APIEscola.url("api/escolas"))
            .then(response => response.json())
            .then(json => json as any[])
            .then(json => json.map(child => {
                const {nome, processoAtual, resolucao, tempoVigencia, dataInicioVigencia} = child;
                return {
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
}

export const escolas = new APIEscola();
