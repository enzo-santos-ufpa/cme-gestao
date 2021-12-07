import {ChangeEvent} from "react";


namespace Forms {
    type EventoCampo = ChangeEvent<HTMLInputElement>;

    type _Campo = { texto: string, erro?: string };

    export class Campo implements _Campo {
        texto: string;
        erro?: string;

        constructor(params?: _Campo) {
            this.texto = params?.texto ?? "";
            this.erro = params?.erro;
        }

        consome(evento: EventoCampo) {
            this.texto = evento.target.value;
        }

        valida(erro: string, esperado: (texto: string) => boolean) {
            if (esperado(this.texto)) {
                this.erro = undefined;
            } else if (!this.erro) {
                this.erro = erro;
            }
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

        campo(chave: T): Campo {
            return this.dados[chave];
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