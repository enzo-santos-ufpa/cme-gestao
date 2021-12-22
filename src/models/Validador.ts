import {parseDate} from "../lib/utils";

type MetodoValidacao<T> = (valor: T) => string | undefined;

export default class Validador<T> {
    static texto(): Validador<string> {
        return new Validador<string>();
    }

    private readonly metodo: MetodoValidacao<T>;

    constructor(metodo?: MetodoValidacao<T>) {
        this.metodo = metodo ?? ((_) => undefined);
    }

    use(metodo: MetodoValidacao<T>): Validador<T> {
        return new Validador((texto) => {
            const erro = this.metodo(texto);
            if (erro != null) return erro;
            return metodo(texto);
        });
    }

    validate(valor: T): string | undefined {
        return this.metodo(valor);
    }
}

export namespace Validadores {
    export function min1(erro?: string): MetodoValidacao<Array<any>> {
        return (valor) => !valor.length ? (erro ?? "Selecione pelo menos um valor.") : undefined;
    }

    export function required(erro?: string): MetodoValidacao<string> {
        return (texto) => !texto.length ? (erro ?? "Insira este campo.") : undefined;
    }

    export function cnpj(erro?: string): MetodoValidacao<string> {
        return (texto) => !texto.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/) ? (erro ?? "O CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX.") : undefined;
    }

    export function date(erro?: string): MetodoValidacao<string> {
        return (texto) => parseDate(texto) == null ? (erro ?? "A data deve estar no formato DD/MM/YYYY.") : undefined;
    }

    export function cep(erro?: string): MetodoValidacao<string> {
        return (texto) => !texto.match(/^\d{3}\.\d{2}-\d{3}$/) ? (erro ?? "O CEP deve estar no formato XXX.XX-XXX.") : undefined;
    }
}
