import Validador from "./Validador";


namespace Forms {
    type _Campo<T> = {
        nome: string,
        valor: T,
        erro?: string,
        validador: Validador<T>,
    };

    export abstract class Campo<T> implements _Campo<T> {
        readonly nome: string;
        readonly validador: Validador<T>;
        valor: T;
        erro?: string;

        constructor(params: _Campo<T>) {
            this.nome = params.nome;
            this.valor = params.valor;
            this.erro = params.erro;
            this.validador = params.validador;
        }

        valida() {
            this.erro = this.validador.validate(this.valor);
        }

        abstract json(): string;
    }

    export class CampoTexto extends Campo<string> {
        constructor(params?: _Campo<string>) {
            super({
                nome: params?.nome ?? "",
                valor: params?.valor ?? "",
                erro: params?.erro,
                validador: params?.validador ?? new Validador<string>(),
            });
        }

        json(): string {
            return this.valor;
        }
    }

    export class CampoForm<T extends string> extends  Campo<Forms.Formulario<T>> {
        json(): string {
            return JSON.stringify(this.valor.json());
        }

    }

    export class CampoJSON<T> extends Campo<T> {
        json(): string {
            return JSON.stringify(this.valor);
        }
    }

    export class CampoArray<T> extends CampoJSON<Array<T>> {
        push(valor: T): void {
            this.valor.push(valor);
        }
    }

    type _Formulario<T extends string> = Record<T, Campo<any>>;

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
            return Object.fromEntries(chaves.map(chave => [chave, this.dados[chave].json()])) as Record<T, string>;
        }

        campo<R = string>(chave: T): Campo<R> {
            return this.dados[chave] as Campo<R>;
        }

        get chaves(): T[] {
            return Object.keys(this.dados) as T[];
        }

        get possuiErro(): boolean {
            const campos: Campo<any>[] = Object.values(this.dados);
            return campos.some(campo => campo.erro);
        }

        clone(): Formulario<T> {
            return new Formulario({...this.dados});
        }
    }
}

export default Forms;