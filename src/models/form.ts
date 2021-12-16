import {ChangeEvent} from "react";
import Validador from "./Validador";


namespace Forms {
    type EventoCampo = ChangeEvent<HTMLInputElement>;

    type _Campo = {
        nome: string,
        texto: string,
        erro?: string,
        validador: Validador,
        mask?: string,
    };

    type Campo = CampoSimples | CampoAninhado;

    export class CampoSimples implements _Campo {
        readonly nome: string;
        readonly validador: Validador;
        readonly mask?: string;
        texto: string;
        erro?: string;

        constructor(params?: _Campo) {
            this.nome = params?.nome ?? "";
            this.texto = params?.texto ?? "";
            this.erro = params?.erro;
            this.validador = params?.validador ?? new Validador();
            this.mask = params?.mask;
        }

        consome(evento: EventoCampo) {
            this.texto = evento.target.value;
        }

        valida() {
            this.erro = this.validador.validate(this.texto);
        }
    }

    export type CampoAninhado = { [k: string]: CampoSimples };

    type _Formulario<T extends string> = Record<T, Campo>;

    type ValorCampo = ValorCampoSimples | ValorCampoAninhado;
    export type ValorCampoSimples = string;
    export type ValorCampoAninhado = { [k: string]: string };

    export class Formulario<T extends string> {
        private readonly dados: _Formulario<T>;

        constructor(dados: _Formulario<T>) {
            this.dados = dados;
        }

        valida(validador: (form: Formulario<T>) => void): boolean {
            validador(this);
            return !this.possuiErro;
        }

        json(): Resultado<T> {
            const chaves: T[] = Object.keys(this.dados) as T[];
            const json = Object.fromEntries(chaves.map(chave => [chave, this.dados[chave].texto])) as Record<T, ValorCampo>;
            return new Resultado(json);
        }

        campo<R extends Campo = CampoSimples>(chave: T): R {
            return this.dados[chave] as R;
        }

        get chaves(): T[] {
            return Object.keys(this.dados) as T[];
        }

        get possuiErro(): boolean {
            const campos: CampoSimples[] = Object.values(this.dados);
            return campos.some(campo => campo.erro);
        }

        clone(): Formulario<T> {
            return new Formulario({...this.dados});
        }
    }

    export class Resultado<T extends string> {
        private readonly json: Record<T, ValorCampo>;

        constructor(json: Record<T, ValorCampo>) {
            this.json = json;
        }

        get<R extends ValorCampo = ValorCampoSimples>(key: T): R {
            return this.json[key] as R;
        }
    }
}

export default Forms;