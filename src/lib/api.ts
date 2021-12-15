import {EscolaAutorizada, EscolaBase, EscolaPendente} from "../models/Escola";
import {ModeloBD, Processo, RespostaCadastro} from "../models/tipos";
import {rede} from "./utils";

class APIEscola {
    private static async post(caminho: string, object: any): Promise<void> {
        await fetch(rede.urlAtual({esquema: "http", porta: 3030, caminho: caminho}), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(object),
        });
    }

    private static async get<T>(caminho: string, object?: any): Promise<T> {
        const url = (() => {
            const url = rede.urlAtual({esquema: "http", porta: 3030, caminho: caminho});
            return url + (object == null ? "" : ("?" + new URLSearchParams(object)));
        })();
        return await fetch(url)
            .then(response => response.json())
            .then(obj => obj as T);
    }

    async escola(id: number): Promise<ModeloBD<EscolaBase>> {
        return await APIEscola.get<ModeloBD<EscolaBase>>("api/escolas/ler", {id});
    }

    async criar(escola: EscolaBase): Promise<void> {
        await APIEscola.post("api/escolas/criar", escola);
    }

    async autorizadas(): Promise<ModeloBD<EscolaAutorizada>[]> {
        return APIEscola.get<any[]>("api/escolas/autorizadas")
            .then(json => json.map(child => child as ModeloBD<EscolaAutorizada>))
            .then(children => children.map(child => {
                const escola: ModeloBD<EscolaAutorizada> = {
                    ...child,
                    dataCriacao: new Date(child.dataCriacao),
                    processoAtual: new Processo({
                        ...child.processoAtual,
                        inicio: new Date(child.processoAtual.inicio),
                    }),
                };
                return escola;
            }));
    }

    async pendentes(): Promise<ModeloBD<EscolaPendente>[]> {
        return APIEscola.get<any[]>("api/escolas/pendentes")
            .then(children => children.map(child => child as ModeloBD<EscolaPendente>))
            .then(children => children.map(child => {
                return {
                    ...child,
                    dataCriacao: new Date(child.dataCriacao),
                    cadastro: {
                        ...child.cadastro,
                        dataInsercao: new Date(child.cadastro.dataInsercao)
                    }
                };
            }));
    }

    async answer(escola: ModeloBD<EscolaBase>, resposta: RespostaCadastro): Promise<void> {
        await APIEscola.post("api/escolas/cadastro/responder", {idEscola: escola.id, resposta});
    }
}

export const escolas = new APIEscola();
