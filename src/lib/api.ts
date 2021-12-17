import {encoding, EscolaAutorizada, EscolaBase, EscolaPendente, RespostaCadastro} from "../models/Escola";
import {FlatEncoded, ModeloBD} from "../models/tipos";
import {rede} from "./utils";

class APIEscola {
    private static async post<T extends FlatEncoded<any>>(caminho: string, object: T): Promise<void> {
        await fetch(rede.urlAtual({esquema: "http", porta: 3030, caminho: caminho}), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(object),
        });
    }

    private static async get<T extends FlatEncoded<any>, R extends FlatEncoded<any>>(caminho: string, object?: T): Promise<R> {
        const url = (() => {
            const url = rede.urlAtual({esquema: "http", porta: 3030, caminho: caminho});
            return url + (object == null ? "" : ("?" + new URLSearchParams(object)));
        })();
        return await fetch(url)
            .then(response => response.json())
            .then(obj => obj as R);
    }

    async escola(id: number): Promise<ModeloBD<EscolaBase>> {
        const data = await APIEscola.get("api/escolas/ler", {id: id.toString()});
        return encoding.modeloDB(encoding.escolaBase()).decode(data);
    }

    async criar(escola: EscolaBase): Promise<void> {
        const data = encoding.escolaBase().encode(escola);
        await APIEscola.post("api/escolas/criar", data);
    }

    async autorizadas(): Promise<ModeloBD<EscolaAutorizada>[]> {
        return [];
        // type Data = FlatEncoded<{ escolas: ModeloBD<EscolaAutorizada>[] }>;
        //
        // return APIEscola.get("api/escolas/autorizadas")
        //     .then(json => json.map(child => child as Data))
        //     .then(children => children.map(child => {
        //         const escola: ModeloBD<EscolaAutorizada> = {
        //             ...child,
        //             dataCriacao: new Date(child.dataCriacao),
        //             processoAtual: new Processo({
        //                 ...child.processoAtual,
        //                 inicio: new Date(child.processoAtual.inicio),
        //             }),
        //         };
        //         return escola;
        //     }));
    }

    async pendentes(): Promise<ModeloBD<EscolaPendente>[]> {
        return [];
        // return APIEscola.get<any[]>("api/escolas/pendentes")
        //     .then(children => children.map(child => child as ModeloBD<EscolaPendente>))
        //     .then(children => children.map(child => {
        //         return {
        //             ...child,
        //             dataCriacao: new Date(child.dataCriacao),
        //             cadastro: {
        //                 ...child.cadastro,
        //                 dataInsercao: new Date(child.cadastro.dataInsercao)
        //             }
        //         };
        //     }));
    }

    async answer(escola: ModeloBD<EscolaBase>, resposta: RespostaCadastro): Promise<void> {
        return;
        // await APIEscola.post("api/escolas/cadastro/responder", {idEscola: escola.id, resposta});
    }
}

export const escolas = new APIEscola();
