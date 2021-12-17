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

    private static async get<T extends FlatEncoded<any>, R>(caminho: string, object?: T): Promise<R> {
        const url = (() => {
            const url = rede.urlAtual({esquema: "http", porta: 3030, caminho: caminho});
            return url + (object == null ? "" : ("?" + new URLSearchParams(object)));
        })();
        return await fetch(url)
            .then(response => response.json())
            .then(obj => obj as R);
    }

    async consulta(id: number): Promise<ModeloBD<EscolaBase>> {
        const data = await APIEscola.get("api/escolas/ler", {id: id.toString()});
        return encoding.modeloDB(encoding.escolaBase()).decode(data as any);
    }

    async criar(escola: EscolaBase): Promise<void> {
        const data = encoding.escolaBase().encode(escola);
        await APIEscola.post("api/escolas/criar", data);
    }

    async autorizadas(): Promise<ModeloBD<EscolaAutorizada>[]> {
        const data = await APIEscola.get("api/escolas/autorizadas");
        return encoding.lista(encoding.modeloDB(encoding.escolaAutorizada())).decode(data as any);
    }

    async pendentes(): Promise<ModeloBD<EscolaPendente>[]> {
        const data = await APIEscola.get("api/escolas/pendentes");
        console.log(data);
        return encoding.lista(encoding.modeloDB(encoding.escolaPendente())).decode(data as any);
    }

    async answer(escola: ModeloBD<EscolaBase>, resposta: RespostaCadastro): Promise<void> {
        await APIEscola.post("api/escolas/cadastro/responder", {id: escola.id.toString(), resposta});
    }
}

export const escolas = new APIEscola();
