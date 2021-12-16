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

    export class Campo implements _Campo {
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

    type _Formulario<T extends string> = Record<T, Campo>;

    export class Formulario<T extends string> {
        private readonly dados: _Formulario<T>;

        constructor(dados: _Formulario<T>) {
            this.dados = dados;
        }

        valida(validador: (form: Formulario<T>) => void): boolean {
            validador(this);
            return !this.possuiErro;
        }

        json(): Record<T, string> {
            const chaves: T[] = Object.keys(this.dados) as T[];
            return Object.fromEntries(chaves.map(chave => [chave, this.dados[chave].texto])) as Record<T, string>;
        }

        campo<R extends Campo = Campo>(chave: T): R {
            return this.dados[chave] as R;
        }

        get chaves(): T[] {
            return Object.keys(this.dados) as T[];
        }

        get possuiErro(): boolean {
            const campos: Campo[] = Object.values(this.dados);
            return campos.some(campo => campo.erro);
        }

        clone(): Formulario<T> {
            return new Formulario({...this.dados});
        }
    }
}

export default Forms;