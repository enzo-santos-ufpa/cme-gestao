import {parseDate} from "../lib/utils";

type MetodoValidacao = (texto: string) => string | undefined;

export default class Validador {
    private readonly metodo: MetodoValidacao;

    constructor(metodo?: MetodoValidacao) {
        this.metodo = metodo ?? ((_) => undefined);
    }

    use(metodo: MetodoValidacao): Validador {
        return new Validador((texto) => {
            const erro = this.metodo(texto);
            if (erro != null) return erro;
            return metodo(texto);
        });
    }

    validate(texto: string): string | undefined {
        return this.metodo(texto);
    }
}

export namespace Validadores {
    export function required(erro?: string): MetodoValidacao {
        return (texto) => !texto.length ? (erro ?? "Insira este campo.") : undefined;
    }

    export function cnpj(erro?: string): MetodoValidacao {
        return (texto) => !texto.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/) ? (erro ?? "O CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX.") : undefined;
    }

    export function date(erro?: string): MetodoValidacao {
        return (texto) => parseDate(texto) == null ? (erro ?? "A data deve estar no formato DD/MM/YYYY.") : undefined;
    }

    export function cep(erro?: string): MetodoValidacao {
        return (texto) => !texto.match(/^\d{3}\.\d{2}-\d{3}$/) ? (erro ?? "O CEP deve estar no formato XXX.XX-XXX.") : undefined;
    }
}
